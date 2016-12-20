import React, { Component } from 'react';
import Relay from 'react-relay';
import { withRouter } from 'react-router';

import styles from './components/css/App.module.css';
import a11y from './css/A11y.module.css';

class App extends Component {
    componentDidMount() {
        const {children} = this.props;
        if(!children) {
            this.navigateHome();
        }
    }
    componentWillReceiveProps({children}) {
        if(!children) {
            this.navigateHome();
        }
    }
    navigateHome() {
        var path = '';
        switch(this.props.user.role) {
            default:
            case 'creator': 
                path = '/home';
                break;
            case 'consumer':
                path = '/dashboard';
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
            <div className={styles.app}>
                {children}
            </div>
        );
    }
}

App = withRouter(App);
export default Relay.createContainer(App, {
    fragments: {
        user: () => Relay.QL`
            fragment on User {
                id
                role
            }`,
    }
});
