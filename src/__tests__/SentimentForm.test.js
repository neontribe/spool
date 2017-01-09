import React from 'react';
import { shallow } from 'enzyme';

import SentimentForm from '../components/SentimentForm';

describe('<SentimentForm />', () => {
    it('should contain two options', () => {
        const wrapper = shallow(
        	<SentimentForm save={Function.prototype} />
        );

        expect(wrapper.find('button').length).toEqual(2);
    });
});
