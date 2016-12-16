import React, { Component } from 'react';
import { withRouter } from 'react-router';
import _ from 'lodash';

import IconChooser from './IconChooser';
import TextForm from './TextForm';
import VideoForm from './VideoForm';
import ImageForm from './ImageForm';

import styles from './css/MediaForm.module.css';

const choices = [
    {
        type: 'video',
        name: 'Video'
    },
    {
        type: 'photo',
        name: 'Picture'
    },
    {
        type: 'typing',
        name: 'Write'
    }
];

class MediaForm extends Component {
    static SELECT = 'MEDIAFORM/SELECT';
    static VIDEO = 'MEDIAFORM/VIDEO';
    static PHOTO = 'MEDIAFORM/PHOTO';
    static TEXT = 'MEDIAFORM/TEXT';

    constructor (props) {
        super(props);

        this.handleSave = _.partial(props.save, props.saveKey);

        const { SELECT, VIDEO, PHOTO, TEXT } = MediaForm;
        const choiceMap = {
            video: VIDEO,
            photo: PHOTO,
            typing: TEXT,
        };

        this.state = {
            form: SELECT
        };

        this.chooserTransition = (values) => {
            this.props.onMediaTypeChange(values[0]);
            return this.setState({
                form: choiceMap[values[0]]
            });
        }
    }

    renderChooser () {
        return (
            <IconChooser
                label='How would you like to create the entry?'
                choices={choices}
                maxSelections={1}
                onChange={this.chooserTransition}
            />
        );
    }

    renderForm () {
        const { SELECT, VIDEO, PHOTO, TEXT } = MediaForm;

        switch (this.state.form) {
            case SELECT:
                return this.renderChooser();
            case VIDEO:
                return <VideoForm save={this.handleSave} />;
            case PHOTO:
                return <ImageForm save={this.handleSave} />;
            case TEXT:
                return <TextForm save={this.handleSave} />;
        }
    }

    render () {
        return (
            <div className={styles.wrapper}>
                {this.renderForm()}
            </div>
        );
    }
}

MediaForm.propTypes = {
    save: React.PropTypes.func,
    saveKey: React.PropTypes.string
}

MediaForm.defaultProps = {
    saveKey: 'media'
}

export default withRouter(MediaForm);
