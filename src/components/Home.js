import React, { Component } from 'react';
import Relay from 'react-relay';
import { Grid, Row, Col } from 'react-bootstrap';
import AddEntryForm from './AddEntryForm';
import Timeline from './Timeline';

export class Home extends Component {
    render() {
        return (
            <Grid>
                <Row>
                    <Col>
                        <AddEntryForm />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Timeline entries={[]} />
                    </Col>
                </Row>
            </Grid>
        );
    }
};

export const HomeContainer = Relay.createContainer(Home, {
    fragments: {
        viewer: () => Relay.QL`
        fragment on viewer {
           id
        }`,
    }
});
