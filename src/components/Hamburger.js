import React, { Component } from 'react';

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
                        <span className={styles.hamburgerBox}>
                            <span className={(this.state.expanded) ? styles.hamburgerActive : styles.hamburgerInner}></span>
                        </span>
                    </button>
                </span>

                {this.state.expanded && (
                    <div className={this.props.contentClassName}>{this.props.children}</div>
                )}
            </div>
        );
    }
}

Hamburger.propTypes = {
    contentClassName: React.PropTypes.string,
    toggleClassName: React.PropTypes.string
}

Hamburger.defaultProps = {
    contentClassName: '',
    toggleClassName: ''
}

export default Hamburger;
