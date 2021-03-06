import React, { Component } from 'react';

import headings from '../css/Headings.module.css';

class Intro extends Component {
    render () {
        return (
            <div>
                <h2 className={headings.large}>Welcome!</h2>
                <p>We would really like to know about the things you do.</p>
                <p>What you like.  What you don't like.</p>
                <p>Use this app to tell us about what you do.</p>
            </div>
        );
    }
}

export default Intro;
