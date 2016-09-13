import React, { Component } from 'react';
import { Grid, Row, Col, ResponsiveEmbed, Button, ButtonToolbar, Glyphicon } from 'react-bootstrap';
import AddControls from './AddControls';
import ReactCountdownClock from 'react-countdown-clock';
import MediaStreamRecorder from 'msr';
import captureVideoFrame from 'capture-video-frame';
import _ from 'lodash';

var mediaConstraints = {
    audio: true,
    video: true
};

class VideoRecorder extends Component {

    constructor(props) {
        super(props);

        this.state = {
            playing: false,
            recording: false,
            mediaRecorder: null,
            streamURL: null,
            lastTakeURL: null,
            lastTakeBlob: null,
            thumbnailBlob: null,
            devices: [],
            activeDevice: null
        }

        this.startMediaStream = this.startMediaStream.bind(this);
        this.stopMediaStream = this.stopMediaStream.bind(this);
        this.startCountdown = _.debounce(this.startCountdown.bind(this), 500, {leading: true, trailing: false});
        this.startRecording = this.startRecording.bind(this);
        this.stopRecording = _.debounce(this.stopRecording.bind(this), 500, {leading: true, trailing: false});
        this.onMediaSuccess = this.onMediaSuccess.bind(this);
        this.onMediaFailure = this.onMediaFailure.bind(this);
        this.onRecordingFinished = this.onRecordingFinished.bind(this);
        this.replayLastTake = this.replayLastTake.bind(this);
        this.discardLastTake = this.discardLastTake.bind(this);
        this.save = this.save.bind(this);
        this.onMediaFailure = this.onMediaFailure.bind(this);
        this.getVideoDevices = this.getVideoDevices.bind(this);
        this.getCountdownSize = this.getCountdownSize.bind(this);
        this.switchVideoDevices = _.debounce(this.switchVideoDevices.bind(this), 500, {leading: true, trailing: false});
    }

    componentWillMount() {
        this.startMediaStream();
    }

    componentWillUnmount() {
        this.stopMediaStream();
    }

    startMediaStream(){
        // First get a hold of getUserMedia, if present
		const getUserMedia = (navigator.getUserMedia ||
				navigator.webkitGetUserMedia ||
				navigator.mozGetUserMedia ||
				navigator.msGetUserMedia);

        if (!getUserMedia) {
            this.setState({ mediaFailure: {name: 'getUserMediaUnsupported'}});
            return;
        }

        this.getVideoDevices().then((devices) => {
            var activeDevice = this.state.activeDevice || devices[0].deviceId;
            mediaConstraints.video = {
                optional: [{
                    sourceId: activeDevice
                }]
            };
            this.setState({
                activeDevice: activeDevice,
                devices: devices
            });
            getUserMedia.call(navigator, mediaConstraints, this.onMediaSuccess, this.onMediaFailure);
        });
    }

    getVideoDevices() {
        return navigator.mediaDevices.enumerateDevices().then((devices) => {
            return _.filter(devices, {kind: 'videoinput'});
        });
    }

    switchVideoDevices() {
        var currentIndex = _.findIndex(this.state.devices, {deviceId: this.state.activeDevice});
        var nextIndex = (currentIndex + 1) % this.state.devices.length;
        var newDevice = this.state.devices[nextIndex].deviceId || this.state.activeDevice;
        this.setState({activeDevice: newDevice}, () => {
            this.stopMediaStream();
            this.startMediaStream();
        });
    }

    onMediaSuccess(stream) {
        const mediaRecorder = new MediaStreamRecorder(stream);
        mediaRecorder.stream = stream;
        mediaRecorder.ondataavailable = this.onRecordingFinished;

        this.setState({
            streaming: true,
            streamURL: URL.createObjectURL(stream),
            mediaRecorder: mediaRecorder
        });
    }

    onMediaFailure(error) {
        this.props.onFailure(error);
    }

    startCountdown() {
        this.setState({
            countdown: true,
            streaming: true,
            playing: false,
            recording: false
        });
    }

    startRecording() {
        this.state.mediaRecorder.start();
        this.setState({
            countdown: false,
            streaming: true,
            playing: false,
            recording: true,
            lastTakeURL: null,
            lastTakeBlob: null
        });
    }

    stopRecording() {
        this.state.mediaRecorder.stop();
        this.setState({
            recording: false
        });
    }

    onRecordingFinished(blob) {
        this.setState({
            lastTakeURL: URL.createObjectURL(blob),
            lastTakeBlob: blob
        }, () => this.replayLastTake());
    }

    replayLastTake() {
        this.setState({
            streaming: false,
            playing: true
        });
    }

    discardLastTake() {
        this.setState({
            streaming: true,
            playing: false,
            lastTakeURL: null,
            lastTakeBlob: null
        });
    }

    stopMediaStream(){
        this.state.mediaRecorder.stream.getTracks().map((track) => track.stop());
    }

    save() {
        // Take a thumb from the replay, or from the recorder if it is a direct save
        const thumb = captureVideoFrame(this._player, 'png')
            || captureVideoFrame(this._recorder, 'png');
        this.props.save({
            video: this.state.lastTakeBlob,
            videoThumbnail: thumb.blob
        });
    }

    getCountdownSize(){
        var video = this._recorder || this._player;
        var dimensions = video.getBoundingClientRect();
        return _.min([dimensions.height, dimensions.width]) * 0.9;
    }

    render() {
        return (
            <Grid>
                <Row>
                    <Col>
                        <div style={{ position: 'relative' }}>
                            { this.state.streaming &&
                                <ResponsiveEmbed a4by3>
                                    <video
                                        ref={(ref) => { this._recorder = ref }}
                                        src={this.state.streamURL}
                                        muted
                                        autoPlay
                                        />
                                </ResponsiveEmbed>
                            }
                            { this.state.playing &&
                                <ResponsiveEmbed a4by3>
                                    <video
                                        ref={(ref) => { this._player = ref }}
                                        src={this.state.lastTakeURL}
                                        controls
                                        autoPlay
                                        />
                                </ResponsiveEmbed>
                            }
                            {  this.state.countdown &&
                                <div style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        backgroundColor: 'rgba(0,0,0,0)'
                                    }}>
                                        <ReactCountdownClock
                                            seconds={this.props.countdownSeconds}
                                            size={this.getCountdownSize()}
                                            color="#a3dfef"
                                            alpha={0.9}
                                            showMilliseconds={false}
                                            onComplete={this.startRecording} />
                                </div>
                            }
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <ButtonToolbar className="toolbar-center">
                            <Button block
                                disabled={this.state.recording}
                                onClick={this.startCountdown}>
                              <Glyphicon glyph="record" /> Record
                            </Button>
                            <Button block
                                disabled={!this.state.recording}
                                onClick={this.stopRecording}>
                              <Glyphicon glyph="stop" /> Stop
                            </Button>
                            { this.state.devices.length > 1 &&
                                <Button bsStyle="primary" bsSize="large" block
                                    onClick={this.switchVideoDevices}>
                                    <Glyphicon glyph="refresh" /> Switch Camera
                                </Button>
                            }
                        </ButtonToolbar>
                    </Col>
                    <Col>
                        <AddControls
                            onNext={this.save}
                            disableNext={!this.state.lastTakeURL && !this.state.playing}
                            />
                    </Col>
                </Row>
            </Grid>
        );
    }
}

VideoRecorder.propTypes = {
    save: React.PropTypes.func.isRequired,
    onFailure: React.PropTypes.func.isRequired,
    countdownSeconds: React.PropTypes.number
};
VideoRecorder.defaultProps = {
    countdownSeconds: 5
};
/**
 * Expose a test for media capabilities for use by other components
 */
VideoRecorder.mediaCheck = function(){
    return new Promise(function(resolve, reject){
        function mediaOK (stream) {
            stream.getTracks().map((track) => track.stop());
            resolve();
        }

        function mediaFail (error) {
            reject(error);
        }

        // First get a hold of getUserMedia, if present
    	const getUserMedia = (navigator.getUserMedia ||
    			navigator.webkitGetUserMedia ||
    			navigator.mozGetUserMedia ||
    			navigator.msGetUserMedia);

        if (!getUserMedia) {
            reject({name: 'getUserMediaUnsupported'});
        } else {
            getUserMedia.call(navigator, mediaConstraints, mediaOK, mediaFail);// First get a hold of getUserMedia, if present
        }

    });
};

export default VideoRecorder;
