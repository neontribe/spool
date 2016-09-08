import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import AddEntryControls from '../AddEntryControls';

storiesOf('AddEntryControls', module)
  .add('Just Next', () => (
    <AddEntryControls
        onNext={action('Next')}/>
   )).add('Next Disabled', () => (
     <AddEntryControls
        disableNext={true}
        onNext={action('Next')}/>
  )).add('With Back', () => (
    <AddEntryControls
        onNext={action('Next')}
        onBack={action('Back')}/>
)).add('With Quit', () => (
    <AddEntryControls
        onNext={action('Next')}
        onBack={action('Back')}
        onQuit={action('Quit')}/>
)).add('All Disabled', () => (
    <AddEntryControls
        onNext={action('Next')}
        onBack={action('Back')}
        onQuit={action('Quit')}
        disableNext={true}
        disableBack={true}
        disableQuit={true}/>
  ));
