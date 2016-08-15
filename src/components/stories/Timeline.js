import React from 'react';
import { storiesOf } from '@kadira/storybook';
import Timeline from '../Timeline';
import { entries } from './fixtures';

storiesOf('Timeline', module)
  .add('Initial View', () => (
    <Timeline entries={[]} />
  ))
  .add('With entries', () => (
    <Timeline entries={entries} />
  ));
