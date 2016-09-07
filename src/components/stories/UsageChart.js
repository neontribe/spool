import React from 'react';
import { storiesOf } from '@kadira/storybook';
import { UsageChart } from '../UsageChart';

storiesOf('UsageChart', module)
  .add('Initial View', () => (
    <UsageChart />
  ));
