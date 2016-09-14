import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import TopicForm from '../TopicForm';
import { Grid, Row, Col } from 'react-bootstrap';

import {topics} from './fixtures';

storiesOf('TopicForm', module)
  .add('Initial View', () => (
    <Grid>
        <Row>
            <Col xs={12}>
                <TopicForm topics={topics} save={action('Save Value')}/>
            </Col>
        </Row>
    </Grid>
  ))
  .add('Edit View', () => (
    <Grid>
        <Row>
            <Col xs={12}>
                <TopicForm topics={topics} initialValue={["transport"]} save={action('Save Value')}/>
            </Col>
        </Row>
    </Grid>
  ));
