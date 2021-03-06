import React, { Component } from 'react';
import _ from 'lodash';

import Grid from './Grid';
import Button from './Button';
import TouchIcon from './TouchIcon';

import styles from './css/Camera.module.css';
import headings from '../css/Headings.module.css';

class ImageUploader extends Component {
    constructor (props) {
        super(props);

        this.state = {
            playing: false,
            image: null,
            imageFile: null,
            thumbnailFile: null,
            text: ''
        };

        this.save = this.save.bind(this);
        this.reset = this.reset.bind(this);
        this.showDescripton = this.showDescripton.bind(this);
        this.hideDescripton = this.hideDescripton.bind(this);
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
            image: URL.createObjectURL(file),
            imageFile: file
        });
    }

    save () {
        this.props.save({
            text: this.state.text,
            image: this.state.imageFile,
            imageThumbnail: this.state.imageFile
        });
    }

    reset () {
        this.setState({
            image: null
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
                        <label className={(!this.state.image) ? styles.uploadWrapper : styles.uploadWrapperHidden}>
                            <input className={styles.fileUpload} ref='input' type='file' accept='image/*' capture='camera' onChange={this.handleFile} />
                            <Button onClick={Function.prototype}><TouchIcon />Add picture</Button>
                        </label>

                        {(this.state.image) && (
                            <div className={styles.uploadedImageWrapper}>
                                <img className={styles.uploadedImage} src={this.state.image} alt="Last take"/>

                                {this.state.text && (
                                    <div className={styles.text}>{this.state.text}</div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className={styles.btnStack}>
                        {(this.state.image) && [
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

ImageUploader.propTypes = {
    save: React.PropTypes.func.isRequired
};

ImageUploader.defaultProps = {
    maxTextLength: 1000
};

export default ImageUploader;
