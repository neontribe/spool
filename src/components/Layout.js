import React, { Component } from 'react';
//todo fix this Appc ode
import styles from './css/App.module.css';
import a11y from '../css/A11y.module.css';
import { withRouter, Link } from 'react-router';
import ProfileLink from './ProfileLink';
import Hamburger from './Hamburger';


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

          { this.props.children }

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
              <h2 className={a11y.vh}>Filter content</h2>
              <ul>
                <li className={styles.filter}>
                  <a role='button' className={styles.filterHappyOn}>Hide happy</a>
                </li>
                <li className={styles.filter}>
                  <a role='button' className={styles.filterSadOn}>Hide sad</a>
                </li>
                <li className={styles.filter}>
                  <a role='button' className={styles.filterOn}>&times; <span>Hide filter</span></a>
                </li>
                <li className={styles.filter}>
                  <a role='button' className={styles.filterOn}>&times; <span>Hide filter</span></a>
                </li>
                <li className={styles.filter}>
                  <a role='button' className={styles.filterOn}>&times; <span>Hide filter</span></a>
                </li>
                <li className={styles.filter}>
                  <a role='button' className={styles.filterControl}>&times; <span>Show filter</span></a>
                </li>
                <li className={styles.filter}>
                  <a role='button' className={styles.filterControl}>&times; <span>Show filter</span></a>
                </li>
                <li className={styles.filter}>
                  <a role='button' className={styles.filterOn}>&times; <span>Hide filter</span></a>
                </li>
                <li className={styles.filter}>
                  <a role='button' className={styles.filterOn}>&times; <span>Hide filter</span></a>
                </li>
                <li className={styles.filter}>
                  <a role='button' className={styles.filterControl}>&times; <span>Hide filter</span></a>
                </li>
                <li className={styles.filter}>
                  <a role='button' className={styles.filterOn}>&times; <span>Hide filter</span></a>
                </li>
                <li className={styles.filter}>
                  <a role='button' className={styles.filterOn}>&times; <span>Hide filter</span></a>
                </li>
              </ul>
            </Hamburger>
          )}
        </div>);
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
                { this.props.children }
            </div>
        )
    }
}
