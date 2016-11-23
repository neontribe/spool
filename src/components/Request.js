import React, { Component } from 'react';
import Relay from 'react-relay';

import { EntryContainer } from './Entry.js';

export class Request extends Component {
    static PropTypes = {
        request: React.PropTypes.object.isRequired,
    }

    constructor (props) {
        super(props);

        this.state = {
            showEntries: false,
        };

        this.toggleEntries = this.toggleEntries.bind(this);
    }

    renderViewEntries () {
        if (!this.state.showEntries) {
            return (
                <button
                    disabled={this.props.request.entries.edges.length === 0}
                    onClick={this.toggleEntries}
                >View {this.props.request.entries.edges.length} Entries</button>
            );
        }
    }

    renderHideEntries () {
        if (this.state.showEntries) {
            return (
                <button
                    onClick={this.toggleEntries}
                >Hide Entries</button>
            );
        }
    }

    toggleEntries () {
        this.setState({
            showEntries: !this.state.showEntries,
        });
    }

    renderEntries () {
        if (this.state.showEntries) {
            return this.props.request.entries.edges.map((edge, i) => (
                <EntryContainer key={i} entry={edge.node} />)
            );
        }
    }

    render () {
        //<Alert bsStyle="info">

        return (
            <div>
                <h3>You said&hellip;</h3>

                <img src={this.props.request.avatar} alt="avatar" />

                <p>
                    &ldquo;<strong>{this.props.request.name}</strong> from <strong>{this.props.request.org}</strong>
                    would like to be able to see your entries about <strong>
                    {this.props.request.topics.map((t) => t.type || t).join(' and ')}</strong> because they are
                    <strong>{this.props.request.reason}</strong>&rdquo;
                </p>

                <div>
                    {this.renderHideEntries()}
                    {this.renderViewEntries()}
                </div>

                {this.renderEntries()}
            </div>
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
