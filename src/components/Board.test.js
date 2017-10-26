import React from 'react';
import { shallow } from 'enzyme';
import { BoardWithoutState as Board } from './Board';

const testData = {
  _id: 'testId',
  location: 'testLocation',
  sensors: []
};

test('render', () => {
  shallow(<Board {...testData} />);
});

test('expands board when clicked', () => {
  const board = shallow(<Board {...testData} />);
  expect(board.state().expanded).toBe(false);
  board.find('.js-board').simulate('click');
  expect(board.state().expanded).toBe(true);
});

test('displays Edit button when in edit mode', () => {
  const board = shallow(<Board {...testData} isEditing={false} />);
  expect(board.find('.js-edit-board').length).toBe(0);
  board.setProps({ isEditing: true });
  expect(board.find('.js-edit-board').length).toBe(1);
});

test('clicking edit button opens Edit modal with board id', () => {
  const spy = jest.fn();
  const board = shallow(<Board {...testData} isEditing={true} openEditModal={spy} />);
  board.find('.js-edit-board').simulate('click');
  expect(spy).toHaveBeenCalled();
  expect(spy.mock.calls[0][0]).toBe(testData._id);
});
