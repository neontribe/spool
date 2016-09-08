import React, { Component } from 'react';
import Relay from 'react-relay';
import { ListGroup } from 'react-bootstrap';
import { EntryContainer, Entry } from './Entry';
import Intro from './Intro';

export class Timeline extends Component {
    static propTypes = {
        viewer: React.PropTypes.object.isRequired,
    }
    renderEntries() {
        if (this.props.relay) {
            return this.props.viewer.role.entries.edges.map((entry) => {
                return (<EntryContainer key={entry.node.id} entry={entry.node} />);
            })
        } else {
            return this.props.viewer.role.entries.edges.map((entry) => {
                return (<Entry key={entry.node.id} entry={entry.node} />);
            })
        }
    }
    render() {
        return (
            <ListGroup componentClass="div">
                {this.renderEntries()}
                {!this.props.viewer.role.entries.edges.length &&
                    <Intro />
                }
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
            role {
                ... on Creator {
                    entries(first: $first) {
                        edges {
                            node {
                                id,
                                ${EntryContainer.getFragment('entry')}
                            }
                        }
                    }
                }
            }
        }`,
    }
});
