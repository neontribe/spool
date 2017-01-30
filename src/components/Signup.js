import React, { Component } from 'react';
import _ from 'lodash';

import AuthService from '../auth/AuthService';
import Layout from './Layout';
import Button from './Button';
import EmailLogin from './EmailLogin.js';
import { GoogleLogin, TwitterLogin } from './Login.js';

import styles from './css/Login.module.css';

const { Header, Content } = Layout;

class Signup extends Component {
    constructor (props) {
        super(props);

        this.state = {
            emailLogin: false
        };

        this.handleUseEmail = this.handleUseEmail.bind(this);
        this.hideLogin = this.hideLogin.bind(this);
        this.handleEmailLoginSubmit = this.handleEmailLoginSubmit.bind(this);
    }

    emailSignup ({ email, password }) {
        this.props.auth.signup({
            connection: 'Username-Password-Authentication',
            username: email,
            password
        }, function (err) {
            if (err) {
                alert('something went wrong: ' + err.message);
            }
        });
    }

    handleUseEmail () {
        this.setState({
            emailLogin: true
        });
    }

    hideLogin () {
        this.setState({
            emailLogin: false
        });
    }

    handleEmailLoginSubmit (payload) {
        this.emailSignup(payload);
    }

    renderEmailSignup () {
        return (
            <div className={styles.emailLoginWrapper}>
                <Button onClick={this.hideLogin}>Back</Button>
                <div className={styles.emailLogin}>
                    <EmailLogin
                        submitText='Signup'
                        confirmPassword={true}
                        onSubmit={this.handleEmailLoginSubmit}
                    />
                </div>
            </div>
        );
    }

    renderButtonForm () {
        return (
            <div className={styles.btnWrapper}>
                <div>
                    <GoogleLogin auth={this.props.auth}>Signup using Google</GoogleLogin>
                </div>
                <div>
                    <TwitterLogin auth={this.props.auth}>Signup using Twitter</TwitterLogin>
                </div>
                <div>
                    <Button onClick={this.handleUseEmail}>Signup using Email</Button>
                </div>
            </div>
        );
    }

    render () {
        return (
            <Layout>
                <Header auth={this.props.auth} showHamburger={false} />
                <Content>
                    <div className={styles.wrapper}>
                        {this.state.emailLogin ? this.renderEmailSignup() : this.renderButtonForm()}
                    </div>
                </Content>
            </Layout>
        );
    }
}

Signup.propTypes = {
    auth: React.PropTypes.instanceOf(AuthService)
};

export default Signup;
