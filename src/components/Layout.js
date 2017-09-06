import React, { Component } from 'react';
import Relay from 'react-relay';
import { withRouter, Link } from 'react-router';
import _ from 'lodash';
import Button from './Button';

import Hamburger from './Hamburger';

import styles from './css/App.module.css';
import logo from './css/assets/compressed/logo-white.svg';

class Header extends Component {
    static propTypes = {
        showHamburger: React.PropTypes.bool,
        menuItems: React.PropTypes.arrayOf(React.PropTypes.element),
        showPasswordReset: React.PropTypes.bool
    }

    static defaultProps = {
        showHamburger: true,
        menuItems: []
    }

    constructor (props) {
        super(props);

        this.logout = this.logout.bind(this);

        var fullscreen =
            document.fullScreen ||
            document.mozFullScreen ||
            document.webkitIsFullScreen;

        this.state = {
            profile: props.auth.getProfile(),
            hamburgerExpanded: false,
            fullscreen
        };

        this.onHamburgerExpand = _.partial(this.onHamburgerToggle.bind(this), 'expanded');
        this.onHamburgerCollapse = _.partial(this.onHamburgerToggle.bind(this), 'collapsed');
        this.handleProfileUpdated = this.handleProfileUpdated.bind(this);
        this.handleResetPassword = this.handleResetPassword.bind(this);
    }

    handleProfileUpdated (profile) {
        this.setState({
            profile
        });
    }

    componentDidMount () {
        this.props.auth.on('profile_updated', this.handleProfileUpdated);
    }

    componentWillUnmount () {
        this.props.auth.removeListener('profile_updated', this.handleProfileUpdated);
    }

    logout (e) {
        e && e.preventDefault();
        this.props.auth.logout();
    }

    onHamburgerToggle (state) {
        this.setState({
            hamburgerExpanded: state === 'expanded'
        });
    }

    handleResetPassword () {
        this.props.auth.changePassword(this.state.profile.email, (err, response) => {
            if (!err) {
                alert(response);
            }
        });
    }

    render () {
        let displayName = (this.props.user && this.props.user.profile && this.props.user.profile.nickname) || (this.props.profile && this.props.profile.name);
        return (
            <div>
                {this.state.hamburgerExpanded && (
                    <div className={styles.overlay}></div>
                )}

                <div className={(this.state.hamburgerExpanded) ? styles.headerExpanded : styles.header}>
                    <div className={styles.mothball}>
                        <p>Daybook is just a demo right now. Anything you add will be deleted regularly.</p>
                    </div>

                    <h1 className={styles.logo}>
                        <Link to={'/app'}>
                            <img src={logo} alt="Daybook"/>
                        </Link>
                    </h1>

                    {!this.state.hamburgerExpanded && this.props.children}

                    {this.props.showHamburger && (
                        <Hamburger
                            text={displayName}
                            toggleClassName={styles.contextMenuToggle}
                            contentClassName={styles.contextMenuContent}
                            onExpand={this.onHamburgerExpand}
                            onCollapse={this.onHamburgerCollapse}
                        >
                            <ul className={styles.contextMenu}>
                                {(this.state.profile) && (
                                    <li className={styles.contextMenuItemHome}>
                                        <Link to='/app/home'>Home</Link>
                                    </li>
                                )}

                                <li className={styles.contextMenuItemAbout}>
                                    <a href="https://www.daybookuk.org/" target="_blank">About</a>
                                </li>

                                <li className={styles.contextMenuItemIntro}>
                                    <Link to="/app/introduction">Introduction</Link>
                                </li>

                                {(this.state.profile && this.props.auth.loggedIn() && this.props.user.role === 'creator') && (
                                    <li className={styles.contextMenuItemSettings}>
                                        <Link to={'/app/settings/' + this.props.user.id}>Settings</Link>
                                    </li>
                                )}

                                {(this.state.profile) && (
                                    <li className={styles.contextMenuItemLogout}>
                                        {this.props.auth.loggedIn() && (
                                            <a href='/logout' onClick={this.logout}>Log out</a>
                                        )}
                                    </li>
                                )}

                                {(this.props.menuItems.length > 0) && this.props.menuItems.map((item, i) => (
                                    <li key={i} className={styles.contextMenuItem}>{item}</li>
                                ))}
                            </ul>

                            {this.state.profile && (
                                <div className={styles.contextMenuContentWrapper}>
                                    {this.props.menuContent}
                                    {this.props.showPasswordReset && this.state.profile.email && <Button onClick={this.handleResetPassword}>Send me a password reset email</Button>}
                                </div>
                            )}
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
    static Header = withRouter(Relay.createContainer(Header, {
        fragments: {
            user: () => Relay.QL`
                fragment on User {
                    id
                    role
                    profile {
                        nickname
                    }
                }
            `
        }
    }));
    static Content = Content;

    render () {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}
