import React, { Component } from 'react';
import ProfileLink from './ProfileLink';
import { Link } from 'react-router';
import styles from './css/Hamburger.module.css';

class Hamburger extends Component {
    constructor (props) {
        super(props);

        this.state = {
            expanded: false
        }

        this.toggleContent = this.toggleContent.bind(this);
    }

    toggleContent () {
        this.setState({
            expanded: !this.state.expanded
        });
    }

    render () {
        return (
            <div>
                <span className={this.props.toggleClassName}>
                    <button className={styles.hamburger} onClick={this.toggleContent}>
                        {this.props.text && (
                            <span className={styles.text}>{this.props.text}</span>
                        )}

                        <span className={styles.hamburgerBox}>
                            <span className={(this.state.expanded) ? styles.hamburgerActive : styles.hamburgerInner}></span>
                        </span>
                    </button>
                </span>

                {this.state.expanded && (
                    <div className={styles.contextMenuContent}>
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
                    {this.props.children}</div>
                )}
            </div>
        );
    }
}

Hamburger.propTypes = {
    text: React.PropTypes.string,
    contentClassName: React.PropTypes.string,
    toggleClassName: React.PropTypes.string
}

Hamburger.defaultProps = {
    contentClassName: '',
    toggleClassName: ''
}

export default Hamburger;
