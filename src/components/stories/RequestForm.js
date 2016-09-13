import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import RequestForm from '../RequestForm';

import { googleProfile } from './fixtures';

storiesOf('RequestForm', module)
  .add('Initial View', () => (
    <RequestForm
        show={true}
        cancel={action('cancel')}
        issuerProfile={googleProfile}
        topic="transport"
    />
  ));
