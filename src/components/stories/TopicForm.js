import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import TopicForm from '../TopicForm';
import { Grid, Row, Col } from 'react-bootstrap';

storiesOf('TopicForm', module)
  .add('Initial View', () => (
    <Grid>
        <Row>
            <Col>
                <TopicForm save={action('Save Value')}/>
            </Col>
        </Row>
    </Grid>
  ))
  .add('Edit View', () => (
    <Grid>
        <Row>
            <Col>
                <TopicForm initialValue="sport" save={action('Save Value')}/>
            </Col>
        </Row>
    </Grid>
  ));
