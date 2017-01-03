import React, { Component } from 'react';

import Button from './Button';
import IconChooserGrid from './IconChooserGrid';
import TouchIcon from './TouchIcon';

import styles from './css/TopicForm.module.css';
import helpers from '../css/Helpers.module.css';

class TopicForm extends Component {
    constructor (props) {
        super(props);

        this.state = {
            value: props.initialValue
        };

        this.continue = this.continue.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    continue () {
        this.props.save(this.props.saveKey, this.state.value);
    }

    handleChange (value) {
        this.setState({
            value
        });
    }

    render () {
        return (
            <div className={styles.wrapper}>
                <IconChooserGrid
                    label='What do you want to talk about?'
                    choices={this.props.topics}
                    onChange={this.handleChange}
                    initialValue={this.props.initialValue}
                />

                <div className={(!this.state.value.length && helpers.hide) || undefined}>
                    <div className={styles.controls}>
                        <Button onClick={this.continue}>
                            <TouchIcon />Continue
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

TopicForm.propTypes = {
    initialValue: React.PropTypes.array,
    save: React.PropTypes.func,
    topics: React.PropTypes.array,
    saveKey: React.PropTypes.string
};

TopicForm.defaultProps = {
    initialValue: [],
    saveKey: 'topics'
};

export default TopicForm;
