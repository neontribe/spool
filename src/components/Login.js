import React, { Component } from 'react';
import _ from 'lodash';

import AuthService from '../auth/AuthService';
import Layout from './Layout';
import Button from './Button';
import EmailLogin from './EmailLogin.js';

import styles from './css/Login.module.css';

const { Content, Header } = Layout;

class Auth0Login extends Component {
    constructor (props) {
        super(props);
        this.handleLogin = _.debounce(this.handleLogin.bind(this), 500, { leading: true, trailing: false });
    }

    handleLogin () {
        this.props.auth.login({
            connection: this.connection 
        }, function (err) {
            if (err) {
                alert('something went wrong: ' + err.message);
            }
        });
    }

    get connection () {
        return 'auth0';
    }

    render () {
        return (
            <Button onClick={this.handleLogin}>{this.props.children}</Button>
        );
    }
}

export class GoogleLogin extends Auth0Login {
    get connection () {
        return 'google-oauth2';
    }
}

export class TwitterLogin extends Auth0Login {
    get connection () {
        return 'twitter';
    }
}

class Login extends Component {
    constructor (props) {
        super(props);

        this.state = {
            showEmailLogin: false
        };

        this.handleUseEmail = this.handleUseEmail.bind(this);
        this.hideLogin = this.hideLogin.bind(this);
        this.handleEmailLoginFormSubmit = this.handleEmailLoginFormSubmit.bind(this);
    }

    emailLogin ({ email, password }) {
        this.props.auth.login({
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
            showEmailLogin: true
        });
    }

    hideLogin () {
        this.setState({
            showEmailLogin: false
        });
    }

    handleEmailLoginFormSubmit (payload) {
        this.emailLogin(payload);
    }

    renderEmailLogin () {
        return (
            <div className={styles.emailLoginWrapper}>
                <Button onClick={this.hideLogin}>Back</Button>
                <div className={styles.emailLogin}>
                    <EmailLogin
                        submitText='Login'
                        onSubmit={this.handleEmailLoginFormSubmit}
                    />
                </div>
            </div>
        )
    }

    renderButtonForm () {
        return (
            <div className={styles.btnWrapper}>
                <div>
                    <GoogleLogin auth={this.props.auth}>Login using Google</GoogleLogin>
                </div>
                <div>
                    <TwitterLogin auth={this.props.auth}>Login using Twitter</TwitterLogin>
                </div>
                <div>
                    <Button onClick={this.handleUseEmail}>Login using Email</Button>
                </div>
            </div>
        );
    }

    render () {
        const { children } = this.props;

        return (
            <Layout>
                <Header auth={this.props.auth} showHamburger={false} />
                <Content>
                    <div className={styles.wrapper}>
                        {this.state.showEmailLogin ? this.renderEmailLogin() : this.renderButtonForm()}
                    </div>
                </Content>
            </Layout>
        );
    }
}

Login.propTypes = {
    auth: React.PropTypes.instanceOf(AuthService)
}
export default Login;
