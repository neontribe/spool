import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import EntryForm from '../EntryForm';
import { Grid, Row, Col } from 'react-bootstrap';
import { textEntry } from './fixtures';

storiesOf('EntryForm', module)
  .add('Initial View', () => (
    <Grid>
        <Row>
            <Col>
                <EntryForm done={action('Done')}/>
            </Col>
        </Row>
    </Grid>
  ))
  .add('Edit Test entry View', () => (
    <Grid>
        <Row>
            <Col>
                <EntryForm entry={textEntry}
                        done={action('Done')}/>
            </Col>
        </Row>
    </Grid>
  ));
