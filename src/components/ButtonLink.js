import React, { Component } from 'react';
import { Link } from 'react-router';

import styles from './css/Button.module.css';

export default class ButtonLink extends Component {
    static propTypes = {
        to: React.PropTypes.string.isRequired,
        className: React.PropTypes.string
    }

    render () {
        return (
            <Link
                to={this.props.to}
                className={this.props.className || styles.raised}
            >{this.props.children}</Link>
        );
    }
};
