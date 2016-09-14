import React from 'react';
import { storiesOf } from '@kadira/storybook';
import { Timeline } from '../Timeline';
import { entries, request } from './fixtures';

const initialData = {
    role: {
        entries: {
            edges: []
        },
        requests: {
            edges: []
        }
    }
}

const entriesData = {
    role: {
        entries: {
            edges: entries.map((e) => {return {node:e}})
        },
        requests: {
            edges: []
        }
    }
}

const entriesWithRequest = {
    role: {
        entries: {
            edges: entries.map((e) => {return {node:e}})
        },
        requests: {
            edges: [{node: request}]
        }
    }
}

storiesOf('Timeline', module)
  .add('Initial View', () => (
    <Timeline viewer={initialData} />
  ))
  .add('With entries', () => (
    <Timeline viewer={entriesData} />
  ))
  .add('With single request', () => (
    <Timeline viewer={entriesWithRequest} />
  ));
