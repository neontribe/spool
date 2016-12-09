import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import ImageForm from '../ImageForm';

storiesOf('ImageForm', module)
  .add('Initial View', () => (
    <ImageForm save={action('Save Image')} back={action('Back')}/>
  ));
