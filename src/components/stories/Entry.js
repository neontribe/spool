import React from 'react';
import { storiesOf } from '@kadira/storybook';
import { Entry } from '../Entry';
import { entries, videoEntry, videoEntryWithText, imageEntry, imageEntryWithText } from './fixtures';

storiesOf('Entry', module)
  .add('with text media', () => (
  	<div>
    	<Entry entry={entries[0]} />
    	<Entry entry={entries[1]} />
    </div>
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
  ))
  .add('with image (no text)', () => (
  	<div>
    	<Entry entry={imageEntry} />
    </div>
  ))
  .add('with image (with text)', () => (
  	<div>
    	<Entry entry={imageEntryWithText} />
    </div>
  ));
