import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import TextForm from '../TextForm';
import { Grid, Row, Col } from 'react-bootstrap';

storiesOf('TextForm', module)
  .add('Initial View', () => (
    <Grid>
        <Row>
            <Col>
                <TextForm save={action('Save Value')}/>
            </Col>
        </Row>
    </Grid>
  ))
  .add('Edit View', () => (
    <Grid>
        <Row>
            <Col>
                <TextForm initialValue="I enjoy playing with computers" save={action('Save Value')}/>
            </Col>
        </Row>
    </Grid>
  ));
