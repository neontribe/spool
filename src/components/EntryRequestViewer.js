import React, { Component } from 'react';
import Relay from 'react-relay';
import { Button, Glyphicon } from 'react-bootstrap';
import {EntryRequestContainer} from './EntryRequest';
import { withRouter } from 'react-router';
import withRoles from '../auth/withRoles.js';

class EntryRequestViewer extends Component {
    constructor(props) {
        super(props);
        this.handleDone = this.handleDone.bind(this);
        this.handleRequestDone = this.handleRequestDone.bind(this);
        this.state = {
            ignore: []
        };
    }
    renderRequestContainers() {
        var self = this;
        return this.props.entry.requests.map(function (request, i) {
            if(self.state.ignore.indexOf(request.userRequest.id) === -1) {
                return (<EntryRequestContainer
                    key={i}
                    userRequest={request.userRequest}
                    creator={self.props.creator}
                    entry={self.props.entry}
                    onDone={self.handleRequestDone} />);
            }
            return null;
        });
    }
    render() {
        return (
            <div>
                {this.renderRequestContainers()}
                <div className="full-width">
                    <div className="group-right">
                        <Button
                            onClick={this.handleDone}>
                            <Glyphicon glyph="ok" /> DONE
                       </Button>
                    </div>
                </div>
            </div>);
    }
    handleDone() {
        this.props.router.push('/home');
    }
    handleRequestDone(userRequestId) {
        if((this.state.ignore.length + 1) === this.props.entry.requests.length) {
            this.handleDone();
        } else {
            this.setState({
                ignore: this.state.ignore.slice(0).push(userRequestId),
            });
        }
    }
}

EntryRequestViewer = withRouter(EntryRequestViewer);
export default EntryRequestViewer;

export const EntryRequestViewerContainer = Relay.createContainer(withRoles(EntryRequestViewer, {
    roles: ['creator'],
    fallback: '/settings/configure',
}), {
    fragments: {
        user: () => Relay.QL`
        fragment on User {
            role
        }`,
        creator: () => Relay.QL`
        fragment on Creator {
            ${EntryRequestContainer.getFragment('creator')}
        }`,
        entry: () => Relay.QL`
        fragment on Entry {
            ${EntryRequestContainer.getFragment('entry')}
            requests {
                userRequest {
                    ${EntryRequestContainer.getFragment('userRequest')}
                }
            }
        }`,
    }
});
