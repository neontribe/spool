import React, { Component } from 'react';

import styles from './css/PageOverlay.module.css';

export default class PageOverlay extends Component {
    static propTypes = {
        title: React.PropTypes.string
    }

    render () {
        return (
            <div className={styles.wrapper}>
                <div className={styles.inner}>
                    <h2 className={styles.title}>{this.props.title}</h2>
                    <p>Please wait&hellip;</p>
                </div>
            </div>
        );
    }
};
