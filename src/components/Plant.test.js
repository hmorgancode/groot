import React from 'react';
import { shallow } from 'enzyme';
import { PlantWithoutState as Plant } from './Plant';

const testData = {
  _id: 'testId',
  name: 'testName',
  board: { _id: 'testBoardId' },
  tags: []
};

test('render', () => {
  shallow(<Plant {...testData} />);
});

test('expands plant when clicked', () => {
  const plant = shallow(<Plant {...testData} />);
  expect(plant.state().expanded).toBe(false);
  plant.find('.js-plant').simulate('click');
  expect(plant.state().expanded).toBe(true);
});

test('displays Edit button when in edit mode', () => {
  const plant = shallow(<Plant {...testData} isEditing={false} />);
  expect(plant.find('.js-edit-plant').length).toBe(0);
  plant.setProps({ isEditing: true });
  expect(plant.find('.js-edit-plant').length).toBe(1);
});

test('clicking edit button opens Edit modal with plant id', () => {
  const spy = jest.fn();
  const plant = shallow(<Plant {...testData} isEditing={true} openEditModal={spy} />);
  plant.find('.js-edit-plant').simulate('click');
  expect(spy).toHaveBeenCalled();
  expect(spy.mock.calls[0][0]).toBe(testData._id);
});
