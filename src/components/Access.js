import React, { Component } from 'react';
import Relay from 'react-relay';
import withRoles from '../auth/withRoles.js';
import { AccessFormContainer } from './AccessForm.js';
import { EntryContainer } from './Entry.js';
import moment from 'moment';

const AccessList = ({children}) => (<ul>{children}</ul>);
export default class Access extends Component {
    constructor(props) {
        super(props);
        this.handleFormSuccess = this.handleFormSuccess.bind(this);
    }
    handleFormSuccess({from, to, topics}) {
        this.relay.setVariables({
            range: {
                from,
                to,
            },
            topics: topics,
            ready: true,
        })
    }
    renderAccessList() {
        if (this.props.access && this.props.access.entries) {
            return (<AccessList><div>Foo</div></AccessList>);
        }
        return null;
    }
    render () {
        console.log(this.props);
        return (<div>
            <AccessFormContainer onSuccess={this.handleFormSuccess} consumer={this.props.consumer}/>
            { this.renderAccessList() }
        </div>);
    }
}

export const AccessContainer = Relay.createContainer(withRoles(Access, {
    roles: ['consumer'],
    fallback: '/settings/configure'
}), {
    initialVariables: {
        first: 100,
        ready: false,
        range: {
            from: moment(),
            to: moment(),
        },
        topics: [],
    },
    fragments: {
        user: () => Relay.QL`
            fragment on User {
                role
            }`,
        consumer: () => Relay.QL`
            fragment on Consumer {
                access(range: $range, topics: $topics) @include(if: $ready){
                    entries(first: $first) {
                        ${EntryContainer.getFragment('entry')}
                    }
                }
                ${AccessFormContainer.getFragment('consumer')}
            }`,
    }
});
