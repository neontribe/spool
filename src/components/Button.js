import React, { Component } from 'react';
import _ from 'lodash';

import styles from './css/Button.module.css';

export default class Button extends Component {
    static propTypes = {
        onClick: React.PropTypes.func.isRequired,
        className: React.PropTypes.string
    }

    constructor (props) {
        super(props);

        this.onClick = _.debounce(this.props.onClick, 500, {
            leading: true,
            trailing: false
        });
    }

    render () {
        return (
            <span className={this.props.className || styles.raised}>
                <button onClick={this.onClick} className={styles.button}>{this.props.children}</button>
            </span>
        );
    }
};
