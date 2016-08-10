import React from 'react';
import { storiesOf } from '@kadira/storybook';
import EntryForm from '../EntryForm';
import { Grid, Row, Col } from 'react-bootstrap';

storiesOf('EntryForm', module)
  .add('Initial View', () => (
    <Grid>
        <Row>
            <Col>
                <EntryForm />
            </Col>
        </Row>
    </Grid>
  ));
