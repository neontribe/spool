import { configure } from '@kadira/storybook';

import '../src/css/global.css';

function loadStories () {
	require('../src/components/stories');
}

configure(loadStories, module);
