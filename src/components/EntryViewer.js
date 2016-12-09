import React, { Component } from 'react';
import Relay from 'react-relay';
import moment from 'moment';
import { EntryContainer } from './Entry';

export default class EntryViewer extends Component {
    static propTypes = {
    }
    render () {
        console.log(this.props);
        return (
            <div>
                <EntryContainer entry={this.props.node} />
            </div>
        );
    }
}

export const EntryViewerContainer = Relay.createContainer(EntryViewer, {
    fragments: {
        node: () => Relay.QL`
        fragment on Entry {
            id
            ${EntryContainer.getFragment('entry')}
        }
        `,
    }
});
