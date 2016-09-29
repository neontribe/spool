import React, { Component } from 'react';
import { Alert, Button, Glyphicon, Image } from 'react-bootstrap';
import Relay from 'react-relay';
import {EntryContainer} from './Entry.js';

export class Request extends Component {
    static PropTypes = {
        request: React.PropTypes.object.isRequired,
    }
    constructor(props) {
        super(props);
        this.state = {
            showEntries: false,
        };
        this.toggleEntries = this.toggleEntries.bind(this);
    }
    renderViewEntries() {
        if(!this.state.showEntries) {
            return (<Button bsStyle="success"
                            onClick={this.toggleEntries}><Glyphicon glyph="chevron-down"/> View {this.props.request.entries.edges.length} Entries</Button>);
        }
    }
    renderHideEntries() {
        if(this.state.showEntries) {
            return (<Button bsStyle="success"
                            onClick={this.toggleEntries}><Glyphicon glyph="chevron-up"/> Hide Entries</Button>);
        }
    }
    toggleEntries() {
        this.setState({
            showEntries: !this.state.showEntries,
        });
    }
    renderEntries() {
        if(this.state.showEntries) {
            return this.props.request.entries.edges.map((edge, i) => (<EntryContainer key={i} entry={edge.node} />));
        }
    }
    render() {
        return (
            <Alert bsStyle="info">
                    <h3>You said...</h3>
                    <Image
                        src={this.props.request.avatar}
                        className='profile-img'
                        circle
                        />
                        <p>&ldquo;<strong>{this.props.request.name}</strong> from <strong>{this.props.request.org}</strong> would like to be able to see your entries about <strong>{this.props.request.topics.map((t) => t.type || t).join(' and ')}</strong> because they are <strong>{this.props.request.reason}</strong>&rdquo;</p>
                    <div className="full-width centered">
                        {this.renderHideEntries()}
                        {this.renderViewEntries()}
                    </div>
                    {this.renderEntries()}
            </Alert>
        );
    }
}

export const RequestContainer = Relay.createContainer(Request, {
    fragments: {
        request: () => Relay.QL`
        fragment on Request {
            from
            to
            topics {
                type
                name
            }
            reason
            name
            avatar
            org
            entries(first: 100) {
                edges {
                    node {
                        ${EntryContainer.getFragment('entry')}
                    }
                }
            }
        }`,
    }
});
