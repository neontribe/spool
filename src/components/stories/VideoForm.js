import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import VideoForm from '../VideoForm';

storiesOf('VideoForm', module)
  .add('Initial View', () => (
	<VideoForm save={action('Save Video')} back={action('Back')}/>
  ));
