import React from 'react';
import { storiesOf } from '@kadira/storybook';
import Timeline from '../Timeline';

const entries = [
    {
        media: {
            type: "text",
            content: "Riding on the front seat at the top!"
        },
        author: "Fernando",
        owner: "Fernando",
        sentiment: "happy",
        topic: ['Public Transport']
    },
    {
        media: {
            type: "text",
            content: "Queuing for a bus in the rain."
        },
        author: "Fernando",
        owner: "Fernando",
        sentiment: "sad",
        topic: ['Public Transport']
    },
    {
        media: {
            type: "text",
            content: "Football training with friends"
        },
        author: "Fernando",
        owner: "Fernando",
        sentiment: "happy",
        topic: ['Sport']
    },
];

storiesOf('Timeline', module)
  .add('Initial View', () => (
    <Timeline entries={[]} />
  ))
  .add('With entries', () => (
    <Timeline entries={entries} />
  ));
