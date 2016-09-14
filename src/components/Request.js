import React, { Component } from 'react';
import { Alert, Button, Glyphicon, Image } from 'react-bootstrap';
import Relay from 'react-relay';

class Request extends Component {
    constructor(props) {
        super(props);

        this.state = {
            alertVisible: true
        }

        this.handleAlertDismiss = this.handleAlertDismiss.bind(this);
    }

    handleAlertDismiss() {
        this.setState({
            alertVisible: false
        });
    }

    render() {
        if (this.state.alertVisible) {
            return (
                <Alert bsStyle="info" onDismiss={this.props.allowMutation ? this.handleAlertDismiss : null} >
                    <Image
                            src={this.props.issuerAvatar}
                            className='profile-img'
                            circle
                            />

                    <p>{this.props.issuerName} would like to be able to see your entries about {this.props.topics.join(' and ')} because they are {this.props.reason}</p>
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
                                onClick={this.props.onDeny}><Glyphicon glyph="remove"/> No</Button>
                            <Button bsStyle="success"
                                disabled={!this.props.allowMutation}
                                onClick={this.props.onAccept}><Glyphicon glyph="ok"/> Yes</Button>
                        </div>

                </Alert>
            );
        } else {
            return null;
        }
    }
}

Request.PropTypes = {
    fromDate: React.PropTypes.string.isRequired,
    toDate: React.PropTypes.string.isRequired,
    reason: React.PropTypes.string.isRequired,
    topics: React.PropTypes.array.isRequired,
    issuerName: React.PropTypes.string.isRequired,
    issuerAvatar: React.PropTypes.string.isRequired,
    allowMutation: React.PropTypes.bool
}

Request.defaultProps = {
    allowMutation: true
}

export default Request;

export const RequestContainer = Relay.createContainer(Request, {
    fragments: {}
});
