import React, { Component } from 'react';
import {Form, FormGroup, FormControl, ControlLabel, Button, ButtonToolbar} from 'react-bootstrap';
import AuthService from '../auth/AuthService';

class Login extends Component {

  constructor(props) {
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

  handleChange(event) {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit(event){
      event.preventDefault();
      // on form submit, sends the credentials to auth0 api
      this.props.auth.login({
        connection: 'Username-Password-Authentication',
        responseType: 'token',
        email: this.state.email,
        password: this.state.email
      }, function(err) {
        if (err) alert("something went wrong: " + err.message);
      });
  }

  signUp() {
    // calls auth0 signup api, sending new account data
    this.props.auth.signup({
      connection: 'Username-Password-Authentication',
      responseType: 'token',
      email: this.state.email,
      password: this.state.email
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
        <Form onSubmit={this.handleSubmit}>
          <FormGroup controlId="email">
            <ControlLabel>E-mail</ControlLabel>
            <FormControl type="email"
                placeholder="yours@example.com"
                required
                value={this.state.email}
                onChange={this.handleChange} />
          </FormGroup>

          <FormGroup controlId="password">
            <ControlLabel>Password</ControlLabel>
            <FormControl type="text"
                name="password"
                placeholder="Password"
                required
                value={this.state.password}
                onChange={this.handleChange} />
          </FormGroup>

          <ButtonToolbar>
            <Button type="submit" bsStyle="primary">Sign In</Button>
            <Button onClick={this.signUp}>Sign Up</Button>
            <Button bsStyle="link" onClick={this.googleLogin}>Login with Google</Button>
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

Login.defaultProps = {
    email: '',
    password: ''
}

export default Login;
