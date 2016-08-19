import React, { Component } from 'react';
import { Grid, Row, Col, Button, Alert } from 'react-bootstrap';
import VideoRecorder from './VideoRecorder';

const errorMap = {
    PermissionDeniedError: 'You\'ve sensibly blocked access to your camera and microphone.',
    getUserMediaUnsupported: 'We\'re unable to record video on this device.'
};

class VideoForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            mode: props.mode,
            recorderError: props.recorderError
        };

        this.back = this.back.bind(this);
        this.save = this.save.bind(this);
        this.requestUploadMode = this.requestUploadMode.bind(this);
        this.onMediaFailure = this.onMediaFailure.bind(this);
        this.doS3Upload = this.doS3Upload.bind(this);
    }

    componentDidMount() {
        VideoRecorder.mediaCheck()
            .then(() => {
                this.setState({mode: 'record'});
            })
            .catch((error) => {
                this.setState({
                    recorderError: error.name,
                    mode: 'fallbackPrompt'
                });
            });
    }

    back() {
        this.props.back();
    }

    save(data) {
        this.setState({ uploading: true });
        this.doS3Upload(data).then((s3info) => {
            this.setState({ uploading: false, uploaded: true });
            this.props.save(s3info);
        });
    }

    doS3Upload(data) {
        let params = {
            type: data.blob.type,
            data: data.blob,
            id: Math.floor(Math.random()*9000) + 10000
        };

        function getSignedUrl(fileinfo) {
            let queryString = '?objectName=' + fileinfo.id + '&contentType=' + encodeURIComponent(fileinfo.type);
            return fetch('/s3/sign' + queryString)
                .then((response) => {
                    return response.json();
                })
                .catch((err) => {
                    console.log('error: ', err);
                });
        }

        function createCORSRequest(method, url) {
            var xhr = new XMLHttpRequest();

            if (xhr.withCredentials != null) {
                xhr.open(method, url, true);
            } else if (typeof XDomainRequest !== "undefined") {
                xhr = new XDomainRequest();
                xhr.open(method, url);
            } else {
                xhr = null;
            }

            return xhr;
        };

        return new Promise(function(reject, resolve){
            getSignedUrl(params)
            .then((s3Info) => {
                var xhr = createCORSRequest('PUT', s3Info.signedUrl);
                xhr.onload = function() {
                        if (xhr.status === 200) {
                            debugger;
                            resolve(xhr.body);
                        } else {
                            reject(xhr.status);
                        }
                };

                xhr.setRequestHeader('Content-Type', params.type);
                xhr.setRequestHeader('x-amz-acl', 'public-read');
                return xhr.send(params.data);
            });

        });

    }

    requestUploadMode() {
        this.setState({mode: 'upload'});
    }

    onMediaFailure(error) {
        this.setState({
            recorderError: error.name,
            mode: 'fallbackPrompt'
        });
    }

    render() {
        return (
            <Grid>
                <Row>
                    <Col xs={12}>
                        {(
                            {
                                loading: <h2>Loading</h2>,
                                record: <VideoRecorder save={this.save} onFailure={this.onMediaFailure}/>,
                                fallbackPrompt: <Alert bsStyle="danger">
                                                    <h4>Oh Snap. We can&apos;t make a video</h4>
                                                    <p>{errorMap[this.state.recorderError]}</p>
                                                    <p>
                                                        <Button onClick={this.requestUploadMode}>Try uploading</Button>
                                                        <span> or </span>
                                                        <Button onClick={this.back}>Go back</Button>
                                                    </p>
                                                </Alert>,
                                upload: <h2>Uploader</h2>
                            }
                        )[this.state.mode]}
                    </Col>
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
    save: React.PropTypes.func.isRequired,
    back: React.PropTypes.func.isRequired,
    mode: React.PropTypes.string
};

VideoForm.defaultProps = {
    mode: 'loading',
    recorderError: null
};

export default VideoForm;
