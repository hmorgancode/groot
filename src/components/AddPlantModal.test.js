import React from 'react';
import { shallow } from 'enzyme';
// import MockAdapter from 'axios-mock-adapter';
import { AddPlantModalWithoutState as AddPlantModal } from './AddPlantModal';

it('renders', () => {
  shallow(<AddPlantModal />);
});

it('closes when the close button or outside of modal are clicked', () => {
  const mockClose = jest.fn();
  const modal = shallow(<AddPlantModal handleCloseModal={mockClose} />);
  modal.find('.js-close-modal').simulate('click');
  modal.find('.js-modal-background').simulate('click');
  expect(mockClose.mock.calls.length).toBe(2);
});

it('keeps text input in state', () => {
  const modal = shallow(<AddPlantModal />);
  modal.find('.js-name').simulate('change', { target: { value: 'fooName' } });
  modal.find('.js-alt-name').simulate('change', { target: { value: 'fooAltName' } });
  modal.find('.js-notes').simulate('change', { target: { value: 'fooNotes' } });
  expect(modal.state()).toEqual(expect.objectContaining({
    name: 'fooName',
    altName: 'fooAltName',
    notes: 'fooNotes'
  }));
});

it('keeps state authoritative over text input', () => {
  const modal = shallow(<AddPlantModal />);
  modal.setState({ name: '1', altName: '2', notes: '3' });
  expect(modal.find('.js-name').props().value).toBe('1');
  expect(modal.find('.js-alt-name').props().value).toBe('2');
  expect(modal.find('.js-notes').props().value).toBe('3');
});

it('allows file input', () => {
  const modal = shallow(<AddPlantModal />);
  expect(modal.find('#add-plant-image').length).toBe(1);
  //#add-plant-image
  //picture
});

// how to test board, and sensors?
it('should store the selected board\'s id in state', () => {

});

it('should display a board\'s sensors when the board is selected', () => {

});

it('should keep track of selected sensor ids', () => {

});

it('should verify form input', () => {

});

it('should handle form submission and file upload', () => {
  // you'll want to shim in some graphql stuff for this one, probably
});
