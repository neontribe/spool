import React, { Component } from 'react';
import { withRouter } from 'react-router';

import Layout from './Layout';
import Button from './Button';

import styles from './css/Login.module.css';

const { Content, Header } = Layout;

class Welcome extends Component {
    constructor (props) {
        super(props);
        this.handleRedirectToLogin = this.handleRedirectToLogin.bind(this);
        this.handleRedirectToSignup = this.handleRedirectToSignup.bind(this);
    }

    handleRedirectToLogin () {
        this.props.router.push('/login/continue');
    }

    handleRedirectToSignup () {
        this.props.router.push('/login/signup');
    }

    render () {
        return (
            <Layout>
                <Header auth={this.props.auth} showHamburger={false} user={null} />
                <Content>
                    <div className={styles.wrapper}>
                        <div className={styles.btnWrapper}>
                            <Button onClick={this.handleRedirectToLogin}>Login</Button>
                            <Button onClick={this.handleRedirectToSignup}>Signup</Button>
                            <div className={styles.linkWrapper}>
                                <a href="https://www.daybookuk.org/" target="_blank">Learn more about Daybook</a>
                            </div>
                        </div>
                    </div>
                </Content>
            </Layout>
        );
    }
}

export default withRouter(Welcome);
