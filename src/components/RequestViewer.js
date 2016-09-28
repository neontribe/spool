import React, { Component } from 'react';
import Relay from 'react-relay';
import { Button, Glyphicon } from 'react-bootstrap';
import {EntryRequestContainer} from './Request';
import { withRouter } from 'react-router';

class RequestViewer extends Component {
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
            return
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

RequestViewer = withRouter(RequestViewer);
export default RequestViewer;

export const RequestViewerContainer = Relay.createContainer(RequestViewer, {
    fragments: {
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
