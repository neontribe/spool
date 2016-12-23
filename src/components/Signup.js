import React, { Component } from 'react';
import _ from 'lodash';

import AuthService from '../auth/AuthService';
import Layout from './Layout';
import Button from './Button';

import styles from './css/Login.module.css';

const { Content } = Layout;

class EmailLoginForm extends Component {
    constructor (props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        const changed = false;
        this.state = {
            email: {
                value: '',
                changed
            },
            password: {
                value: '',
                changed
            }
        };
        this.handleChanges = {
            email: _.partial(this.handleChange, 'email'),
            password: _.partial(this.handleChange, 'password'),
        }
    }

    handleSubmit(evt) {
        evt.preventDefault();
        const { email, password } = this.state;
        this.props.onSubmit({
            email: email.value,
            password: password.value
        });
    }

    errors () {
        var errors = {};
        const { email, password } = this.state;
        if (!email.value && email.changed) {
            errors['email'] = 'Your password is required';
        }

        if (!password.value && password.changed) {
            errors['password'] = 'Your password is required';
        }

        return Object.keys(errors).length ? errors : false;
    }

    handleChange (key, event) {
        const { value } = event.target;
        this.setState({[key]: { value, changed: true }});
    }

    render() {
        const { email, password } = this.state;
        return (
        <div className={styles.wrapper}>
            <form>
                <label>
                    Email Address
                    <input type='email' onChange={this.handleChanges.email} value={email.value}/>
                </label>
                <label>
                    Password
                    <input type='password' onChange={this.handleChanges.password} value={password.value}/>
                </label>
                <Button onClick={this.handleSubmit}>Login</Button>
            </form>
        </div>
        );
    }
}

class Signup extends Component {
    constructor (props) {
        super(props);

        this.state = {
            emailLogin: false
        };

        this.googleLogin = _.debounce(this.googleLogin.bind(this), 500, { leading: true, trailing: false });
        this.twitterLogin = _.debounce(this.twitterLogin.bind(this), 500, { leading: true, trailing: false });
        this.handleUseEmail = this.handleUseEmail.bind(this);
        this.handleEmailLoginFormSubmit = this.handleEmailLoginFormSubmit.bind(this);
    }

    googleLogin () {
        this.props.auth.login({
            connection: 'google-oauth2'
        }, function (err) {
            if (err) {
                alert('something went wrong: ' + err.message);
            }
        });
    }

    twitterLogin () {
        this.props.auth.login({
            connection: 'twitter'
        }, function (err) {
            if (err) {
                alert('something went wrong: ' + err.message);
            }
        });
    }

    emailLogin () {
        this.props.auth.login({
            connection: 'foo-bar',
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

    handleEmailLoginFormSubmit (payload) {
        console.log(payload);
        //this.emailLogin(payload);
    }

    renderEmailLogin() {
        if(!this.state.emailLogin) {
            return null;
        }
        return (
            <div>
                <EmailLoginForm onChange={this.handleEmailLoginFormChange} />
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
                            <Button onClick={this.googleLogin}>Signup using Google</Button>
                            <Button onClick={this.twitterLogin}>Signup using Twitter</Button>
                            <Button onClick={this.handleUseEmail}>Signup using Email</Button>
                        </div>
                    </div>
                    { this.renderEmailSignup() }
                </Content>
            </Layout>
        );
    }
}

Login.propTypes = {
    auth: React.PropTypes.instanceOf(AuthService)
}
export default Login;
