import React, { Component } from 'react';
import captureVideoFrame from 'capture-video-frame';
import _ from 'lodash';

import Grid from './Grid';
import Button from './Button';
import CountdownClock from './CountdownClock';

import styles from './css/Camera.module.css';
import headings from '../css/Headings.module.css';

const mediaConstraints = {
    audio: false,
    video: true
};

class Camera extends Component {
    constructor (props) {
        super(props);

        this.state = {
            connecting: true,
            streaming: false,
            stream: null,
            streamURL: null,
            image: null,
            thumbnail: null,
            text: '',
            devices: [],
            activeDevice: null,
            showDescriptionField: false
        }

        this.startMediaStream = this.startMediaStream.bind(this);
        this.stopMediaStream = this.stopMediaStream.bind(this);
        this.onMediaSuccess = this.onMediaSuccess.bind(this);
        this.onMediaFailure = this.onMediaFailure.bind(this);
        this.startCountdown = _.debounce(this.startCountdown.bind(this), 500, { leading: true, trailing: false });
        this.shutter = this.shutter.bind(this);
        this.save = this.save.bind(this);
        this.onMediaFailure = this.onMediaFailure.bind(this);
        this.getVideoDevices = this.getVideoDevices.bind(this);
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
            this.setState({ mediaFailure: { name: 'getUserMediaUnsupported' }});
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

    switchVideoDevices () {
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
        this.setState({
            connecting: false,
            streaming: true,
            streamURL: URL.createObjectURL(stream),
            stream: stream
        });
    }

    onMediaFailure (error) {
        this.props.onFailure(error);
    }

    stopMediaStream () {
        this.state.stream.getTracks().map((track) => track.stop());
    }

    startCountdown () {
        this.setState({
            image: null,
            thumbnail: null,
            countdown: true
        });
    }

    shutter () {
        const image = captureVideoFrame(this._viewfinder, 'png');

        this.setState({
            countdown: false,
            image: image,
            thumbnail: image
        });
    }

    save () {
        // Pass the blobs up
        this.props.save({
            text: this.state.text,
            image: this.state.image.blob,
            imageThumbnail: this.state.thumbnail.blob
        });
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
                        <Button
                            onClick={this.hideDescripton}
                        >Close</Button>
                    </div>
                )}

                <Grid enforceConsistentSize={true}>
                    <div className={styles.outputWrapper}>
                        {/*this.state.connecting && (
                            {<ResponsiveEmbed a4by3>
                                <div className='connecting' />
                            </ResponsiveEmbed>}
                        )*/}

                        {this.state.streaming && (
                            <video
                                className={styles.video}
                                ref={(ref) => { this._viewfinder = ref; }}
                                src={this.state.streamURL}
                                muted={true}
                                autoPlay={true}
                            />
                        )}

                        {this.state.thumbnail && (
                            <img
                                className={styles.thumbnail}
                                src={this.state.thumbnail.dataUri}
                                alt='The photo you just took'
                            />
                        )}

                        {this.state.countdown && (
                            <CountdownClock
                                seconds={this.props.countdownSeconds}
                                onComplete={this.shutter}
                            />
                        )}
                    </div>

                    <div className={styles.btnStack}>
                        {(this.state.devices.length > 1) && (
                            <Button
                                onClick={this.switchVideoDevices}
                            >Switch Cameras</Button>
                        )}

                        {(!this.state.countdown && !this.state.image) && (
                            <Button
                                onClick={this.startCountdown}
                            >Take Picture</Button>
                        )}

                        {/* Todo: Re-word 'Next' to 'Save' */}
                        {this.state.image && [
                            <Button
                                key={0}
                                onClick={this.startCountdown}
                            >Try Again</Button>,
                            <Button
                                key={1}
                                onClick={this.showDescripton}
                            >Add Description</Button>,
                            <Button
                                key={2}
                                onClick={this.save}
                            >Next</Button>
                        ]}
                    </div>
                </Grid>
            </div>
        );
    }
}

Camera.propTypes = {
    save: React.PropTypes.func.isRequired,
    onFailure: React.PropTypes.func.isRequired,
    countdownSeconds: React.PropTypes.number
};

Camera.defaultProps = {
    countdownSeconds: 3
};
/**
 * Expose a test for media capabilities for use by other components
 */
Camera.mediaCheck = function () {
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
            getUserMedia.call(navigator, mediaConstraints, mediaOK, mediaFail);// First get a hold of getUserMedia, if present
        }
    });
};

export default Camera;
