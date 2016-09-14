import React, { Component } from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';
import { ListGroup, Glyphicon } from 'react-bootstrap';
import { EntryContainer, Entry } from './Entry';
import Intro from './Intro';

export class Timeline extends Component {
    static propTypes = {
        viewer: React.PropTypes.object.isRequired,
    }

    constructor(props) {
        super(props);
        this.state = {
            hasEntries: props.viewer.role.entries.edges.length
        };
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
            <div>
                <div className="centered">
                    <Link className="btn" to={'/add'}>
                        <Glyphicon glyph="plus"/> {this.state.hasEntries ? 'Add New Entry' : 'Get Started'}</Link>
                </div>
                <ListGroup componentClass="div">
                    {this.renderEntries()}
                    {!this.state.hasEntries &&
                        <Intro />
                    }
                </ListGroup>
            </div>

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
                    happyCount
                    sadCount
                    entries(first: $first) {
                        edges {
                            node {
                                id,
                                ${EntryContainer.getFragment('entry')}
                            }
                        }
                    }
                    requests(first: $first) {
                        edges {
                            node {
                                id,
                                _id,
                                request {
                                    id
                                    from
                                    to
                                    region
                                }
                                seen
                            }
                        }
                    }
                }
            }
        }`,
    }
});
