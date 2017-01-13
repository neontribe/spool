import React, { Component } from 'react';
import styles from './css/Introduction.module.css';

export default class PrivacyForm extends Component {
    constructor (props) {
        super(props);
        this.handleSharingChange = this.handleSharingChange.bind(this);
    }

    handleSharingChange (evt) {
        const value = parseInt(evt.target.value, 10);
        this.props.onChange(!!value);
    }

    render () {
        return (
            <div>
                <div>
                    <label className={styles.option}>
                        <input
                            type='radio'
                            name='share'
                            value='1'
                            defaultChecked={this.props.sharing === true}
                            onClick={this.handleSharingChange}
                            className={styles.field}
                        />
                        <span className={styles.message}>Yes</span>
                    </label>
                    <label className={styles.option}>
                        <input
                            type='radio'
                            name='share'
                            value='0'
                            defaultChecked={this.props.sharing === false}
                            onClick={this.handleSharingChange}
                            className={styles.field}
                        />
                        <span className={styles.message}>No</span>
                    </label>
                </div>
            </div>
        );
    }
}
