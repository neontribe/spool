import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import AddControls from '../AddControls';

storiesOf('AddControls', module)
  .add('Just Next', () => (
    <AddControls
        onNext={action('Next')}/>
   )).add('Next Disabled', () => (
     <AddControls
        disableNext={true}
        onNext={action('Next')}/>
  )).add('With Back', () => (
    <AddControls
        onNext={action('Next')}
        onBack={action('Back')}/>
)).add('With Quit', () => (
    <AddControls
        onNext={action('Next')}
        onBack={action('Back')}
        onQuit={action('Quit')}/>
)).add('All Disabled', () => (
    <AddControls
        onNext={action('Next')}
        onBack={action('Back')}
        onQuit={action('Quit')}
        disableNext={true}
        disableBack={true}
        disableQuit={true}/>
  ));
