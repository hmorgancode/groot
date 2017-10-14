import React from 'react';
import { shallow } from 'enzyme';
import { ModalConductorWithoutState as ModalConductor } from './ModalConductor';

test('Render', () => {
  shallow(<ModalConductor />);
});

test('renders null when no modal is active', () => {
  const conductor = shallow(<ModalConductor isActive="false" />);
  expect(conductor.html()).toBe(null);
});

test('renders the provided modal', () => {
  let conductor = shallow(<ModalConductor isActive="true" modalType="ADD_PLANT" />);
  expect(conductor.exists('#js-conductor-add-plant')).toBe(true);
  conductor = shallow(<ModalConductor isActive="true" modalType="ADD_BOARD" />);
  expect(conductor.exists('#js-conductor-add-board')).toBe(true);
});
