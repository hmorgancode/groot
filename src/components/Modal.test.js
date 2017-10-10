import React from 'react';
import { shallow } from 'enzyme';
import { ModalWithoutState as Modal } from './Modal';

test('renders', () => {
  shallow(<Modal />);
});

test('closes when the close button is clicked', () => {
  const mockClose = jest.fn();
  const modal = shallow(<Modal handleCloseModal={mockClose} />);
  modal.find('.js-close-modal').simulate('click');
  expect(mockClose.mock.calls.length).toBe(1);
});

test('closes when the area outside of the modal is clicked', () => {
  const mockClose = jest.fn();
  const modal = shallow(<Modal handleCloseModal={mockClose} />);
  modal.find('.js-modal-background').simulate('click');
  expect(mockClose.mock.calls.length).toBe(1);
});

test('renders the provided modal title', () => {
  const modal = shallow(<Modal title="Test Title" />);
  expect(modal.find('.js-modal-title').text()).toBe('Test Title');
});

test('renders the provided modal body', () => {
  const modal = shallow(<Modal body={<div className="js-test-body"></div>} />);
  expect(modal.find('.js-test-body').length).toBe(1);
});

test('renders the provided modal footer', () => {
  const modal = shallow(<Modal foot={<div className="js-test-foot"></div>} />);
  expect(modal.find('.js-test-foot').length).toBe(1);
});
