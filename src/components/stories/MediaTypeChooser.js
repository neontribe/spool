import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import MediaTypeChooser from '../MediaTypeChooser';
import { Grid, Row, Col } from 'react-bootstrap';

storiesOf('MediaTypeChooser', module)
  .add('Initial View', () => (
    <Grid>
        <Row>
            <Col>
                <MediaTypeChooser save={action('Save Value')}/>
            </Col>
        </Row>
    </Grid>
  ));
