import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import Camera from '../Camera';
import { Grid, Row, Col } from 'react-bootstrap';

storiesOf('Camera', module)
  .add('Initial View', () => (
    <Grid>
        <Row>
            <Col>
                <Camera save={action('save')} onFailure={action('Media Fail')}/>
            </Col>
        </Row>
    </Grid>
  ));
