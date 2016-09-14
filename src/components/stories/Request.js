import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import Request from '../Request';
import { request } from './fixtures';

storiesOf('Request', module)
  .add('Initial View', () => (
    <Request {...request}
        onAccept={action('Accepted')}
        onDeny={action('Denied')}
        onDismiss={action('Dismissed')} />
  ));
