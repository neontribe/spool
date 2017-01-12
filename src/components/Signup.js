import React, { Component } from 'react';
import _ from 'lodash';

import AuthService from '../auth/AuthService';
import Layout from './Layout';
import Button from './Button';
import EmailLogin from './EmailLogin.js';

import styles from './css/Login.module.css';

import { GoogleLogin, TwitterLogin } from './Login.js';

const { Content } = Layout;

class Signup extends Component {
    constructor (props) {
        super(props);

        this.state = {
            emailLogin: false
        };

        this.handleUseEmail = this.handleUseEmail.bind(this);
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

    handleEmailLoginSubmit (payload) {
        this.emailSignup(payload);
    }

    renderEmailSignup() {
        if (!this.state.emailLogin) {
            return null;
        }
        return (
            <div>
                <EmailLogin
                    submitText={'Signup'}
                    confirmPassword={true}
                    onSubmit={this.handleEmailLoginSubmit} />
            </div>
        )
    }

    render () {
        const { children } = this.props;
        return (
            <Layout>
                <Content>
                    <div className={styles.wrapper}>
                        <div className={styles.btnWrapper}>
                            <h1>Signup</h1>
                            <GoogleLogin auth={this.props.auth}>Signup using Google</GoogleLogin>
                            <TwitterLogin auth={this.props.auth}>Signup using Twitter</TwitterLogin>
                            <Button onClick={this.handleUseEmail}>Signup using Email</Button>
                        </div>
                    </div>
                    { this.renderEmailSignup() }
                </Content>
            </Layout>
        );
    }
}

Signup.propTypes = {
    auth: React.PropTypes.instanceOf(AuthService)
}
export default Signup;
