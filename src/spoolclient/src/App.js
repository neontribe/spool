import React, { Component } from 'react';
import { Grid, Row, Col, PageHeader } from 'react-bootstrap';
import EntryForm from './components/EntryForm';

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
                    <EntryForm/>
                </Col>
            </Row>
        </Grid>
    );
  }
}

export default App;
