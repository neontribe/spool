import React, { Component } from 'react';
import captureVideoFrame from 'capture-video-frame';
import ReactCountdownClock from 'react-countdown-clock';
import _ from 'lodash';

import AddControls from './AddControls';

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
            devices: [],
            activeDevice: null
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
        this.getCountdownSize = this.getCountdownSize.bind(this);
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

        this.setState({activeDevice: newDevice}, () => {
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
            image: this.state.image.blob,
            imageThumbnail: this.state.thumbnail.blob
        });
    }

    getCountdownSize () {
        var video = this._viewfinder;
        var dimensions = video.getBoundingClientRect();

        return _.min([dimensions.height, dimensions.width]) * 0.9;
    }

    render () {
        return (
            <div>
                <div>
                    {this.state.connecting && (
                        {/*<ResponsiveEmbed a4by3>
                            <div className='connecting' />
                        </ResponsiveEmbed>*/}
                    )}

                    {/*<ResponsiveEmbed a4by3>*/}
                    {this.state.streaming && (
                        <video
                            ref={(ref) => { this._viewfinder = ref; }}
                            src={this.state.streamURL}
                            muted={true}
                            autoPlay={true}
                        />
                    )}

                    {this.state.thumbnail && (
                        <div>
                            {/*<ResponsiveEmbed a4by3>*/}
                            <Image
                                src={this.state.thumbnail.dataUri}
                                alt="The photo you just took"
                            />
                        </div>
                    )}

                    {this.state.countdown && (
                        <div>
                            <ReactCountdownClock
                                seconds={this.props.countdownSeconds}
                                size={this.getCountdownSize()}
                                color='#a3dfef'
                                alpha={0.9}
                                showMilliseconds={false}
                                onComplete={this.shutter}
                            />
                        </div>
                    )}
                </div>
                <div>
                    <div>
                        <button
                            disabled={!this.state.streaming}
                            onClick={this.startCountdown}
                        >Take Picture</button>
                    </div>
                    {(this.state.devices.length > 1) && (
                        <div>
                            <button
                                onClick={this.switchVideoDevices}
                            >Switch Cameras</button>
                        </div>
                    )}
                </div>
                <div>
                    <AddControls
                        onNext={this.save}
                        disableNext={!this.state.image}
                    />
                </div>
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
    countdownSeconds: 5
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
