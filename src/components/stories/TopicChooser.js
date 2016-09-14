import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import TopicChooser from '../TopicChooser';
import { Grid, Row, Col } from 'react-bootstrap';

import {topics} from './fixtures';

storiesOf('TopicChooser', module)
  .add('Initial View', () => (
    <Grid>
        <Row>
            <Col xs={12}>
                <TopicChooser
                  topics={topics}
                  onChange={action('onChange')}/>
            </Col>
        </Row>
    </Grid>
  ))
  .add('Edit View', () => (
    <Grid>
        <Row>
            <Col xs={12}>
                <TopicChooser
                  topics={topics}
                  initialValue={["transport"]}
                  onChange={action('onChange')}/>
            </Col>
        </Row>
    </Grid>
  ))
  .add('Limit maxSelections', () => (
      <Grid>
        <Row>
            <Col xs={12}>
                <TopicChooser
                  maxSelections={1}
                  topics={topics}
                  initialValue={["public_transport"]}
                  onChange={action('onChange')}/>
            </Col>
        </Row>
    </Grid>
  ));
