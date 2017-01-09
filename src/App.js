import React, { Component } from 'react';
import Relay from 'react-relay';
import { withRouter } from 'react-router';
import * as viewportUnitsBuggyfill from 'viewport-units-buggyfill';
import hacks from 'viewport-units-buggyfill/viewport-units-buggyfill.hacks';

import styles from './components/css/App.module.css';

class App extends Component {
    render () {
        let children = null;

        if (this.props.children) {
            children = React.cloneElement(this.props.children, {
                auth: this.props.route.auth
            });
        }

        return (
            <div className={styles.app}>
                {children}
            </div>
        );
    }
}

// export default App = withRouter(App);
export default withRouter(App);

class RoleWrapper extends Component {
    componentDidMount () {
        const { children } = this.props;

        if (!children) {
            this.navigateHome();
        }

        viewportUnitsBuggyfill.init({
            hacks
        });

        setInterval(viewportUnitsBuggyfill.refresh, 300);
    }

    componentWillReceiveProps ({ children }) {
        if (!children) {
            this.navigateHome();
        }
    }

    navigateHome () {
        var path = '';

        switch (this.props.user.role) {
                default:
                case 'creator':
                    path = '/app/home';
                    break;

                case 'consumer':
                    path = '/app/dashboard';
                    break;
        }

        this.props.router.push(path);
    }

    render () {
        let children = null;

        if (this.props.children) {
            children = React.cloneElement(this.props.children, {
                auth: this.props.route.auth
            });
        }

        return (
            <div style={{ height: '100%' }}>{children}</div>
        );
    }
}

export const RoleWrapperContainer = Relay.createContainer(withRouter(RoleWrapper), {
    fragments: {
        user: () => Relay.QL`
            fragment on User {
                id
                role
            }`
    }
});
