import React, { Component } from 'react';
import Relay from 'react-relay';
import { ListGroup } from 'react-bootstrap';
import { EntryContainer, Entry } from './Entry';

export class Timeline extends Component {
    static propTypes = {
        viewer: React.PropTypes.object.isRequired,
    }
    renderEntries() {
        if (this.props.relay) {
            return this.props.viewer.entries.edges.map((entry) => {
                return (<EntryContainer key={entry.node.id} entry={entry.node}/>);
            })
        } else {
            return this.props.viewer.entries.edges.map((entry) => {
                return (<Entry key={entry.node.id} entry={entry.node}/>);
            })
        }
    }
    render() {
        return (
            <ListGroup componentClass="div">
                {this.renderEntries()}
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
