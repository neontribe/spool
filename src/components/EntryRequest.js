import React, { Component } from 'react';
import Relay from 'react-relay';

import UpdateEntryRequestMutation from './mutations/UpdateEntryRequestMutation.js';
import { UserRequestContainer } from './UserRequest.js';

export class EntryRequest extends Component {
    static PropTypes = {
        entry: React.PropTypes.object.isRequired,
        creator: React.PropTypes.object.isRequired,
        userRequest: React.PropTypes.object.isRequired,
        onDone: React.PropTypes.func.isRequired,
        mutate: React.PropTypes.bool,
    }

    constructor (props) {
        super(props);

        this.done = this.done.bind(this);
    }

    done (updatePayload) {
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
                {
                    onSuccess: () => this.props.onDone(this.props.userRequest.id)
                }
            );
        } else {
            this.props.onDone(this.props.userRequest.id);
        }
    }

    render () {
        return (
            <UserRequestContainer 
                userRequest={this.props.userRequest} 
                creator={this.props.creator} 
                mutate={false}
                onUpdate={this.done}
            />
        );
    }
}

export const EntryRequestContainer = Relay.createContainer(EntryRequest, {
    fragments: {
        creator: () => Relay.QL`
        fragment on Creator {
            ${UserRequestContainer.getFragment('creator')}
        }`,
        entry: () => Relay.QL`
        fragment on Entry {
            ${UpdateEntryRequestMutation.getFragment('entry')}
        }`,
        userRequest: () => Relay.QL`
        fragment on UserRequest {
            id
            ${UpdateEntryRequestMutation.getFragment('userRequest')}
            ${UserRequestContainer.getFragment('userRequest')}
        }`,
    }
});
