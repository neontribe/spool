import React from 'react';
import { storiesOf } from '@kadira/storybook';
import EntryViewer from '../EntryViewer';
import { entries, videoEntry, videoEntryWithText } from './fixtures';

storiesOf('EntryViewer', module)
  .add('with text media', () => (
    <div>
      <EntryViewer entry={entries[0]} />
    </div>
  ))
  .add('with video (no text)', () => (
    <div>
      <EntryViewer entry={videoEntry} />
    </div>
  ))
  .add('with video (with text)', () => (
    <div>
      <EntryViewer entry={videoEntryWithText} />
    </div>
  ));
