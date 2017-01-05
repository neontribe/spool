import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import SentimentForm from '../SentimentForm';

storiesOf('SentimentForm', module)
  .add('Initial View', () => (
    <SentimentForm save={action('Save Value')} />
  ))
  .add('Edit View', () => (
    <SentimentForm initialValue="happy" save={action('Save Value')} />
  ));
