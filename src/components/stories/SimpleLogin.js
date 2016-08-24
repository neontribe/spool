import React from 'react';
import { storiesOf } from '@kadira/storybook';
import SimpleLogin from '../SimpleLogin';

storiesOf('SimpleLogin', module)
  .add('SimpleLogin', () => (
  	<SimpleLogin />
  ));
