import React from 'react';
import { mount } from 'enzyme';
import { AddBoardModalWithoutState as AddBoardModal } from './AddBoardModal';

const noop = () => null;

test('Modal renders', () => {
  mount(<AddBoardModal />);
});

test('closes when the cancel button is clicked', () => {
  const mockClose = jest.fn();
  const modal = mount(<AddBoardModal handleCloseModal={mockClose} />);
  modal.find('.js-cancel-button').simulate('click');
  expect(mockClose).toHaveBeenCalled();
});

test('stores input in state', () => {
  const modal = mount(<AddBoardModal />);
  modal.find('.js-location').simulate('change', { target: { value: 'fooLocation' } });
  modal.find('.js-type').simulate('change', { target: { value: 'fooType' } });
  modal.find('.js-is-remote').simulate('change', { target: { checked: true } });
  expect(modal.state()).toEqual(expect.objectContaining({
    location: 'fooLocation',
    type: 'fooType',
    isRemote: true
  }));
});

test('keeps state authoritative over input', () => {
  const modal = mount(<AddBoardModal />);
  modal.setState({ location: '1', type: '2', isRemote: true });
  expect(modal.find('.js-location').props().value).toBe('1');
  expect(modal.find('.js-type').props().value).toBe('2');
  expect(modal.find('.js-is-remote').props().checked).toBe(true);
});

test('stores file input in state as a name string and a FormData object', () => {
  const modal = mount(<AddBoardModal />);
  const spy = jest.spyOn(FormData.prototype, 'append');
  modal.find('#add-board-image').simulate('change', {
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

test('submits on click when given required form data', () => {
  const spy = jest.fn().mockImplementation(() => Promise.resolve());
  const modal = mount(<AddBoardModal mutate={spy} handleCloseModal={noop} />);
  const submitButton = modal.find('.js-submit-form');
  submitButton.simulate('click');
  expect(spy).not.toHaveBeenCalled();
  modal.setState({ location: 'foo' });
  submitButton.simulate('click');
  expect(spy).toHaveBeenCalled();
});

test(`uploads thumbnail on form submission when a thumbnail is provided`, () => {
  const spyAxios = jest.fn().mockImplementation(() => Promise.resolve({ data: 'url/img.jpg' }));
  const modal = mount(<AddBoardModal axios={{ post: spyAxios }} mutate={noop} handleCloseModal={noop} />);
  modal.setState({ location: 'foo', imageData: 'img.jpg' });
  modal.find('.js-submit-form').simulate('click');
  expect(spyAxios).toHaveBeenCalled();
});

test('closes after submission', () => {
  const mockClose = jest.fn();
  const modal = mount(<AddBoardModal handleCloseModal={mockClose} mutate={noop} />);
  modal.setState({ location: 'foo' });
  modal.find('.js-submit-form').simulate('click');
  expect(mockClose).toHaveBeenCalled();
});
