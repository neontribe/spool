import React, { Component } from 'react';
import Relay from 'react-relay';
import withRoles from '../auth/withRoles.js';
import {RequestContainer} from './Request';
import { Glyphicon } from 'react-bootstrap';
import { Link } from 'react-router';

class RequestViewer extends Component {
    renderRequestContainers() {
        return this.props.consumer.requests.edges.map((edge, i) => (<RequestContainer key={i} request={edge.node} />));
    }
    render() {
        return (
            <div>
                <h2>Your Requests</h2>
                <Link className="btn" to={'/dashboard'}>
                    <Glyphicon glyph="remove"/> Quit
                </Link>
                {this.renderRequestContainers()}
            </div>);
    }
}

//RequestViewer = withRouter(RequestViewer);
export default RequestViewer;

export const RequestViewerContainer = Relay.createContainer(withRoles(RequestViewer,{
    roles: ['consumer'],
    fallback: '/settings/configure',
}), {
    fragments: {
        user: () => Relay.QL`
        fragment on User {
            role
        }`,
        consumer: () => Relay.QL`
        fragment on Consumer {
            requests(first: 100) {
                edges {
                    node {
                        ${RequestContainer.getFragment('request')}
                    }
                }
            }
        }`,
    }
});
