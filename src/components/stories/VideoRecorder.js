import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import VideoRecorder from '../VideoRecorder';

storiesOf('VideoRecorder', module)
  .add('Initial View', () => (
    <VideoRecorder save={action('save')} onFailure={action('Media Fail')}/>
  ));
