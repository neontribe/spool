import React, { Component } from 'react';

import styles from './css/IconCard.module.css';

export class IconCard extends Component {
    static propTypes = {
        /* If no `onChange` is provided the IconCard is rendered as a static UI component */
        onChange: React.PropTypes.func,
        value: React.PropTypes.string,
        icon: React.PropTypes.string.isRequired,
        message: React.PropTypes.string.isRequired,
    }

    renderStatic () {
        return (
            <p>{this.props.message}</p>
        );
    }

    renderCheckbox () {
        return (
            <label className={styles.wrapper}>
                <input
                    type='checkbox'
                    className={styles.field}
                    checked={this.props.checked}
                    value={this.props.value}
                    onChange={this.props.onChange}
                />

                <div className={styles.option}>
                    <span>{this.props.message}</span>
                </div>
            </label>
        );
    }

    render () {
        if (this.props.onChange) {
            return this.renderCheckbox();
        }

        return this.renderStatic();
    }
};

export default IconCard;
