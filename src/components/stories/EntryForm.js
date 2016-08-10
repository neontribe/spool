import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import EntryForm from '../EntryForm';
import { Grid, Row, Col } from 'react-bootstrap';

storiesOf('EntryForm', module)
  .add('Initial View', () => (
    <Grid>
        <Row>
            <Col>
                <EntryForm done={action('Done')}/>
            </Col>
        </Row>
    </Grid>
  ))
  .add('Edit View', () => (
    <Grid>
        <Row>
            <Col>
                <EntryForm entry={{
                        media: 'test',
                        sentiment: 'happy',
                        topic: 'sport'}}
                        done={action('Done')}/>
            </Col>
        </Row>
    </Grid>
  ));
