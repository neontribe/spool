import React, { Component } from 'react';
import { Grid, Row, Col, ResponsiveEmbed, Button, ButtonToolbar, Glyphicon } from 'react-bootstrap';
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
        this.startRecording = _.debounce(this.startRecording.bind(this), 500);
        this.stopRecording = _.debounce(this.stopRecording.bind(this), 500);
        this.onMediaSuccess = this.onMediaSuccess.bind(this);
        this.onMediaFailure = this.onMediaFailure.bind(this);
        this.onRecordingFinished = this.onRecordingFinished.bind(this);
        this.replayLastTake = this.replayLastTake.bind(this);
        this.discardLastTake = this.discardLastTake.bind(this);
        this.save = _.debounce(this.save.bind(this), 500);
        this.onMediaFailure = this.onMediaFailure.bind(this);
        this.getVideoDevices = this.getVideoDevices.bind(this);
        this.switchVideoDevices = _.debounce(this.switchVideoDevices.bind(this), 500);
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

    startRecording() {
        this.state.mediaRecorder.start();
        this.setState({
            recording: true,
            lastTakeURL: null
        });
    }

    stopRecording() {
        this.state.mediaRecorder.stop();
        //this.state.mediaRecorder.stream.stop();
        this.setState({
            recording: false
        });
    }

    onRecordingFinished(blob) {
        this.setState({
            lastTakeURL: URL.createObjectURL(blob),
            lastTakeBlob: blob
        });
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

    render() {
        return (
            <Grid>
                <Row>
                    <Col xs={12}>
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
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <ButtonToolbar className="toolbar-center">
                            { (!this.state.recording) &&
                                <Button block onClick={this.startRecording}>
                                  <Glyphicon glyph="record" /> Record
                                </Button>
                            }
                            { this.state.recording &&
                                <Button block onClick={this.stopRecording}>
                                  <Glyphicon glyph="stop" /> Stop Recording
                                </Button>
                            }
                            { this.state.devices.length > 1 &&
                                <Button bsStyle="primary" bsSize="large" block
                                    onClick={this.switchVideoDevices}>
                                    <Glyphicon glyph="refresh" /> Switch Cameras
                                </Button>
                            }
                        </ButtonToolbar>
                    </Col>
                    <Col xs={12}>
                        <ButtonToolbar className="toolbar-center">
                          <Button disabled={!this.state.lastTakeURL && !this.state.playing}
                              onClick={this.replayLastTake}>
                            <Glyphicon glyph="play"/> Replay
                          </Button>

                          <Button disabled={!this.state.lastTakeURL && !this.state.playing}
                              onClick={this.discardLastTake}>
                            <Glyphicon glyph="trash"/> Delete
                          </Button>

                          <Button disabled={!this.state.lastTakeURL && !this.state.playing}
                              onClick={this.save}>
                            <Glyphicon glyph="save"/> Save
                          </Button>
                      </ButtonToolbar>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

VideoRecorder.propTypes = {
    save: React.PropTypes.func.isRequired,
    onFailure: React.PropTypes.func.isRequired
};
VideoRecorder.defaultProps = {};
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
