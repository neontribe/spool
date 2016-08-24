import React from 'react';
import { storiesOf } from '@kadira/storybook';
import { AddEntryForm } from '../AddEntryForm';
import { Grid, Row, Col } from 'react-bootstrap';

storiesOf('AddEntryForm', module)
  .add('Initial View', () => (
    <Grid>
        <Row>
            <Col xs={12}>
                <AddEntryForm/>
            </Col>
        </Row>
    </Grid>
  ));
