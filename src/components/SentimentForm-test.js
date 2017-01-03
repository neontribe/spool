import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import SentimentForm from './SentimentForm';

const save = function () {};

describe('<SentimentForm />', () => {
    it('should contain two images', () => {
        const wrapper = shallow(<SentimentForm save={save} />);
        expect(wrapper.find('Image').length).to.equal(2);
    });
});
