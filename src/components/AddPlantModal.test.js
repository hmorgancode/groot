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

it('stores text input in state', () => {
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

it('stores file input in state as a name string and a FormData object', () => {
  const modal = shallow(<AddPlantModal />);
  const spy = jest.spyOn(FormData.prototype, 'append');
  modal.find('#add-plant-image').simulate('change', {
    target: {
      files: [{ name: 'foo.bmp' }]
    }
  });
  expect(modal.state('imageName')).toBe('foo.bmp');
  expect(spy).toHaveBeenCalled();
  expect(modal.state('imageData').has('thumbnail')).toBe(true);
  spy.mockReset();
  spy.mockRestore();
});

// how to test board, and sensors?
it('stores the selected board\'s id in state', () => {

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
