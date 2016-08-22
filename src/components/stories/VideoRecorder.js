import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import VideoRecorder from '../VideoRecorder';
import { Grid, Row, Col } from 'react-bootstrap';

storiesOf('VideoRecorder', module)
  .add('Initial View', () => (
    <Grid>
        <Row>
            <Col>
                <VideoRecorder save={action('save')} onFailure={action('Media Fail')}/>
            </Col>
        </Row>
    </Grid>
  ));
