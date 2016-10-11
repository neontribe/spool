import React from 'react';
import { withRouter } from 'react-router';

export default function withRoles(Component, options) {
    return withRouter(class WrappedWithRoles extends React.Component {
        componentWillMount() {
            if(!this.valid()) {
                this.props.router.push(options.fallback);
            }
        }
        valid() {
            return !!(options.roles.indexOf(this.props.user.role)+1);
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
