import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import VideoForm from '../VideoForm';
import { Grid, Row, Col } from 'react-bootstrap';

storiesOf('VideoForm', module)
  .add('Initial View', () => (
    <Grid>
        <Row>
            <Col>
<<<<<<< HEAD
                <VideoForm save={action('Save Video')} back={action('Back')}/>
=======
                <VideoForm save={action('Save Video')}/>
>>>>>>> master
            </Col>
        </Row>
    </Grid>
  ));
