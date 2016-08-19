import React from 'react';
import SentimentForm from './SentimentForm';
import { shallow } from 'enzyme';
import { expect } from 'chai';

const save = function(){};

describe('<SentimentForm />', () => {
    it('should contain two images', () => {
        const wrapper = shallow(<SentimentForm save={save}/>);
        expect(wrapper.find('Image').length).to.equal(2);
    });
});
