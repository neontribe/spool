import React, { Component } from 'react';
import { withRouter } from 'react-router';
import _ from 'lodash';

import AuthService from '../auth/AuthService';
import Layout from './Layout';
import Button from './Button';
import EmailLogin from './EmailLogin.js';
import { GoogleLogin, FacebookLogin } from './Login.js';

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
        this.handleBackToWelcome = this.handleBackToWelcome.bind(this);
    }

    emailSignup ({ email, password }) {
        this.props.auth.emailSignup({
            connection: 'Username-Password-Authentication',
            email,
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

    handleBackToWelcome () {
        this.props.router.push('/login');
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
                    <FacebookLogin auth={this.props.auth}>Signup using Facebook</FacebookLogin>
                </div>
                <div>
                    <Button onClick={this.handleUseEmail}>Signup using Email</Button>
                </div>
                <div>
                    <Button onClick={this.handleBackToWelcome}>Back</Button>
                </div>
            </div>
        );
    }

    render () {
        return (
            <Layout>
                <Header auth={this.props.auth} showHamburger={false} user={null}/>
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

export default withRouter(Signup);
