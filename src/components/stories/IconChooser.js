import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import IconChooser from '../IconChooser';
import { Grid, Row, Col } from 'react-bootstrap';

import {topics} from './fixtures';

storiesOf('IconChooser', module)
  .add('Initial View', () => (
    <Grid>
        <Row>
            <Col xs={12}>
                <IconChooser
                  choices={topics}
                  onChange={action('onChange')}/>
            </Col>
        </Row>
    </Grid>
  ))
  .add('Edit View', () => (
    <Grid>
        <Row>
            <Col xs={12}>
                <IconChooser
                  choices={topics}
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
                <IconChooser
                  maxSelections={1}
                  choices={topics}
                  initialValue={["public_transport"]}
                  onChange={action('onChange')}/>
            </Col>
        </Row>
    </Grid>
  ));
