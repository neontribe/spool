import React, { Component } from 'react';
import { Grid, Row, Col, Alert, ResponsiveEmbed, Button, Glyphicon } from 'react-bootstrap';
import MediaStreamRecorder from 'msr';

class VideoForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            playing: false,
            recording: false,
            mediaRecorder: null,
            streamURL: null,
            lastTakeURL: null,
            playURL: null,
            mediaConstraints: {
                audio: true,
                video: true
            }
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
    }

    componentDidMount() {
        this.startMediaStream();
    }

    startMediaStream(){
        // First get ahold of getUserMedia, if present
		const getUserMedia = (navigator.getUserMedia ||
				navigator.webkitGetUserMedia ||
				navigator.mozGetUserMedia ||
				navigator.msGetUserMedia);

        if (!getUserMedia) {
            this.setState({ mediaFailure: 'We can\'t record video on this device'});
            return;
        }

        getUserMedia.call(navigator, this.state.mediaConstraints, this.onMediaSuccess, this.onMediaFailure);
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
        this.setState({mediaFailure: error});
    }

    startRecording() {
        console.log('start recording');
        this.state.mediaRecorder.start();
        this.setState({
            recording: true,
            lastTakeURL: null
        });
    }

    stopRecording() {
        console.log('stop recording');
        this.state.mediaRecorder.stop();
        //this.state.mediaRecorder.stream.stop();
        this.setState({
            recording: false
        });
    }

    onRecordingFinished(blob) {
        this.setState({
            lastTakeURL: URL.createObjectURL(blob)
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
            lastTakeURL: null
        });
    }

    save() {
        this.props.save(this.state.lastTakeURL);
    }

    render() {
        return (
            <Grid>
                <Row>
                    <Col xs={3}/>
                    <Col xs={6}>
                        { this.state.mediaFailure && <Alert bsStyle="danger">{this.state.mediaFailure}</Alert>}
                    </Col>
                    <Col xs={3}/>
                </Row>
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
                        { this.state.playing &&
                              <Button bsStyle="primary" bsSize="large" block
                                onClick={this.discardLastTake}>
                                <Glyphicon glyph="trash"/> Delete
                              </Button>
                        }
                    </Col>
                    <Col xs={3}/>
                </Row>
                <Row>
                    <Col>&nbsp;</Col>
                </Row>
                <Row>
                    <Col xs={3}></Col>
                    <Col xs={6}>
                        <Button bsStyle="primary" bsSize="large" block
                            disabled={!this.state.lastTakeURL}
                            onClick={this.save}>Next</Button>
                    </Col>
                    <Col xs={3}></Col>
                </Row>
            </Grid>
        );
    }
}

VideoForm.propTypes = {
    save: React.PropTypes.func.isRequired
};

VideoForm.defaultProps = {};

export default VideoForm;
