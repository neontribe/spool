import React, { Component } from 'react';
import { withRouter } from 'react-router';

import ProfileLink from './components/ProfileLink';

class App extends Component {

  constructor (props, context) {
      super(props, context);

      this.state = {
          profile: props.route.auth.getProfile()
      };

      props.route.auth.on('profile_updated', (newProfile) => {
        this.setState({
          profile: newProfile
        });
      });

      this.logout = this.logout.bind(this);
  }

  logout (e) {
    e.preventDefault();

    // Destroys the session data
    this.props.route.auth.logout();

    // Redirects to login page
    this.props.router.push('/login');
  }

  render () {
    let children = null;

    if (this.props.children) {
        children = React.cloneElement(this.props.children, {
            auth: this.props.route.auth
        });
    }

    return (
        <div>
          <div>
            <h1>SPOOL</h1>

            <ProfileLink
              profile={this.state.profile}
              disabled={!this.props.route.auth.loggedIn()}
            />

            {this.props.route.auth.loggedIn() && (
              <a href='/logout' role='button' onClick={this.logout}>Log out</a>
            )}
          </div>
          <div>
            {children}
          </div>
        </div>
    );
  }
}

export default withRouter(App);
