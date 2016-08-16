import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import MediaForm from '../MediaForm';
import { Grid, Row, Col } from 'react-bootstrap';

storiesOf('MediaForm', module)
  .add('Initial View', () => (
    <Grid>
        <Row>
            <Col>
                <MediaForm save={action('Save Value')}/>
            </Col>
        </Row>
    </Grid>
  ));
