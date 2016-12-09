import React, { Component } from 'react';

import AuthService from '../auth/AuthService';

import controls from '../css/Controls.module.css';

class Login extends Component {
  constructor (props) {
    super(props);

    this.state = {
        email: props.email,
        password: props.password
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.signUp = this.signUp.bind(this);
    this.googleLogin = this.googleLogin.bind(this);
  }

  handleChange (event) {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit (event) {
    event.preventDefault();

    // on form submit, sends the credentials to auth0 api
    this.props.auth.login({
      connection: 'Username-Password-Authentication',
      responseType: 'token',
      email: this.state.email,
      password: this.state.email
    }, function (err) {
      if (err) {
        alert('something went wrong: ' + err.message);
      }
    });
  }

  signUp () {
    // calls auth0 signup api, sending new account data
    this.props.auth.signup({
      connection: 'Username-Password-Authentication',
      responseType: 'token',
      email: this.state.email,
      password: this.state.email
    }, function (err) {
      if (err) {
        alert('something went wrong: ' + err.message);
      }
    });
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

  render () {
    return (
      <div>
        <h2>Login</h2>

        <form onSubmit={this.handleSubmit}>
          <div>
            {/*<ControlLabel>E-mail</ControlLabel>*/}
            <h3>E-mail</h3>
            <input
              type='email'
              placeholder='yours@example.com'
              required={true}
              value={this.state.email}
              onChange={this.handleChange}
            />
          </div>

          <div>
            {/*<ControlLabel>Password</ControlLabel>*/}
            <h3>Password</h3>
            <input
              type='text'
              name='password'
              placeholder='Password'
              required={true}
              value={this.state.password}
              onChange={this.handleChange}
            />
          </div>

          <div>
            <button className={controls.btnRaised} type='submit'>Sign In</button>
            <button className={controls.btnRaised} onClick={this.signUp}>Sign Up</button>
            <button className={controls.btnRaised} onClick={this.googleLogin}>Login with Google</button>
          </div>
        </form>
      </div>
  );
  }
}

Login.propTypes = {
  location: React.PropTypes.object,
  auth: React.PropTypes.instanceOf(AuthService)
}

Login.defaultProps = {
  email: '',
  password: ''
}

export default Login;
