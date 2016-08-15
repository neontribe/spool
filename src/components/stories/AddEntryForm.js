import React from 'react';
import { storiesOf } from '@kadira/storybook';
import AddEntryForm from '../AddEntryForm';
import { Grid, Row, Col } from 'react-bootstrap';

storiesOf('AddEntryForm', module)
  .add('Initial View', () => (
    <Grid>
        <Row>
            <Col>
                <AddEntryForm/>
            </Col>
        </Row>
    </Grid>
  ));
