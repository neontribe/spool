import React, { Component } from 'react';
import { default as BootstrapDatePicker } from 'react-bootstrap-date-picker';

import styles from './css/DatePicker.module.css';

export class DatePicker extends Component {
    render () {
        return (
            <div className={styles.wrapper}>
                <BootstrapDatePicker
                    dateFormat='DD/MM/YYYY'
                    showClearButton={false}
                    {...this.props}
                />
            </div>
        );
    }
}

export default DatePicker;
