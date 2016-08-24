import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import SentimentForm from '../SentimentForm';
import { Grid, Row, Col } from 'react-bootstrap';

storiesOf('SentimentForm', module)
  .add('Initial View', () => (
    <Grid>
        <Row>
            <Col xs={12}>
                <SentimentForm save={action('Save Value')} />
            </Col>
        </Row>
    </Grid>
  ))
  .add('Edit View', () => (
    <Grid>
        <Row>
            <Col xs={12}>
                <SentimentForm initialValue="happy" save={action('Save Value')} />
            </Col>
        </Row>
    </Grid>
  ));
