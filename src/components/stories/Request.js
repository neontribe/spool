import React from 'react';
import { storiesOf } from '@kadira/storybook';
import Request from '../Request';
import { request } from './fixtures';

storiesOf('Request', module)
  .add('Creator View', () => (
    <Request {...request} />
  ))
  .add('No Mutation', () => (
      <Request {...request} allowMutation={false} />
  ));
