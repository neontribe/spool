import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import EntryForm from '../EntryForm';
import { Grid, Row, Col } from 'react-bootstrap';

storiesOf('EntryForm', module)
  .add('Initial View', () => (
    <Grid>
        <Row>
            <Col>
                <EntryForm done={action('Done')}/>
            </Col>
        </Row>
    </Grid>
  ));
