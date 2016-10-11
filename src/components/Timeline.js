import React, { Component } from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';
import { ListGroup, Glyphicon } from 'react-bootstrap';
import { EntryContainer, Entry } from './Entry';
import Intro from './Intro';
import UserRequest, { UserRequestContainer } from './UserRequest';
import _ from 'lodash';
import withRoles from '../auth/withRoles.js';

export class Timeline extends Component {
    static propTypes = {
        creator: React.PropTypes.object.isRequired,
    }

    constructor(props) {
        super(props);
        this.state = {
            hasEntries: props.creator.entries.edges.length
        };
    }

    renderEntries() {
        return this.props.creator.entries.edges.map((entry) => {
            if (this.props.relay) {
                return (<EntryContainer key={entry.node.id} entry={entry.node} />);
            } else {
                return (<Entry key={entry.node.id} entry={entry.node} />);
            }

        });
    }

    renderRequests() {
        if (this.props.creator.requests.edges.length) {
            var request = _.first(this.props.creator.requests.edges).node
            if (this.props.relay) {
                return (
                    <UserRequestContainer userRequest={request} creator={this.props.creator} />
                );
            } else {
                return (
                    <UserRequest userRequest={request} creator={this.props.creator}/>
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

export const TimelineContainer = Relay.createContainer(withRoles(Timeline, {
    roles: ['creator'],
    fallback: '/settings/configure',
}), {
    initialVariables: {
        first: 100,
    },
    fragments: {
        user: () => Relay.QL`
        fragment on User {
            role
        }`,
        creator: () => Relay.QL`
        fragment on Creator {
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
                        ${UserRequestContainer.getFragment('userRequest')}
                    }
                }
            }
            ${UserRequestContainer.getFragment('creator')}
        }`,
    }
});
