import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Form, FormGroup, FormControl, ControlLabel, Button, ButtonToolbar} from 'react-bootstrap';
import AuthService from '../auth/AuthService';

class Login extends Component {

  handleSubmit(event){
      event.preventDefault();
      // on form submit, sends the credentials to auth0 api
      this.props.auth.login({
        connection: 'Username-Password-Authentication',
        responseType: 'token',
        email: ReactDOM.findDOMNode(this.refs.email).value,
        password: ReactDOM.findDOMNode(this.refs.password).value
      }, function(err) {
        if (err) alert("something went wrong: " + err.message);
      });
  }

  signUp() {
    // calls auth0 signup api, sending new account data
    this.props.auth.signup({
      connection: 'Username-Password-Authentication',
      responseType: 'token',
      email: ReactDOM.findDOMNode(this.refs.email).value,
      password: ReactDOM.findDOMNode(this.refs.password).value
    }, function(err) {
      if (err) alert("something went wrong: " + err.message);
    });
  }

  googleLogin(){
    this.props.auth.login({
      connection: 'google-oauth2'
    }, function(err) {
      if (err) alert("something went wrong: " + err.message);
    });
  }

  render() {
    return (
      <div>
        <h2>Login</h2>
        <Form onSubmit={this.handleSubmit.bind(this)}>
          <FormGroup controlId="email">
            <ControlLabel>E-mail</ControlLabel>
            <FormControl type="email" ref="email" placeholder="yours@example.com" required />
          </FormGroup>

          <FormGroup controlId="password">
            <ControlLabel>Password</ControlLabel>
            <FormControl type="password" ref="password" placeholder="Password" required />
          </FormGroup>

          <ButtonToolbar>
            <Button type="submit" bsStyle="primary">Sign In</Button>
            <Button onClick={this.signUp.bind(this)}>Sign Up</Button>
            <Button bsStyle="link" onClick={this.googleLogin.bind(this)}>Login with Google</Button>
          </ButtonToolbar>
        </Form>
      </div>
  );
  }
}

Login.propTypes = {
    location: React.PropTypes.object,
    auth: React.PropTypes.instanceOf(AuthService)
}

export default Login;
