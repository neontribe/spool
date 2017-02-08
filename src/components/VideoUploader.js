import React, { Component } from 'react';
import captureVideoFrame from 'capture-video-frame';
import _ from 'lodash';

import Grid from './Grid';
import Button from './Button';
import TouchIcon from './TouchIcon';

import styles from './css/VideoRecorder.module.css';
import headings from '../css/Headings.module.css';

class VideoUploader extends Component {
    constructor (props) {
        super(props);

        this.state = {
            playing: false,
            lastTakeURL: null,
            lastTakeBlob: null,
            thumbnailBlob: null,
            text: '',
            type: 'video/mp4'
        };

        this.save = this.save.bind(this);
        this.reset = this.reset.bind(this);
        this.showDescripton = this.showDescripton.bind(this);
        this.hideDescripton = this.hideDescripton.bind(this);
        this.playRecording = this.playRecording.bind(this);
        this.pausePlayback = this.pausePlayback.bind(this);
        this.onTextChange = this.onTextChange.bind(this);
        this.handleFile = this.handleFile.bind(this);
    }

    handleFile (event) {
        if (!event.target.files.length) {
            return;
        }
        const URL = window.URL || window.webkitURL;
        const file = event.target.files[0];
        this.setState({
            lastTakeURL: URL.createObjectURL(file),
            lastTakeBlob: file
        });
    }

    save () {
        // Take a thumb from the replay
        const thumb =
            captureVideoFrame(this._player, 'png');

        this.props.save({
            text: this.state.text,
            video: this.state.lastTakeBlob,
            videoThumbnail: thumb.blob
        });
    }

    reset () {
        this.refs.input.value = '';

        this.setState({
            playing: false,
            lastTakeBlob: null,
            lastTakeURL: null
        });
    }

    pausePlayback () {
        this._player.pause();

        this.setState({
            playing: false
        });
    }

    playRecording () {
        this._player.play();

        this.setState({
            playing: true
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
                        <h2 className={headings.large}>Add a description</h2>
                        <div className={styles.content}>
                            <textarea
                                maxLength={this.props.maxTextLength}
                                className={styles.textarea}
                                value={this.state.text}
                                onChange={this.onTextChange}
                            ></textarea>
                            <p className={styles.charCounter}>
                                {this.state.text.length} of {this.props.maxTextLength} letters used
                            </p>
                        </div>
                        <div className={styles.descriptionControls}>
                            <Button onClick={this.hideDescripton}><TouchIcon />Save</Button>
                        </div>
                    </div>
                )}

                <Grid enforceConsistentSize={true}>
                    <div className={styles.outputWrapper}>
                        {(!this.state.lastTakeURL) && (
                            <label className={styles.uploadWrapper}>
                                <input className={styles.fileUpload} ref='input' type="file" accept="video/*" capture="camcorder" onChange={this.handleFile} />
                                <Button onClick={Function.prototype}><TouchIcon />Add video</Button>
                            </label>
                        )}

                        {(this.state.lastTakeURL) && (
                            <div className={styles.videoContainer}>
                                <video
                                    autoPlay={true}
                                    className={styles.video}
                                    ref={(ref) => { this._player = ref; }}
                                    controls={true}
                                    src={this.state.lastTakeURL}
                                    onPlay={() => { this.setState({ playing: true }); }}
                                    onPause={() => { this.setState({ playing: false }); }}
                                    onEnded={() => { this.setState({ playing: false }); }}
                                />

                                {this.state.text && (
                                    <div className={styles.text}>{this.state.text}</div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className={styles.btnStack}>
                        {(this.state.playing) && (
                            <Button
                                key={0}
                                onClick={this.pausePlayback}
                            >Pause</Button>
                        )}

                        {(this.state.lastTakeURL && !this.state.playing) && (
                            <Button onClick={this.playRecording}>Play</Button>
                        )}

                        {(this.state.lastTakeURL) && [
                            <Button key={0} onClick={this.reset}>Try Again</Button>,
                            <Button key={1} onClick={this.showDescripton}>Add Description</Button>,
                            <Button key={2} onClick={this.save}><TouchIcon />Save</Button>
                        ]}
                    </div>
                </Grid>
            </div>
        );
    }
}

VideoUploader.propTypes = {
    save: React.PropTypes.func.isRequired
};

VideoUploader.defaultProps = {
    maxTextLength: 1000
};

export default VideoUploader;
