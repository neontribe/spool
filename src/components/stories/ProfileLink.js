import React from 'react';
import { storiesOf } from '@kadira/storybook';
import ProfileLink from '../ProfileLink';
import { googleProfile } from './fixtures';

storiesOf('ProfileLink', module)
  .add('with example profile', () => (
    <ProfileLink profile={googleProfile} />
  ))
  .add('with null profile', () => (
    <ProfileLink profile={null} />
  ));
