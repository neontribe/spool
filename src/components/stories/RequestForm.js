import React from 'react';
import { storiesOf } from '@kadira/storybook';
import RequestForm from '../RequestForm';

import { auth } from './fixtures';

storiesOf('RequestForm', module)
  .add('Initial View', () => (
    <RequestForm
        route={{auth}}
    />
  ));
