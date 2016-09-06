import React, { Component } from 'react';
import { Link } from 'react-router';
import Relay from 'react-relay';
import { Grid, Row, Col } from 'react-bootstrap';

export class Home extends Component {
    render() {
        return (
            <Grid>
                <Row>
                    <Col xs={12}>
                        <Link to={'/add'}>Get Started</Link>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        {this.props.children}
                    </Col>
                </Row>
            </Grid>
        );
    }
};

export const HomeContainer = Relay.createContainer(Home, {
    fragments: {
        viewer: () => Relay.QL`
        fragment on Viewer {
            id
            happyCount
            sadCount
        }`,
    }
});
