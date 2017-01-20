import React, { Component } from 'react';

import Icon from './Icon';

import styles from './css/IconCard.module.css';

export class IconCard extends Component {
    static propTypes = {
        /* If no `onChange` is provided the IconCard is rendered as a static UI component */
        onChange: React.PropTypes.func,
        value: React.PropTypes.string,
        icon: React.PropTypes.string.isRequired,
        message: React.PropTypes.string.isRequired,
        classNames: React.PropTypes.object
    }

    static defaultProps = {
        classNames: {}
    }

    renderStatic () {
        return (
            <p>{this.props.message}</p>
        );
    }

    renderCheckbox () {
        return (
            <label className={this.props.classNames.wrapper || styles.wrapper}>
                <input
                    type='checkbox'
                    className={this.props.classNames.field || styles.field}
                    checked={this.props.checked}
                    value={this.props.value}
                    onChange={this.props.onChange}
                />

                <div className={this.props.classNames.option || styles.option}>
                    <Icon
                        className={this.props.classNames.icon || styles.icon}
                        icon={this.props.icon}
                    />
                    <div className={this.props.classNames.message || styles.message}>{this.props.message}</div>
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
