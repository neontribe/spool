import React, { Component } from 'react';
import _ from 'lodash';

import uploadToS3 from '../s3';
import VideoRecorder from './VideoRecorder';
import VideoUploader from './VideoUploader';
import PageOverlay from './PageOverlay';

import styles from './css/VideoForm.module.css';

class VideoForm extends Component {
    constructor (props) {
        super(props);

        this.state = {
            mode: props.mode,
            recorderError: props.recorderError
        };

        this.save = this.save.bind(this);
        this.requestUploadMode = this.requestUploadMode.bind(this);
        this.onMediaFailure = this.onMediaFailure.bind(this);
    }

    componentDidMount () {
        VideoRecorder.mediaCheck()
            .then(() => {
                this.setState({
                    mode: 'record'
                });
            })
            .catch((error) => {
                this.setState({
                    recorderError: error.name,
                    mode: 'fallbackPrompt'
                });
            });
    }

    /**
     * Get two blobs, 'thumbnail' and 'video' from the recorder and save them
     */
    save (data) {
        this.setState({
            uploading: true
        });

        this.props.onSaveStart();

        var savers = _.toPairs(_.pick(data, 'image', 'imageThumbnail', 'video', 'videoThumbnail')).map((item) => {
            return uploadToS3(item[1])
                .then((s3Info) => {
                    return {
                        [item[0]]: s3Info
                    };
                });
        });

        if (data.text) {
            savers.push({
                text: data.text
            });
        }

        Promise.all(savers)
            .then((results) => {
                var info = Object.assign.apply(Object, [{}].concat(results));

                this.setState({
                    uploading: false,
                    uploaded: true
                });

                this.props.onSaveEnd(info);
            })
            .catch((e) => console.log('Error during file save: ', e));
    }

    requestUploadMode () {
        this.setState({
            mode: 'upload'
        });
    }

    onMediaFailure (error) {
        this.setState({
            recorderError: error.name,
            mode: 'fallbackPrompt'
        });
    }

    render () {
        return (
            <div className={styles.wrapper}>
                {({
                    loading: <PageOverlay title='Loading' />,
                    record: <VideoRecorder save={this.save} onFailure={this.onMediaFailure} />,
                    fallbackPrompt: <VideoUploader save={this.save} />
                })[this.state.mode]}
            </div>
        );
    }
}

VideoForm.propTypes = {
    onSaveStart: React.PropTypes.func,
    onSaveEnd: React.PropTypes.func,
    back: React.PropTypes.func,
    mode: React.PropTypes.string
};

VideoForm.defaultProps = {
    mode: 'loading',
    recorderError: null
};

export default VideoForm;
