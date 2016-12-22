import React, { Component } from 'react';
import { withRouter, Link } from 'react-router';
import _ from 'lodash';

import ProfileLink from './ProfileLink';
import Hamburger from './Hamburger';

import styles from './css/App.module.css';

class Header extends Component {
    constructor(props) {
      super(props);

      this.logout = this.logout.bind(this);

      this.state = {
        profile: props.auth.getProfile(),
        hamburgerExpanded: false
      };

      this.onHamburgerExpand = _.partial(this.onHamburgerToggle.bind(this), 'expanded');
      this.onHamburgerCollapse = _.partial(this.onHamburgerToggle.bind(this), 'collapsed');

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

    onHamburgerToggle (state) {
      this.setState({
        hamburgerExpanded: state === 'expanded'
      });
    }

    render () {
      return (
        <div>
          {this.state.hamburgerExpanded && (
            <div className={styles.overlay}></div>
          )}

          <div className={(this.state.hamburgerExpanded) ? styles.headerExpanded : styles.header}>
            <h1 className={styles.logo}>
              <Link to={'/app'}>SPOOL</Link>
            </h1>

            {!this.state.hamburgerExpanded && this.props.children}

            {this.state.profile && (
              <Hamburger
                text={this.state.profile.name}
                toggleClassName={styles.contextMenuToggle}
                contentClassName={styles.contextMenuContent}
                onExpand={this.onHamburgerExpand}
                onCollapse={this.onHamburgerCollapse}
              >
                <ul className={styles.contextMenu}>
                  <li className={styles.contextMenuItem}>
                      <Link to={'/app/home'}>Home</Link>
                  </li>

                  <li className={styles.contextMenuItem}>
                    {/* Todo: Need to format the render of ProfileLink*/}
                    <ProfileLink
                      profile={this.state.profile}
                      disabled={!this.props.auth.loggedIn()}
                    />
                  </li>

                  <li className={styles.contextMenuItem}>
                    {this.props.auth.loggedIn() && (
                      <a href='/logout' onClick={this.logout}>Log out</a>
                    )}
                  </li>
                </ul>

                {/* Todo: Inject a component from the router, e.g. filter controls */}
                {this.props.menuContent}
              </Hamburger>
            )}
          </div>
        </div>
      );
    }
}

class Content extends Component {
    render () {
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
