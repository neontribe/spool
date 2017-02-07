import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import IconChooser from '../IconChooser';

import { topics } from './fixtures';

storiesOf('IconChooser', module)
  .add('Initial View', () => (
    <IconChooser
      choices={topics}
      onChange={action('onChange')}/>
  ))
  .add('Edit View', () => (
    <IconChooser
      choices={topics}
      initialValue={['transport']}
      onChange={action('onChange')}/>
  ))
  .add('Limit maxSelections', () => (
    <IconChooser
      maxSelections={1}
      choices={topics}
      initialValue={['public_transport']}
      onChange={action('onChange')}/>
  ));
