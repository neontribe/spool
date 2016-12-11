import React, { Component } from 'react';
import ReactCountdownClock from 'react-countdown-clock';
import MediaStreamRecorder from 'msr';
import captureVideoFrame from 'capture-video-frame';
import _ from 'lodash';

import Grid from './Grid';
import AddControls from './AddControls';

import styles from './css/VideoRecorder.module.css';
import controls from '../css/Controls.module.css';
import headings from '../css/Headings.module.css';

var mediaConstraints = {
    audio: true,
    video: true
};

class VideoRecorder extends Component {
    constructor (props) {
        super(props);

        this.state = {
            connecting: true,
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
        this.startCountdown = _.debounce(this.startCountdown.bind(this), 500, { leading: true, trailing: false });
        this.startRecording = this.startRecording.bind(this);
        this.stopRecording = _.debounce(this.stopRecording.bind(this), 500, { leading: true, trailing: false });
        this.onMediaSuccess = this.onMediaSuccess.bind(this);
        this.onMediaFailure = this.onMediaFailure.bind(this);
        this.onRecordingFinished = this.onRecordingFinished.bind(this);
        this.replayLastTake = this.replayLastTake.bind(this);
        this.discardLastTake = this.discardLastTake.bind(this);
        this.save = this.save.bind(this);
        this.onMediaFailure = this.onMediaFailure.bind(this);
        this.getVideoDevices = this.getVideoDevices.bind(this);
        this.getCountdownSize = this.getCountdownSize.bind(this);
        this.switchVideoDevices = _.debounce(this.switchVideoDevices.bind(this), 500, { leading: true, trailing: false });
        this.showDescripton = this.showDescripton.bind(this);
        this.hideDescripton = this.hideDescripton.bind(this);
        this.onTextChange = this.onTextChange.bind(this);
    }

    componentWillMount () {
        this.startMediaStream();
    }

    componentWillUnmount () {
        this.stopMediaStream();
    }

    startMediaStream () {
        // First get a hold of getUserMedia, if present
		const getUserMedia = (navigator.getUserMedia ||
				navigator.webkitGetUserMedia ||
				navigator.mozGetUserMedia ||
				navigator.msGetUserMedia);

        if (!getUserMedia) {
            this.setState({
                mediaFailure: {
                    name: 'getUserMediaUnsupported'
                }
            });

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

    getVideoDevices () {
        return navigator.mediaDevices.enumerateDevices().then((devices) => {
            return _.filter(devices, { kind: 'videoinput' });
        });
    }

    switchVideoDevices() {
        var currentIndex = _.findIndex(this.state.devices, { deviceId: this.state.activeDevice });
        var nextIndex = (currentIndex + 1) % this.state.devices.length;
        var newDevice = this.state.devices[nextIndex].deviceId || this.state.activeDevice;

        this.setState({
            activeDevice: newDevice
        }, () => {
            this.stopMediaStream();
            this.startMediaStream();
        });
    }

    onMediaSuccess (stream) {
        const mediaRecorder = new MediaStreamRecorder(stream);

        mediaRecorder.stream = stream;
        mediaRecorder.ondataavailable = this.onRecordingFinished;

        this.setState({
            connecting: false,
            streaming: true,
            streamURL: URL.createObjectURL(stream),
            mediaRecorder: mediaRecorder
        });
    }

    onMediaFailure (error) {
        this.props.onFailure(error);
    }

    startCountdown () {
        this.setState({
            countdown: true,
            streaming: true,
            playing: false,
            recording: false
        });
    }

    startRecording () {
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

    stopRecording () {
        this.state.mediaRecorder.stop();

        this.setState({
            recording: false
        });
    }

    onRecordingFinished (blob) {
        this.setState({
            lastTakeURL: URL.createObjectURL(blob),
            lastTakeBlob: blob
        }, () => this.replayLastTake());
    }

    replayLastTake () {
        this.setState({
            streaming: false,
            playing: true
        });
    }

    discardLastTake () {
        this.setState({
            streaming: true,
            playing: false,
            lastTakeURL: null,
            lastTakeBlob: null
        });
    }

    stopMediaStream () {
        this.state.mediaRecorder.stream.getTracks().map((track) => track.stop());
    }

    save () {
        // Take a thumb from the replay, or from the recorder if it is a direct save
        const thumb = captureVideoFrame(this._player, 'png')
            || captureVideoFrame(this._recorder, 'png');

        this.props.save({
            video: this.state.lastTakeBlob,
            videoThumbnail: thumb.blob
        });
    }

    getCountdownSize () {
        var video = this._recorder || this._player;
        var dimensions = video.getBoundingClientRect();

        return _.min([dimensions.height, dimensions.width]) * 0.9;
    }

    showDescripton () {
        this.setState({
            showDescriptionField: true
        });
    }

    hideDescripton () {
        this.setState({
            showDescriptionField: false
        });
    }

    onTextChange (event) {
        this.setState({
            text: event.target.value
        });
    }

    render () {
        return (
            <div className={styles.wrapper}>
                {this.state.showDescriptionField && (
                    <div className={styles.description}>
                        <h2 className={headings.regular}>Add a description</h2>
                        <textarea
                            className={styles.textarea}
                            value={this.state.text}
                            onChange={this.onTextChange}
                        ></textarea>
                        <button
                            className={controls.btnRaised}
                            onClick={this.hideDescripton}
                        >Close</button>
                    </div>
                )}

                <Grid enforceConsistentSize={true}>
                    <div className={styles.outputWrapper}>
                        {/*this.state.connecting && (
                            <div className='connecting' />
                        )*/}

                        {this.state.streaming && (
                            <video
                                className={styles.video}
                                ref={(ref) => { this._recorder = ref }}
                                src={this.state.streamURL}
                                muted={true}
                                autoPlay={true}
                            />
                        )}

                        {this.state.streaming && !this.state.countdown && (
                            <button
                                className={styles.videoOverlay}
                                onClick={this.startCountdown}
                            >
                                <span className={styles.btnTakePictureWrapper}>
                                    <span className={styles.btnTakePicture}>Press Here To Record</span>
                                </span>
                            </button>
                        )}

                        {this.state.playing && (
                            <video
                                className={styles.video}
                                ref={(ref) => { this._player = ref }}
                                src={this.state.lastTakeURL}
                                controls={true}
                                autoPlay={true}
                            />
                        )}

                        {this.state.countdown && (
                            <div className={styles.countdown}>
                                <ReactCountdownClock
                                    seconds={this.props.countdownSeconds}
                                    size={this.getCountdownSize()}
                                    font='Open Sans'
                                    color='#212121'
                                    alpha={0.9}
                                    showMilliseconds={false}
                                    onComplete={this.startRecording}
                                />
                            </div>
                        )}
                    </div>

                    <div className={styles.btnStack}>
                        {(this.state.devices.length > 1) && (
                            <button onClick={this.switchVideoDevices}>Switch Camera</button>
                        )}

                        {this.state.recording && (
                            <button
                                className={controls.btnRaised}
                                disabled={!this.state.recording}
                                onClick={this.stopRecording}
                            >Stop</button>
                        )}

                        {/* Todo: Re-word 'Next' to 'Save' */}
                        {this.state.lastTakeURL && [
                            <button
                                key={0}
                                className={controls.btnRaised}
                                onClick={this.showDescripton}
                            >Add Description</button>,
                            <AddControls
                                key={1}
                                onNext={this.save}
                                disableNext={!this.state.lastTakeURL && !this.state.playing}
                            />
                        ]}
                    </div>
                </Grid>
            </div>
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
VideoRecorder.mediaCheck = function () {
    return new Promise(function (resolve, reject) {
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
            reject({ name: 'getUserMediaUnsupported' });
        } else {
            getUserMedia.call(navigator, mediaConstraints, mediaOK, mediaFail); // First get a hold of getUserMedia, if present
        }
    });
};

export default VideoRecorder;
