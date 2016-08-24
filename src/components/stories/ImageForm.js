import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import ImageForm from '../ImageForm';
import { Grid, Row, Col } from 'react-bootstrap';

storiesOf('ImageForm', module)
  .add('Initial View', () => (
    <Grid>
        <Row>
            <Col>
                <ImageForm save={action('Save Image')} back={action('Back')}/>
            </Col>
        </Row>
    </Grid>
  ));
