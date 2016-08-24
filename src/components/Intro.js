import React, { Component } from 'react';
import { Jumbotron } from 'react-bootstrap';

class Intro extends Component {

    render() {
        return (
            <Jumbotron>
                <h1>Welcome!</h1>
                <p>We would really like to know about the things you do.</p>
                <p>What you like.  What you don't like.</p>
                <p>Use this app to tell us about what you do.</p>
            </Jumbotron>
        );
    }
}

export default Intro;
