import React, { Component } from 'react';
import { Alert, Button, Glyphicon, Image } from 'react-bootstrap';
import Relay from 'react-relay';
import UpdateUserRequestMutation from './mutations/UpdateUserRequestMutation.js';
import UpdateEntryRequestMutation from './mutations/UpdateEntryRequestMutation.js';
import _ from 'lodash';

export default class Request extends Component {
    static PropTypes = {
        userRequest: React.PropTypes.object.isRequired,
        creator: React.PropTypes.object.isRequired,
        inert: React.PropTypes.bool,
        mutate: React.PropTypes.bool,
        onUpdate: React.PropTypes.func
    }

    static defaultProps = {
        inert: false,
        mutate: true,
    }

    constructor(props) {
        super(props);

        this.state = {
            alertVisible: true
        }

        this.hide = this.hide.bind(this);
        this.accept = this.accept.bind(this);
        this.deny = this.deny.bind(this);
    }

    hide() {
        this.setState({
            alertVisible: false
        });
    }

    accept() {
        this.update(true);
        this.hide();
    }

    deny() {
        this.update(false);
        this.hide();
    }

    update(access) {
        var userRequest = this.props.userRequest;
        var creator = this.props.creator;
        var payload = {creator, userRequest, access};
        if (this.props.mutate) {
            this.props.relay.commitUpdate(
                new UpdateUserRequestMutation(payload),
                {
                    onSuccess: function(response) {
                        console.log(response);
                    }
                }
            );
        }
        if(_.isFunction(this.props.onUpdate)) {
            this.props.onUpdate(payload);
        }
    }

    render() {
        if (this.state.alertVisible) {
            return (
                <Alert bsStyle="info" onDismiss={!this.props.inert ? this.deny : null} >
                    <Image
                            src={this.props.userRequest.request.avatar}
                            className='profile-img'
                            circle
                            />

                        <p><strong>{this.props.userRequest.request.name}</strong> from <strong>{this.props.userRequest.request.org}</strong> would like to be able to see your entries about <strong>{this.props.userRequest.request.topics.map((t) => t.type || t).join(' and ')}</strong> because they are <strong>{this.props.userRequest.request.reason}</strong></p>

                        <div className="full-width centered">
                            <Button bsStyle="danger"
                                disabled={this.props.inert}
                                onClick={this.deny}><Glyphicon glyph="remove"/> No</Button>
                            <Button bsStyle="success"
                                disabled={this.props.inert}
                                onClick={this.accept}><Glyphicon glyph="ok"/> Yes</Button>
                        </div>

                </Alert>
            );
        } else {
            return null;
        }
    }
}

export const RequestContainer = Relay.createContainer(Request, {
    fragments: {
        creator: () => Relay.QL`
            fragment on Creator {
                ${UpdateUserRequestMutation.getFragment('creator')}
            }
        `,
        userRequest: () => Relay.QL`
            fragment on UserRequest {
                id
                seen
                request {
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
                ${UpdateUserRequestMutation.getFragment('userRequest')}
            }
        `,
    }
});

export class EntryRequest extends Component {
    static PropTypes = {
        entry: React.PropTypes.object.isRequired,
        creator: React.PropTypes.object.isRequired,
        userRequest: React.PropTypes.object.isRequired,
        onDone: React.PropTypes.func.isRequired,
        mutate: React.PropTypes.bool,
    }
    constructor(props) {
        super(props);
        this.done = this.done.bind(this);
    }
    done(updatePayload) {
        // right now we only deal with allowing access
        // due to application flow and spec, no reason to implement the rest
        if (updatePayload.access) {
            var mutationProps = {
                userRequest: this.props.userRequest,
                entry: this.props.entry,
                // right now
                access: updatePayload.access,
            };
            this.props.relay.commitUpdate(
                new UpdateEntryRequestMutation(mutationProps),
                { onSuccess: () => this.props.onDone(this.props.userRequest.userRequestId) }
            );
        } else {
            this.props.onDone(this.props.userRequest.id);
        }
    }
    render() {
        return (<RequestContainer 
                    userRequest={this.props.userRequest} 
                    creator={this.props.creator} 
                    mutate={false}
                    onUpdate={this.done}/>);
    }
}

export const EntryRequestContainer = Relay.createContainer(EntryRequest, {
    fragments: {
        creator: () => Relay.QL`
        fragment on Creator {
            ${RequestContainer.getFragment('creator')}
        }`,
        entry: () => Relay.QL`
        fragment on Entry {
            ${UpdateEntryRequestMutation.getFragment('entry')}
        }`,
        userRequest: () => Relay.QL`
        fragment on UserRequest {
            id
            ${UpdateEntryRequestMutation.getFragment('userRequest')}
            ${RequestContainer.getFragment('userRequest')}
        }`,
    }
});
