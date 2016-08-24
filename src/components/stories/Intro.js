import React from 'react';
import { storiesOf } from '@kadira/storybook';
import { Intro } from '../Intro';

storiesOf('Intro', module)
  .add('Initial View', () => (
    <Intro />
  ));
