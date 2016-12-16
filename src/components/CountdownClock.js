import React, { Component } from 'react';

import styles from './css/CountdownClock.module.css';

export default class CountdownClock extends Component {
    static propTypes = {
        seconds: React.PropTypes.number,
        onComplete: React.PropTypes.func
    }

    static defaultProps = {
        seconds: 3,
        onComplete: Function.prototype
    }

    constructor (props) {
        super(props);

        this.state = {
            remaining: this.props.seconds
        };
    }

    componentDidMount () {
        var countdown = setInterval(() => {
            this.setState({
                remaining: this.state.remaining - 1
            });

            if (!this.state.remaining) {
                clearInterval(countdown);
                this.props.onComplete();
            }
        }, 1000);
    }

    render () {
        return (
            <div className={styles.wrapper}>
                <div className={styles.counter}>
                    {this.state.remaining}
                </div>
            </div>
        );
    }
};
