import React from 'react';
import { storiesOf } from '@kadira/storybook';
import TopicsOverview from '../TopicsOverview';

import { topicCounts } from './fixtures';

storiesOf('TopicsOverview', module)
  .add('Initial View', () => (
    <TopicsOverview
        topics={topicCounts}
    />
  ));
