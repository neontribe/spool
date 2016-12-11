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
    render () {
        var className = this.props.icon;

        if (this.props.light) {
            className += 'Light';
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

Icon.propTypes = {
    className: React.PropTypes.string,
    icon: React.PropTypes.oneOf(ICONS).isRequired,
    light: React.PropTypes.bool,
    size: React.PropTypes.number
}

Icon.defaultProps = {
    /* Show a lighter version of the icon */
    light: false,

    /* Icon size multiplier */
    size: 2
}

export default Icon;
