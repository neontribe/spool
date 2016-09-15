import React, { Component } from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';
import { ListGroup, Glyphicon } from 'react-bootstrap';
import { EntryContainer, Entry } from './Entry';
import Intro from './Intro';
import Request, { RequestContainer } from './Request';
import _ from 'lodash';

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
        return this.props.viewer.role.entries.edges.map((entry) => {
            if (this.props.relay) {
                return (<EntryContainer key={entry.node.id} entry={entry.node} />);
            } else {
                return (<Entry key={entry.node.id} entry={entry.node} />);
            }

        });
    }

    renderRequests() {
        if (this.props.viewer.role.requests.edges.length) {
            var request = _.first(this.props.viewer.role.requests.edges).node.request
            if (this.props.relay) {
                return (
                    <RequestContainer {...request} />
                );
            } else {
                return (
                    <Request {...request} />
                );
            }
        }
    }

    render() {
        return (
            <div>

                <div className="centered" >
                    <div style={{width: '60%', margin:'auto'}}>
                        {this.renderRequests()}
                    </div>
                </div>

                <div className="centered">
                    <Link className="btn" to={'/add'}>
                        <Glyphicon glyph="plus"/> {this.state.hasEntries ? 'Add New Entry' : 'Get Started'}
                    </Link>
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
                                    org
                                    reason
                                    name
                                    avatar
                                    topics {
                                        type
                                        name
                                    }
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
