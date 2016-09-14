import React, { Component } from 'react';
import { Grid, Row, Col, ResponsiveEmbed, Button, ButtonToolbar, Glyphicon, Image } from 'react-bootstrap';
import AddEntryControls from './AddEntryControls';
import captureVideoFrame from 'capture-video-frame';
import _ from 'lodash';
import ReactCountdownClock from 'react-countdown-clock';

const mediaConstraints = {
    audio: false,
    video: true
};

class Camera extends Component {

    constructor(props) {
        super(props);

        this.state = {
            connecting: true,
            streaming: false,
            stream: null,
            streamURL: null,
            image: null,
            thumbnail: null,
            devices: [],
            activeDevice: null
        }

        this.startMediaStream = this.startMediaStream.bind(this);
        this.stopMediaStream = this.stopMediaStream.bind(this);
        this.onMediaSuccess = this.onMediaSuccess.bind(this);
        this.onMediaFailure = this.onMediaFailure.bind(this);
        this.startCountdown = _.debounce(this.startCountdown.bind(this), 500, {leading: true, trailing: false});
        this.shutter = this.shutter.bind(this);
        this.save = this.save.bind(this);
        this.onMediaFailure = this.onMediaFailure.bind(this);
        this.getVideoDevices = this.getVideoDevices.bind(this);
        this.switchVideoDevices = _.debounce(this.switchVideoDevices.bind(this), 500, {leading: true, trailing: false});
        this.getCountdownSize = this.getCountdownSize.bind(this);
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
        this.setState({
            connecting: false,
            streaming: true,
            streamURL: URL.createObjectURL(stream),
            stream: stream
        });
    }

    onMediaFailure(error) {
        this.props.onFailure(error);
    }

    stopMediaStream(){
        this.state.stream.getTracks().map((track) => track.stop());
    }

    startCountdown() {
        this.setState({
            image: null,
            thumbnail: null,
            countdown: true
        });
    }

    shutter() {
        const image = captureVideoFrame(this._viewfinder, 'png');
        this.setState({
            countdown: false,
            image: image,
            thumbnail: image
        });
    }

    save() {
        // Pass the blobs up
        this.props.save({
            image: this.state.image.blob,
            imageThumbnail: this.state.thumbnail.blob
        });
    }

    getCountdownSize(){
        var video = this._viewfinder;
        var dimensions = video.getBoundingClientRect();
        return _.min([dimensions.height, dimensions.width]) * 0.9;
    }

    render() {
        return (
            <Grid>
                <Row>
                    <Col>
                        <div style={{ position: 'relative' }}>
                            { this.state.connecting &&
                                <ResponsiveEmbed a4by3>
                                    <div className="connecting" />
                                </ResponsiveEmbed>
                            }
                            { this.state.streaming &&
                                <ResponsiveEmbed a4by3>
                                    <video
                                        ref={(ref) => { this._viewfinder = ref; }}
                                        src={this.state.streamURL}
                                        muted
                                        autoPlay
                                        />
                                </ResponsiveEmbed>
                            }
                            { this.state.thumbnail &&
                                <div style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        backgroundColor: 'rgba(0,0,0,0.5)'
                                    }}>
                                    <div style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            margin: 'auto',
                                            width: '60%',
                                            height: '60%'
                                        }}>
                                        <ResponsiveEmbed a4by3>
                                            <Image
                                                src={this.state.thumbnail.dataUri}
                                                alt="The photo you just took"
                                                />
                                        </ResponsiveEmbed>
                                    </div>
                                </div>
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
                                            onComplete={this.shutter} />
                                </div>
                            }
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <ButtonToolbar className="toolbar-center">
                            <Button bsStyle="primary" bsSize="large" block
                              disabled={!this.state.streaming}
                              onClick={this.startCountdown}>
                              <Glyphicon glyph="record" /> Take Picture
                            </Button>
                        </ButtonToolbar>
                        { this.state.devices.length > 1 &&
                            <ButtonToolbar>
                                <Button bsStyle="primary" bsSize="large" block
                                    onClick={this.switchVideoDevices}>
                                    <Glyphicon glyph="refresh" /> Switch Cameras
                                </Button>
                            </ButtonToolbar>
                        }
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <AddEntryControls
                            onNext={this.save}
                            disableNext={!this.state.image}
                            />
                    </Col>
                </Row>
            </Grid>
        );
    }
}

Camera.propTypes = {
    save: React.PropTypes.func.isRequired,
    onFailure: React.PropTypes.func.isRequired,
    countdownSeconds: React.PropTypes.number
};
Camera.defaultProps = {
    countdownSeconds: 5
};
/**
 * Expose a test for media capabilities for use by other components
 */
Camera.mediaCheck = function(){
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

export default Camera;
