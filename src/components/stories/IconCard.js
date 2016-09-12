import React from 'react';
import { storiesOf } from '@kadira/storybook';
import { IconCard } from '../IconCard';

storiesOf('IconCard', module)
  .add('Static View', () => (
      <IconCard icon="health" message="Health"/>
  ))
  .add('Checkbox View', () => (
      <IconCard icon="health" message="Health" onChange={(foo) => 'bar'} value='test'/>
  ));
