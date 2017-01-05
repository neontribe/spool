import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import TopicForm from '../TopicForm';

import {topics} from './fixtures';

storiesOf('TopicForm', module)
  .add('Initial View', () => (
    <TopicForm topics={topics} save={action('Save Value')}/>
  ))
  .add('Edit View', () => (
    <TopicForm topics={topics} initialValue={["transport"]} save={action('Save Value')}/>
  ));
