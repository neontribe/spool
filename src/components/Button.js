import React, { Component } from 'react';

import styles from './css/Button.module.css';

export default class Button extends Component {
    static propTypes = {
        onClick: React.PropTypes.func.isRequired,
        style: React.PropTypes.oneOf(['raised']) // Maps to class name
    }

    static defaultProps = {
        style: 'raised'
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
            >{this.props.children}</button>
        );
    }
};
