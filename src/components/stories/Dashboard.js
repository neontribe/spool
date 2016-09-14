import React from 'react';
import { storiesOf } from '@kadira/storybook';
import { Dashboard } from '../Dashboard';
import { auth, dashboardViewer } from './fixtures';

storiesOf('Dashboard', module)
  .add('Initial View', () => (
    <Dashboard viewer={dashboardViewer} route={{auth}}/>
  ));
