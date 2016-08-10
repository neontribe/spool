import { configure } from '@kadira/storybook';
import '../src/index.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

function loadStories() {
  require('../src/stories');
  require('../src/components/stories');
}

configure(loadStories, module);
