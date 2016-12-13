import React, { Component } from 'react';
//todo fix this Appc ode
import styles from './css/App.module.css';
import a11y from '../css/A11y.module.css';
import { withRouter, Link } from 'react-router';

class Header extends Component {
    constructor(props) {
        super(props);

        this.logout = this.logout.bind(this);

        this.state = {
            profile: props.auth.getProfile()
        };

        props.auth.on('profile_updated', (newProfile) => {
          this.setState({
            profile: newProfile
          });
        });
    }

    logout (e) {
        e.preventDefault();

        // Destroys the session data
        this.props.auth.logout();

        // Redirects to login page
       
        this.props.router.push('/login');
    }

    render() {
      return (
        <div className={styles.header}>
          <h1 className={styles.logo}>
            <Link to={'/'}>SPOOL</Link>
          </h1>
          {this.props.children}
        </div>
      );
    }
}

class Content extends Component {
    render() {
        return (
            <div className={styles.content}>{this.props.children}</div>
        );
    }
}

export default class Layout extends Component {
    static Header = withRouter(Header);
    static Content = Content;

    render () {
        return (
            <div>
                {this.props.children}
            </div>
        )
    }
}
