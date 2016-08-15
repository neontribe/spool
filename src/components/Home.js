import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import AddEntryForm from './AddEntryForm';
import Timeline from './Timeline';

class Home extends Component {
    render() {
        return (
            <Grid>
                <Row>
                    <Col>
                        <AddEntryForm />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Timeline entries={[]} />
                    </Col>
                </Row>
            </Grid>
        );
    }
};

export default Home;
