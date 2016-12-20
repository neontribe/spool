import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import TextForm from '../TextForm';

storiesOf('TextForm', module)
  .add('Initial View', () => (
    <TextForm save={action('Save Value')}/>
  ))
  .add('Edit View', () => (
    <TextForm initialValue="I enjoy playing with computers" save={action('Save Value')}/>
  ));
