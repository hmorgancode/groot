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
