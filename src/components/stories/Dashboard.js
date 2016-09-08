import React from 'react';
import { storiesOf } from '@kadira/storybook';
import Dashboard from '../Dashboard';

storiesOf('Dashboard', module)
    .add('initial view', () => (
        <Dashboard />
    ));
