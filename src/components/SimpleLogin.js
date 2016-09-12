import React, { Component } from 'react';
import {Button, Grid, Row, Col} from 'react-bootstrap';
import AuthService from '../auth/AuthService';
import _ from 'lodash';

class SimpleLogin extends Component {

  constructor(props) {
      super(props);

      this.googleLogin = _.debounce(this.googleLogin.bind(this), 500, {leading: true, trailing: false});
      this.twitterLogin = _.debounce(this.twitterLogin.bind(this), 500, {leading: true, trailing: false});
  }

  googleLogin(){
    this.props.auth.login({
      connection: 'google-oauth2'
    }, function(err) {
      if (err) alert("something went wrong: " + err.message);
    });
  }

  twitterLogin(){
    this.props.auth.login({
      connection: 'twitter'
    }, function(err) {
      if (err) alert("something went wrong: " + err.message);
    });
  }

  render() {
    return (
      <Grid fluid>
          <Row>
              <Col xs={3}></Col>
              <Col xs={3}>
                  <Button block bsSize="large" onClick={this.googleLogin}>Login with Google</Button>
              </Col>
              <Col xs={3}></Col>
          </Row>
          <Row>
              <Col xs={3}></Col>
              <Col xs={3}>
                  <Button block bsSize="large" onClick={this.twitterLogin}>Login with Twitter</Button>
              </Col>
              <Col xs={3}></Col>
          </Row>
      </Grid>
    );
  }
}

SimpleLogin.propTypes = {
    location: React.PropTypes.object,
    auth: React.PropTypes.instanceOf(AuthService)
}

SimpleLogin.defaultProps = {
    email: '',
    password: ''
}

export default SimpleLogin;
