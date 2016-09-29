import React, { Component } from 'react';
import Relay from 'react-relay';
import {RequestContainer} from './Request';

//import { Button, Glyphicon } from 'react-bootstrap';
//import { withRouter } from 'react-router';

class RequestViewer extends Component {
    renderRequestContainers() {
        return this.props.consumer.requests.edges.map((edge, i) => (<RequestContainer key={i} request={edge.node} />));
    }
    render() {
        return (
            <div>
                <h2>Your Requests</h2>
                {this.renderRequestContainers()}
            </div>);
    }
}

//RequestViewer = withRouter(RequestViewer);
export default RequestViewer;

export const RequestViewerContainer = Relay.createContainer(RequestViewer, {
    fragments: {
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
