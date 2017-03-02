import React, { Component } from 'react';
import _ from 'lodash';

import styles from './css/Button.module.css';

export default class Button extends Component {
    static propTypes = {
        onClick: React.PropTypes.func.isRequired,
        disabled: React.PropTypes.bool
    }

    constructor (props) {
        super(props);

        this.onClick = (e) => {
            e.preventDefault();
            e.stopPropagation();

            _.debounce(this.props.onClick, 500, {
                leading: true,
                trailing: false
            })();
        };

        this.state = {
            active: false
        };
    }

    render () {
        return (
            <button
                onClick={this.onClick}
                onTouchEnd={(e) => {
                    this.onClick(e);
                    this.setState({
                        active: true
                    });
                }}
                className={styles.wrapper}
                disabled={this.props.disabled}
            >
                <span className={(this.state.active) ? styles.raisedActive : styles.raised}>
                    <span className={styles.button}>{this.props.children}</span>
                </span>
            </button>
        );
    }
};
