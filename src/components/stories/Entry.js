import React from 'react';
import { storiesOf } from '@kadira/storybook';
import Entry from '../Entry';

const textEntry = {
    media: {
        type: "text",
        content: "Riding on the front seat at the top!"
    },
    author: "Fernando",
    owner: "Fernando",
    sentiment: "happy",
    topic: ['Public Transport']
};

storiesOf('Entry', module)
  .add('with text media', () => (
    <Entry {...textEntry} />
  ));
