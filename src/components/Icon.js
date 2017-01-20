import React, { Component } from 'react';

import styles from './css/Icon.module.css';

const ICONS = [
    'happy',
    'sad',
    'work',
    'learning',
    'home',
    'food',
    'relationships',
    'activities',
    'travel',
    'health',
    'video',
    'photo',
    'typing'
];

export class Icon extends Component {
    static propTypes = {
        className: React.PropTypes.string,
        icon: React.PropTypes.oneOf(ICONS).isRequired,
        small: React.PropTypes.bool,
        size: React.PropTypes.number
    }

    static defaultProps = {
        small: false,

        /* Icon size multiplier */
        size: 2
    }

    render () {
        var className = this.props.icon;

        if (this.props.small) {
            className += 'Small';
        }

        return (
            <div className={this.props.className}>
                <div
                    className={styles[className]}
                    style={{
                        height: `${this.props.size}rem`,
                        width: `${this.props.size}rem`
                    }}
                ></div>
            </div>
        );
    }
}

export default Icon;
