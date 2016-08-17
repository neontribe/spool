import React, { Component } from 'react';
import Relay from 'react-relay';
import { Grid, Row, Col } from 'react-bootstrap';
import { AddEntryFormContainer } from './AddEntryForm';

export class Home extends Component {
    render() {
        return (
            <Grid>
                <Row>
                    <Col>
                        <AddEntryFormContainer viewer={this.props.viewer}/>
                    </Col>
                </Row>
                <Row>
                    <Col>
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
            id,
            ${AddEntryFormContainer.getFragment('viewer')}
        }`,
    }
});
