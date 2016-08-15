import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Grid, Row, Col, PageHeader, Button } from 'react-bootstrap';

class App extends Component {

  constructor(...args) {
      super(...args);

      this.logout = this.logout.bind(this);
  }

  logout(){
    // destroys the session data
    this.props.route.auth.logout();
    // redirects to login page
    this.props.router.push('/login');
  }

  render() {
    let children = null;
    if (this.props.children) {
        children = React.cloneElement(this.props.children, {
            auth: this.props.route.auth
        });
    }
    return (
        <Grid>
            <Row>
                <Col md={12}>
                    <PageHeader>SPOOL</PageHeader>
                </Col>
            </Row>
            <Row>
                <Col md={12}>
                    { children }
                </Col>
            </Row>
            <Row>
                <Col md={12}>
                    {this.props.route.auth.loggedIn() && <Button bsStyle="link" onClick={this.logout}>Log out</Button>}
                </Col>
            </Row>
        </Grid>
    );
  }
}

export default withRouter(App);
