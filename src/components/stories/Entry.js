import React from 'react';
import { storiesOf } from '@kadira/storybook';
import { Entry } from '../Entry';
<<<<<<< HEAD
import { entries, videoEntry, videoEntryWithText } from './fixtures';
=======
import { entries } from './fixtures';
>>>>>>> design

storiesOf('Entry', module)
  .add('with text media', () => (
  	<div>
    	<Entry entry={entries[0]} />
    	<Entry entry={entries[1]} />
    </div>
<<<<<<< HEAD
  ))
  .add('with video (no text)', () => (
  	<div>
    	<Entry entry={videoEntry} />
    </div>
  ))
  .add('with video (with text)', () => (
  	<div>
    	<Entry entry={videoEntryWithText} />
    </div>
=======
>>>>>>> design
  ));
