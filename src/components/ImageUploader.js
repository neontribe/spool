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
            capturing: true,
            lastTakeURL: null,
            lastTakeBlob: null,
            thumbnailBlob: null,
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
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            const data = reader.result;
            this.setState({
                image: data,
                capturing: false,
                imageFile: file
            });
        }, false);
        reader.readAsDataURL(file);
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
            image: null,
            capturing: true
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

                        {this.state.capturing && (
                            <input type="file" accept="image/*" capture="camera" onChange={this.handleFile} />
                        )}

                        {(this.state.image) && (
                            <div>
                                <img alt="Your last take" src={this.state.image} />

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
