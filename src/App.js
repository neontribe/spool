import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router';

import ProfileLink from './components/ProfileLink';
import Hamburger from './components/Hamburger';

import styles from './components/css/App.module.css';
import a11y from './css/A11y.module.css';

class App extends Component {
  render () {
    let children = null;
    if (this.props.children) {
      children = React.cloneElement(this.props.children, {
        auth: this.props.route.auth
      });
    }
    return (
        <div className={styles.app}>
            {children}
        </div>
    );
  }
}

export default withRouter(App);
