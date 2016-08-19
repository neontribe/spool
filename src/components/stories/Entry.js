import React from 'react';
import { storiesOf } from '@kadira/storybook';
import { Entry } from '../Entry';
import { textEntry } from './fixtures';

storiesOf('Entry', module)
  .add('with text media', () => (
    <Entry {...textEntry} />
  ));
