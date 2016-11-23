import React, { Component } from 'react';
import Relay from 'react-relay';
import _ from 'lodash';

import UpdateUserRequestMutation from './mutations/UpdateUserRequestMutation.js';

export default class UserRequest extends Component {
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
        super (props);

        this.state = {
            alertVisible: true,
            activeRequestId: props.userRequest.id,
        };

        this.hide = this.hide.bind(this);
        this.accept = this.accept.bind(this);
        this.deny = this.deny.bind(this);
    }

    componentWillReceiveProps (newProps) {
        var newActiveRequestId = newProps.userRequest.id;

        if (newActiveRequestId !== this.state.activeRequestId) {
            this.setState({
                alertVisible: true,
                activeRequestId: newActiveRequestId
            });
        }
    }

    hide () {
        this.setState({
            alertVisible: false
        });
    }

    accept () {
        this.update(true);
        this.hide();
    }

    deny () {
        this.update(false);
        this.hide();
    }

    update (access) {
        var userRequest = this.props.userRequest;
        var creator = this.props.creator;
        var payload = {
            creator,
            userRequest,
            access
        };

        if (this.props.mutate) {
            this.props.relay.commitUpdate(
                new UpdateUserRequestMutation(payload)
            );
        }

        if (_.isFunction(this.props.onUpdate)) {
            this.props.onUpdate(payload);
        }
    }

    render () {
        if (this.state.alertVisible) {
            // <Alert bsStyle="info" onDismiss={!this.props.inert ? this.deny : null} >
            return (
                <div>
                    <img src={this.props.userRequest.request.avatar} alt="avatar" />

                    <p>
                        <strong>{this.props.userRequest.request.name}</strong> from <strong>
                        {this.props.userRequest.request.org}</strong> would like to be able to see your entries about
                        <strong>{this.props.userRequest.request.topics.map((t) => t.type || t).join(' and ')}</strong>
                        because they are <strong>{this.props.userRequest.request.reason}</strong>
                    </p>

                    <div>
                        <button disabled={this.props.inert} onClick={this.deny} >No</button>
                        <button disabled={this.props.inert} onClick={this.accept} >Yes</button>
                    </div>
                </div>
            );
        }

        return null;
    }
}

export const UserRequestContainer = Relay.createContainer(UserRequest, {
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
