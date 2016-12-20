import React from 'react';
import Relay from 'react-relay';
import { withRouter } from 'react-router';

export function withRoles(Component, roles) {
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

export function withIntroduction(Component) {
    return withRouter(class WrappedWithRequiredIntroduction extends React.Component {
        componentWillMount() {
            if(!this.valid()) {
                this.props.router.push('/introduction');
            }
        }
        valid() {
            return !!this.props.user.profile.isIntroduced;
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

export function withRequiredSetup(Component) {
    return withRouter(class WrappedWithRequiredSetup extends React.Component {
        componentWillMount() {
            if(!this.valid()) {
                this.props.router.push('/settings');
            }
        }
        valid() {
            return !!this.props.user.profile.isConfigured;
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
            profile {
                isIntroduced
            }
        }`;
