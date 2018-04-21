import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { List } from './';

Enzyme.configure({ adapter: new Adapter() });
const dummyFunc = () => null;

const list = (
  sections,
  filteredData,
  onItemClick,
  style,
  renderItem,
  height,
  selectedItem,
  selectedSection,
  renderSeparator,
  handleKeyDown,
  placeholder,
  selectable,
  scroll,
) => (
  <List
    sections={sections}
    filteredData={filteredData}
    onItemClick={onItemClick}
    style={style}
    renderItem={renderItem}
    height={height}
    selectedItem={selectedItem}
    selectedSection={selectedSection}
    renderSeparator={renderSeparator}
    handleKeyDown={handleKeyDown}
    placeholder={placeholder}
    selectable={selectable}
    scroll={scroll}
  />
);

const renderItem = x => <p>{x.item}</p>;
const renderSeparator = x => <span>{x.item}</span>;
const data = {
  group1: ['value 1', 'value 2', 'value 3', 'value 4'],
  group2: ['value 5', 'value 6', 'value 7', 'value 8'],
};

it('no sections and no data', () => {
  const lst = list(
    null,
    [],
    dummyFunc,
    null,
    renderItem,
    200,
    0,
    0,
    renderSeparator,
    dummyFunc,
    <p>placeholder</p>,
    true,
    true,
  );
  const wrapper = mount(lst);
  const placeholder = wrapper
    .find('p')
    .at(0)
    .props().children;
  expect(placeholder).toBe('placeholder');
});

it('sections and data', () => {
  const lst = list(
    data,
    [],
    dummyFunc,
    null,
    renderItem,
    200,
    0,
    0,
    renderSeparator,
    dummyFunc,
    <p>placeholder</p>,
    true,
    true,
  );
  const wrapper = mount(lst);
  const style = wrapper
    .find('div')
    .at(0)
    .props().style.maxHeight;
  const groups = wrapper.find('span').length;
  const values = wrapper.find('p').length;
  const group1 = wrapper
    .find('span')
    .at(0)
    .props().children;
  const value1 = wrapper
    .find('p')
    .at(0)
    .props().children;
  expect(style).toBe(200);
  expect(groups).toBe(2);
  expect(values).toBe(8);
  expect(group1).toBe('group1');
  expect(value1).toBe('value 1');
});

it('click on items', () => {
  const click = jest.fn();
  const lst = list(
    data,
    [],
    click,
    null,
    renderItem,
    200,
    0,
    0,
    renderSeparator,
    dummyFunc,
    <p>placeholder</p>,
    true,
    true,
  );
  const wrapper = mount(lst);
  const groups = wrapper.find('span').length;
  const values = wrapper.find('p').length;
  wrapper
    .find('div')
    .at(4)
    .simulate('mousedown');
  expect(groups).toBe(2);
  expect(values).toBe(8);
  expect(click).toHaveBeenCalled();
});
