import React from 'react';
import { storiesOf } from '@kadira/storybook';
import { Dashboard } from '../Dashboard';

const viewer = {
    role: {
        creatorActivityCount: {
            active: 10,
            stale: 3
        }
    }
};

storiesOf('Dashboard', module)
  .add('Initial View', () => (
    <Dashboard viewer={viewer}/>
  ));
