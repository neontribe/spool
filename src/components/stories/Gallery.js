import React from 'react';
import { storiesOf } from '@kadira/storybook';
import { Gallery } from '../Gallery';
import { entries } from './fixtures';

const initialData = {
    role: {
        entries: {
            edges: []
        }
    }
};

const entriesData = {
    role: {
        entries: {
            edges: entries.map((e) => { return {node: e}; })
        }
    }
};

storiesOf('Gallery', module)
  .add('Initial View', () => (
    <Gallery viewer={initialData} />
  ))
  .add('With entries', () => (
    <Gallery viewer={entriesData} />
  ));
