import React, { Component } from 'react';
import { Grid, Row, Col, PageHeader } from 'react-bootstrap';

class App extends Component {

  render() {
    return (
        <Grid>
            <Row>
                <Col md={12}>
                    <PageHeader>SPOOL</PageHeader>
                </Col>
            </Row>
            <Row>
                <Col md={12}>
                    { this.props.children }
                </Col>
            </Row>
        </Grid>
    );
  }
}

export default App;
