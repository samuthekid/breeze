import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import renderFlatList from './';

Enzyme.configure({ adapter: new Adapter() });
const dummyFunc = () => null;

const flat = (
  filteredData,
  onItemClick,
  renderItem,
  selectedSection,
  selectedItem,
  sectionIndex,
  placeholder,
) => (
  <div>
    {renderFlatList({
      filteredData,
      onItemClick,
      renderItem,
      selectedSection,
      selectedItem,
      sectionIndex,
      placeholder,
    })}
  </div>
);

const renderItem = x => <p>{x.item}</p>;
const data = ['value 1', 'value 2', 'value 3', 'value 4'];

it('no data', () => {
  const list = flat([], dummyFunc, renderItem, 0, 0, 0, <p>placeholder</p>);
  const wrapper = mount(list);
  const placeholder = wrapper
    .find('p')
    .at(0)
    .props().children;
  expect(placeholder).toBe('placeholder');
});

it('normal data', () => {
  const list = flat(data, dummyFunc, renderItem, 0, 0, 0, <p>placeholder</p>);
  const wrapper = mount(list);
  const contents = wrapper.find('p').length;
  const item1 = wrapper
    .find('p')
    .at(2)
    .props().children;
  expect(contents).toBe(4);
  expect(item1).toBe('value 3');
});

it('item click', () => {
  const click = jest.fn();
  const list = flat(data, click, renderItem, 0, 0, 0, <p>placeholder</p>);
  const wrapper = mount(list);
  wrapper
    .find('div')
    .at(1)
    .simulate('mousedown');
  expect(click).toHaveBeenCalled();
});
