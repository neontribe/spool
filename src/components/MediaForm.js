import React, { Component } from 'react';
import { withRouter } from 'react-router';
import _ from 'lodash';

import IconChooserGrid from './IconChooserGrid';
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

    static propTypes = {
        onUpdateStart: React.PropTypes.func,
        onUpdateEnd: React.PropTypes.func,
        onSaveEnd: React.PropTypes.func,
        onSaveStart: React.PropTypes.func,
        saveKey: React.PropTypes.string
    }

    static defaultProps = {
        saveKey: 'media'
    }

    constructor (props) {
        super(props);

        this.onSaveEnd = _.partial(props.onSaveEnd, props.saveKey);

        const { SELECT, VIDEO, PHOTO, TEXT } = MediaForm;
        const choiceMap = {
            video: VIDEO,
            photo: PHOTO,
            typing: TEXT
        };

        this.state = {
            form: SELECT
        };

        this.chooserTransition = (values) => {
            this.props.onMediaTypeChange(values[0]);

            return this.setState({
                form: choiceMap[values[0]]
            });
        };
    }

    renderChooser () {
        return (
            <IconChooserGrid
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
                    return <VideoForm onSaveStart={this.props.onSaveStart} onSaveEnd={this.onSaveEnd} />;

                case PHOTO:
                    return (
                        <ImageForm
                            onUpdateStart={this.props.onUpdateStart}
                            onUpdateEnd={this.props.onUpdateEnd}
                            onSaveStart={this.props.onSaveStart}
                            onSaveEnd={this.onSaveEnd}
                        />
                    );

                case TEXT:
                default:
                    return <TextForm save={this.onSaveEnd} />;
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

export default withRouter(MediaForm);
