import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import RequestForm from '../RequestForm';

import { auth, topics } from './fixtures';

storiesOf('RequestForm', module)
  .add('Initial View', () => (
    <RequestForm
        route={{auth}}
        viewer={{topics}}
        router={{goBack: action('back')}}
    />
  ));
