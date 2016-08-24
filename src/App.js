import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Grid, Row, Col, PageHeader, Button } from 'react-bootstrap';
import ProfileLink from './components/ProfileLink';

class App extends Component {

  constructor(props, context) {
      super(props, context);

      this.state = {
          profile: props.route.auth.getProfile()
      };

      props.route.auth.on('profile_updated', (newProfile) => {
        this.setState({ profile: newProfile });
      });

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
                <Col xs={12}>
                    <div className='page-header'>
                      <h1>SPOOL</h1>
                      <div className='profile'>
                        <ProfileLink profile={this.state.profile} disabled={!this.props.route.auth.loggedIn()}/>
                        {this.props.route.auth.loggedIn() && <a href="javascript:;" className='logout' onClick={this.logout}>Log out</a>}
                      </div>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col xs={12}>
                    { children }
                </Col>
            </Row>
        </Grid>
    );
  }
}

export default withRouter(App);
