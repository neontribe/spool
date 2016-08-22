import React, { Component } from 'react';
import { Grid, Row, Col, ResponsiveEmbed, Button, Glyphicon } from 'react-bootstrap';
import MediaStreamRecorder from 'msr';
import captureVideoFrame from 'capture-video-frame';

const mediaConstraints = {
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
            thumbnailBlob: null
        }

        this.startMediaStream = this.startMediaStream.bind(this);
        this.startRecording = this.startRecording.bind(this);
        this.stopRecording = this.stopRecording.bind(this);
        this.onMediaSuccess = this.onMediaSuccess.bind(this);
        this.onMediaFailure = this.onMediaFailure.bind(this);
        this.onRecordingFinished = this.onRecordingFinished.bind(this);
        this.replayLastTake = this.replayLastTake.bind(this);
        this.discardLastTake = this.discardLastTake.bind(this);
        this.save = this.save.bind(this);
        this.onMediaFailure = this.onMediaFailure.bind(this);

    }

    componentWillMount() {
        this.startMediaStream();
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

        getUserMedia.call(navigator, mediaConstraints, this.onMediaSuccess, this.onMediaFailure);
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

    save() {
        const thumb = captureVideoFrame(this._player, 'png');
        this.state.mediaRecorder.stream.getTracks().map((track) => track.stop());
        this.props.save({
            video: this.state.lastTakeBlob,
            thumbnail: thumb.blob
        });
    }

    render() {
        return (
            <Grid>
                <Row>
                    <Col xs={3}/>
                    <Col xs={6}>
                        { this.state.streaming &&
                            <ResponsiveEmbed a4by3>
                                <video
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
                    <Col xs={3}/>
                </Row>
                <Row>
                    <Col xs={3}/>
                    <Col xs={6}>
                        { (!this.state.recording && !this.state.playing) &&
                            <Button bsStyle="primary" bsSize="large" block
                              onClick={this.startRecording}>
                              <Glyphicon glyph="record" /> Record
                            </Button>
                        }
                        { this.state.recording &&
                            <Button bsStyle="primary" bsSize="large" block
                              onClick={this.stopRecording}>
                              <Glyphicon glyph="stop" /> Stop Recording
                            </Button>
                        }
                        { (this.state.lastTakeURL && !this.state.playing) &&
                              <Button bsStyle="primary" bsSize="large" block
                                onClick={this.replayLastTake}>
                                <Glyphicon glyph="play"/> Replay
                              </Button>
                        }
                        { (this.state.lastTakeURL && this.state.playing) &&
                              <Button bsStyle="primary" bsSize="large" block
                                onClick={this.save}>
                                <Glyphicon glyph="save"/> Save
                              </Button>
                        }
                        { this.state.playing &&
                              <Button bsStyle="primary" bsSize="large" block
                                onClick={this.discardLastTake}>
                                <Glyphicon glyph="trash"/> Delete
                              </Button>
                        }
                    </Col>
                    <Col xs={3}/>
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
