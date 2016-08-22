import React from 'react';
import { storiesOf } from '@kadira/storybook';
import { Timeline } from '../Timeline';
import { entries } from './fixtures';

const initialData = {
    entries: {
        edges: []
    }
}

const entriesData = {
    entries: {
        edges: entries.map((e) => {return {node:e}})
    }
}

storiesOf('Timeline', module)
  .add('Initial View', () => (
    <Timeline viewer={initialData} />
  ))
  .add('With entries', () => (
    <Timeline viewer={entriesData} />
  ));
