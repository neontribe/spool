import React from 'react';
import SentimentForm from './SentimentForm';
import { shallow } from 'enzyme';
import { expect } from 'chai';

const save = function(){};

describe('<SentimentForm />', () => {
    it('should contain three buttons', () => {
        const wrapper = shallow(<SentimentForm save={save}/>);
        expect(wrapper.find('Button').length).to.equal(3);
    });
});
