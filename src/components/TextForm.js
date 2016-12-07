import React, { Component } from 'react';

import AddControls from './AddControls';

import styles from './css/TextForm.module.css';
import a11y from '../css/A11y.module.css';

class TextForm extends Component {
    constructor (props) {
        super(props);

        this.state = {
            value: props.initialValue
        };

        this.continue = this.continue.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    continue () {
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
                <h2 className={a11y.vh}>I just want to say...</h2>

                <textarea
                    maxLength={this.props.maxLength}
                    placeholder='I just want to say...'
                    onChange={this.handleChange}
                    className={styles.textarea}
                    value={this.state.value}
                ></textarea>

                {/*<HelpBlock>{this.state.value.length} of {this.props.maxLength} letters used</HelpBlock>*/}
                <p>{this.state.value.length} of {this.props.maxLength} letters used</p>

                <AddControls
                    onNext={this.continue}
                    disableNext={!this.state.value}
                />
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
    maxLength: 250
};

export default TextForm;
