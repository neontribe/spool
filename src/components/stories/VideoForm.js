import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import VideoForm from '../VideoForm';
import { Grid, Row, Col } from 'react-bootstrap';

storiesOf('VideoForm', module)
  .add('Initial View', () => (
    <Grid>
        <Row>
            <Col xs={12}>
                <VideoForm save={action('Save Video')} back={action('Back')}/>
            </Col>
        </Row>
    </Grid>
  ));
