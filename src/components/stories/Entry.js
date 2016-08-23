import React from 'react';
import { storiesOf } from '@kadira/storybook';
import { Entry } from '../Entry';
import { entries } from './fixtures';

storiesOf('Entry', module)
  .add('with text media', () => (
  	<div>
    	<Entry entry={entries[0]} />
    	<Entry entry={entries[1]} />
    </div>
  ));
