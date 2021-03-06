import React, { Component } from 'react';

import styles from './css/Hamburger.module.css';

class Hamburger extends Component {
    static propTypes = {
        text: React.PropTypes.string,
        contentClassName: React.PropTypes.string,
        toggleClassName: React.PropTypes.string,
        onExpand: React.PropTypes.func,
        onCollapse: React.PropTypes.func
    }

    static defaultProps = {
        contentClassName: '',
        toggleClassName: '',
        onExpand: Function.prototype,
        onCollapse: Function.prototype
    }

    constructor (props) {
        super(props);

        this.state = {
            expanded: false
        };

        this.toggleContent = this.toggleContent.bind(this);
    }

    toggleContent () {
        var expanded = !this.state.expanded;

        this.setState({
            expanded
        });

        if (expanded) {
            this.props.onExpand();
        } else {
            this.props.onCollapse();
        }
    }

    render () {
        return (
            <div className={styles.wrapper}>
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
                    <div className={this.props.contentClassName}>{this.props.children}</div>
                )}
            </div>
        );
    }
}

export default Hamburger;
