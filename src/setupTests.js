import React from 'react';
import Enzyme, { shallow, render, mount } from 'enzyme';
import sinon from 'sinon';
import Adapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';
import faker from 'faker';

Enzyme.configure({ adapter: new Adapter() });

global.shallow = shallow;
global.render = render;
global.mount = mount;
global.toJson = toJson;
global.sinon = sinon;
global.faker = faker;
global.factory = (Component, props) => <Component {...props} />;
global.dummyFunc = () => null;
global.dummyAction = { type: 'ACTION/DUMMY', payload: {} };

// eslint-disable-next-line
console.error = (message) => {
  throw new Error(message);
};

