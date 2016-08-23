import { configure } from '@kadira/storybook';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import '../src/index.css';

function loadStories() {
  require('../src/components/stories');
}

configure(loadStories, module);
