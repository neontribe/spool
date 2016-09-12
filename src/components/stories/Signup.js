import React from 'react';
import { storiesOf } from '@kadira/storybook';
import { Signup } from '../Signup';

const initial = {
    viewer: {
        region: null,
        role: {
            __typename: 'Missing'
        }
    },
    meta: {
        regions: ['Liverpool', 'South Shields']
    }
};


storiesOf('Signup', module)
    .add('initial view', () => (
        <Signup meta={initial.meta} viewer={initial.viewer}/>
    ));
