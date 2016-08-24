import React, { Component } from 'react';
import { Grid, Row, Col, ResponsiveEmbed, Button, ButtonToolbar, Glyphicon, Image } from 'react-bootstrap';
import captureVideoFrame from 'capture-video-frame';

const mediaConstraints = {
    audio: false,
    video: true
};

class Camera extends Component {

    constructor(props) {
        super(props);

        this.state = {
            streaming: false,
            stream: null,
            streamURL: null,
            image: null,
            thumbnail: null
        }

        this.startMediaStream = this.startMediaStream.bind(this);
        this.stopMediaStream = this.stopMediaStream.bind(this);
        this.onMediaSuccess = this.onMediaSuccess.bind(this);
        this.onMediaFailure = this.onMediaFailure.bind(this);
        this.shutter = this.shutter.bind(this);
        this.save = this.save.bind(this);
        this.discard = this.discard.bind(this);
        this.onMediaFailure = this.onMediaFailure.bind(this);

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

        getUserMedia.call(navigator, mediaConstraints, this.onMediaSuccess, this.onMediaFailure);
    }

    onMediaSuccess(stream) {

        this.setState({
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

    shutter() {
        const image = captureVideoFrame(this._viewfinder, 'png');
        this.setState({
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

    discard() {
        this.setState({
            image: null,
            thumbnail: null
        })
    }

    render() {
        return (
            <Grid>
                <Row>
                    <Col xsOffset={3} xs={6}>
                        <div style={{ position: 'relative' }}>
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
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <ButtonToolbar className='toolbar-center'>
                            { (this.state.streaming) &&
                                <Button bsStyle="primary" bsSize="large" block
                                  onClick={this.shutter}>
                                  <Glyphicon glyph="camera" /> Take Picture
                                </Button>
                            }
                            { (this.state.image) &&
                                  <Button bsStyle="primary" bsSize="large" block
                                    onClick={this.save}>
                                    <Glyphicon glyph="save"/> Save
                                  </Button>
                            }
                            { this.state.image &&
                                  <Button bsStyle="primary" bsSize="large" block
                                    onClick={this.discard}>
                                    <Glyphicon glyph="trash"/> Delete
                                  </Button>
                            }
                        </ButtonToolbar>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

Camera.propTypes = {
    save: React.PropTypes.func.isRequired,
    onFailure: React.PropTypes.func.isRequired
};
Camera.defaultProps = {};
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
