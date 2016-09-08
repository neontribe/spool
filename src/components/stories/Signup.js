import React from 'react';
import { storiesOf } from '@kadira/storybook';
import Signup from '../Signup';

storiesOf('Signup', module)
    .add('initial view', () => (
        <Signup />
    ));
