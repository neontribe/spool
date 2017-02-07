import React, { Component } from 'react';
import { withRouter, Link } from 'react-router';
import _ from 'lodash';

import Hamburger from './Hamburger';

import styles from './css/App.module.css';

class Header extends Component {
    static propTypes = {
        showHamburger: React.PropTypes.bool,
        menuItems: React.PropTypes.arrayOf(React.PropTypes.element)
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
                        <Link to={'/app'}>Daybook</Link>
                    </h1>

                    {!this.state.hamburgerExpanded && this.props.children}

                    {this.props.showHamburger && (
                        <Hamburger
                            text={this.state.profile && this.state.profile.name}
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

                                {(this.state.profile && this.props.auth.loggedIn()) && (
                                    <li className={styles.contextMenuItemSettings}>
                                        <Link to='/app/settings'>Settings</Link>
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
                                <div className={styles.contextMenuContentWrapper}>{this.props.menuContent}</div>
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
    static Header = withRouter(Header);
    static Content = Content;

    render () {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}
