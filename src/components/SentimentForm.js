import React, { Component } from 'react';
import _ from 'lodash';

import Grid from './Grid';

import styles from './css/SentimentForm.module.css';
import headings from '../css/Headings.module.css';

class SentimentForm extends Component {
    constructor (props) {
        super(props);

        this.state = {
            value: props.initialValue
        };

        this.continue = this.continue.bind(this);
    }

    continue (value) {
        this.props.save(this.props.saveKey, value);
    }

    render () {
        return (
            <div className={styles.wrapper}>
                <h2 className={headings.large}>How does it make you feel?</h2>

                <Grid enforceConsistentSize={true}>
                    <a role='button' className={styles.option} onClick={_.partial(this.continue, 'happy')}>😄</a>
                    <a role='button' className={styles.option} onClick={_.partial(this.continue, 'sad')}>😡</a>
                </Grid>
            </div>
        );
    }
}

SentimentForm.propTypes = {
    initialValue: React.PropTypes.string,
    save: React.PropTypes.func,
    saveKey: React.PropTypes.string
};

SentimentForm.defaultProps = {
    initialValue: '',
    saveKey: 'sentiment'
};

export default SentimentForm;
