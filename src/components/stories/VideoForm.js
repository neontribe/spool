import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import VideoForm from '../VideoForm';
import { Grid, Row, Col } from 'react-bootstrap';

storiesOf('VideoForm', module)
  .add('Initial View', () => (
    <Grid>
        <Row>
            <Col>
                <VideoForm save={action('Save Video')} back={action('Back')}/>
            </Col>
        </Row>
    </Grid>
  ));
