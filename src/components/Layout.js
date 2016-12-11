import React, { Component } from 'react';
// Todo: Fix this App code
import styles from './css/App.module.css';
import a11y from '../css/A11y.module.css';
import { withRouter, Link } from 'react-router';
import ProfileLink from './ProfileLink';
import Hamburger from './Hamburger';
import Icon from './Icon';

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

          {this.state.profile && (
            <Hamburger
              text={this.state.profile.name}
              toggleClassName={styles.contextMenuToggle}
              contentClassName={styles.contextMenuContent}
            >
              <ul className={styles.contextMenu}>
                <li className={styles.contextMenuItem}>
                  <Link to={'/'}>Home</Link>
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
              <h2 className={styles.filterHeader}>Gallery filters</h2>
              <ul>
                <li className={styles.filter}>
                  <a role='button' className={styles.filterControl}>
                    <Icon icon='happy' light={true} />
                    Toggle happy
                  </a>
                </li>
                <li className={styles.filter}>
                  <a role='button' className={styles.filterControl}>
                    <Icon icon='sad' light={true} />
                    Toggle sad
                  </a>
                </li>
                <li className={styles.filter}>
                  <a role='button' className={styles.filterControlOn}>
                    <Icon icon='work' light={true} />
                    Toggle work
                  </a>
                </li>
                <li className={styles.filter}>
                  <a role='button' className={styles.filterControlOn}>
                    <Icon icon='learning' light={true} />
                    Toggle learning
                  </a>
                </li>
                <li className={styles.filter}>
                  <a role='button' className={styles.filterControlOn}>
                    <Icon icon='home' light={true} />
                    Toggle home
                  </a>
                </li>
                <li className={styles.filter}>
                  <a role='button' className={styles.filterControl}>
                    <Icon icon='food' light={true} />
                    Toggle food
                  </a>
                </li>
                <li className={styles.filter}>
                  <a role='button' className={styles.filterControl}>
                    <Icon icon='relationships' light={true} />
                    Toggle relationships
                  </a>
                </li>
                <li className={styles.filter}>
                  <a role='button' className={styles.filterControlOn}>
                    <Icon icon='activities' light={true} />
                    Toggle activities
                  </a>
                </li>
                <li className={styles.filter}>
                  <a role='button' className={styles.filterControlOn}>
                    <Icon icon='travel' light={true} />
                    Toggle travel
                  </a>
                </li>
                <li className={styles.filter}>
                  <a role='button' className={styles.filterControl}>
                    <Icon icon='health' light={true} />
                    Toggle health
                  </a>
                </li>
                <li className={styles.filter}>
                  <a role='button' className={styles.filterControl}>
                    <Icon icon='video' light={true} />
                    Toggle videos
                  </a>
                </li>
                <li className={styles.filter}>
                  <a role='button' className={styles.filterControl}>
                    <Icon icon='photo' light={true} />
                    Toggle photos
                  </a>
                </li>
                <li className={styles.filter}>
                  <a role='button' className={styles.filterControl}>
                    <Icon icon='typing' light={true} />
                    Toggle written
                  </a>
                </li>
              </ul>
            </Hamburger>
          )}
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
