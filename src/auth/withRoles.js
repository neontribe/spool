import React from 'react';
import Relay from 'react-relay';
import { withRouter } from 'react-router';

export default function withRoles(Component, roles) {
    return withRouter(class WrappedWithRoles extends React.Component {
        componentWillMount() {
            if(!this.valid()) {
                this.props.router.push('/');
            }
        }
        valid() {
            return !!(roles.indexOf(this.props.user.role)+1);
        }
        render () {
            if(this.valid()) {
                return <Component { ...this.props }/>
            } else {
                return null;
            }
        }
    });
}

export const userFragment = Relay.QL`
        fragment on User {
            role
        }`;
