import React, { Component } from 'react';
import Relay from 'react-relay';
import { ListGroup } from 'react-bootstrap';
import { EntryContainer } from './Entry';

export class Timeline extends Component {
    render() {
        return (
            <ListGroup componentClass="div">
                {this.props.viewer.entries.edges.map((entry) => {
                    return (<EntryContainer key={entry.node.id} entry={entry.node}/>);
                })}
            </ListGroup>
        );
    }
}

export const TimelineContainer = Relay.createContainer(Timeline, {
    initialVariables: {
        first: 100,
    },
    fragments: {
        viewer: () => Relay.QL`
        fragment on Viewer {
            entries(first: $first) {
                edges {
                    node {
                        id,
                        ${EntryContainer.getFragment('entry')}
                    }
                }
            }
        }`,
    }
});
