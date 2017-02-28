import React, { Component } from 'react';

import Button from './Button';
import TouchIcon from './TouchIcon';

import styles from './css/TextForm.module.css';
import headings from '../css/Headings.module.css';
import helpers from '../css/Helpers.module.css';

class TextForm extends Component {
    constructor (props) {
        super(props);

        this.state = {
            value: props.initialValue
        };

        this.continue = this.continue.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    continue (evt) {
        evt && evt.preventDefault();

        this.props.save({
            text: this.state.value
        });
    }

    handleChange (event) {
        this.setState({
            value: event.target.value
        });
    }

    render () {
        return (
            <form className={styles.wrapper}>
                <h2 className={headings.large}>I just want to say&hellip;</h2>

                <div className={styles.content}>
                    <textarea
                        maxLength={this.props.maxLength}
                        onChange={this.handleChange}
                        className={styles.textarea}
                        value={this.state.value}
                    ></textarea>

                    <p className={styles.charCounter}>
                        {this.state.value.length} of {this.props.maxLength} letters used
                    </p>
                </div>

                <div className={(!this.state.value.length && helpers.hide) || undefined}>
                    <div className={styles.controls}>
                        <Button onClick={this.continue}><TouchIcon />Save</Button>
                    </div>
                </div>
            </form>
        );
    }
}

TextForm.propTypes = {
    initialValue: React.PropTypes.string,
    save: React.PropTypes.func
};

TextForm.defaultProps = {
    initialValue: '',
    maxLength: 1000
};

export default TextForm;
