import React from 'react';
import { storiesOf } from '@kadira/storybook';
import { Timeline } from '../Timeline';
import { entries } from './fixtures';

const initialData = {
    role: {
        entries: {
            edges: []
        },
    }
}

const entriesData = {
    role: {
        entries: {
            edges: entries.map((e) => {return {node:e}})
        },
    }
}

storiesOf('Timeline', module)
  .add('Initial View', () => (
    <Timeline viewer={initialData} />
  ))
  .add('With entries', () => (
    <Timeline viewer={entriesData} />
  ));
