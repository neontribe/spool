import React, { Component } from 'react';
import _ from 'lodash';

import styles from './css/Button.module.css';

export default class Button extends Component {
    static propTypes = {
        onClick: React.PropTypes.func.isRequired,
        style: React.PropTypes.oneOf(['raised', 'round']), // Maps to class name
        showPressIcon: React.PropTypes.bool
    }

    static defaultProps = {
        style: 'raised',
        showPressIcon: false
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
            <button
                className={styles[this.props.style]}
                onClick={this.onClick}
            >{this.props.showPressIcon && (
                <span className={styles.handIcon}></span>
            )}{this.props.children}</button>
        );
    }
};
