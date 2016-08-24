import React, { Component } from 'react';
import Relay from 'react-relay';
import { Grid, Row, Col } from 'react-bootstrap';
import { AddEntryFormContainer, AddEntryForm } from './AddEntryForm';

export class Home extends Component {
    renderAddEntryForm() {
        if(this.props.relay) {
            return ( <AddEntryFormContainer viewer={this.props.viewer}/> );
        } else {
            return ( <AddEntryForm viewer={this.props.viewer}/> );
        }
    }
    render() {
        console.log(this.props.viewer);
        return (
            <Grid>
                <Row>
                    <Col>
                        { this.renderAddEntryForm() }
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
            id
            ${AddEntryFormContainer.getFragment('viewer')}
            happyCount
            sadCount
        }`,
    }
});
