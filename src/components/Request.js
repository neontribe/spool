import React, { Component } from 'react';
import { Alert, Button, Glyphicon, Image } from 'react-bootstrap';
import Relay from 'react-relay';
import UpdateUserRequestMutation from './mutations/UpdateUserRequestMutation.js';

class Request extends Component {
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
        this.props.relay.commitUpdate(
            new UpdateUserRequestMutation({creator, userRequest, access})
        );
    }

    render() {
        if (this.state.alertVisible) {
            return (
                <Alert bsStyle="info" onDismiss={this.props.allowMutation ? this.deny : null} >
                    <Image
                            src={this.props.userRequest.request.avatar}
                            className='profile-img'
                            circle
                            />

                        <p><strong>{this.props.userRequest.request.name}</strong> from <strong>{this.props.userRequest.request.org}</strong> would like to be able to see your entries about <strong>{this.props.userRequest.request.topics.map((t) => t.type || t).join(' and ')}</strong> because they are <strong>{this.props.userRequest.request.reason}</strong></p>
                    {/**<div className="easyread">
                        <div>
                            <Image
                                src={this.props.issuerAvatar}
                                className='profile-img'
                                circle
                                />
                        </div>
                        <div>
                            <IconCard icon="eye-open" />
                        </div>

                        { this.props.topics.map((topic, i) => {
                            return (<div key={topic + '_' + i}><IconCard icon={topic} /></div>);
                        })}

                        <div>
                            <IconCard icon="question-sign" />
                        </div>
                    </div>**/}

                        <div className="full-width centered">
                            <Button bsStyle="danger"
                                disabled={!this.props.allowMutation}
                                onClick={this.deny}><Glyphicon glyph="remove"/> No</Button>
                            <Button bsStyle="success"
                                disabled={!this.props.allowMutation}
                                onClick={this.accept}><Glyphicon glyph="ok"/> Yes</Button>
                        </div>

                </Alert>
            );
        } else {
            return null;
        }
    }
}

Request.PropTypes = {
    userRequest: React.PropTypes.object.isRequired,
    allowMutation: React.PropTypes.bool
}

Request.defaultProps = {
    allowMutation: true
}

export default Request;

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
