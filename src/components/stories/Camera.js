import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import Camera from '../Camera';

storiesOf('Camera', module)
  .add('Initial View', () => (
    <Camera save={action('save')} onFailure={action('Media Fail')} />
  ));
