import React from 'react';
import { shallow } from 'enzyme';
import { NavBarWithoutState as NavBar } from './NavBar';

test('render', () => {
  shallow(<NavBar />);
});

test('Moves to Plants list when clicked', () => {
  const spy = jest.fn();
  const navBar = shallow(<NavBar handleGoToPlants={spy} />);
  navBar.find('#js-nav-plants').simulate('click');
  expect(spy).toHaveBeenCalled();
});

test('Moves to Boards list when clicked', () => {
  const spy = jest.fn();
  const navBar = shallow(<NavBar handleGoToBoards={spy} />);
  navBar.find('#js-nav-boards').simulate('click');
  expect(spy).toHaveBeenCalled();
});

test('Highlights active tab', () => {
  let navBar = shallow(<NavBar activePage={'PLANTS'} />);
  expect(navBar.find('#js-nav-plants').prop('className')).toBe('is-active');
  expect(navBar.find('#js-nav-boards').prop('className')).toBe('');
  navBar = shallow(<NavBar activePage={'BOARDS'} />);
  expect(navBar.find('#js-nav-boards').prop('className')).toBe('is-active');
  expect(navBar.find('#js-nav-plants').prop('className')).toBe('');
});

test('Enables edit mode when add/remove button is clicked', () => {
  const spy = jest.fn();
  const navBar = shallow(<NavBar toggleEditMode={spy} />);
  navBar.find('#js-nav-edit').simulate('click');
  expect(spy).toHaveBeenCalled();
});

test('Displays Add Item button when in edit mode', () => {
  const navBar = shallow(<NavBar isEditing={false} />);
  expect(navBar.find('.add-item-button').length).toBe(0);
  navBar.setProps({ isEditing: true });
  expect(navBar.find('.add-item-button').length).toBe(1);
});

test('Clicking Add Item button launches contextually appropriate modal', () => {
  const spy = jest.fn();
  const navBar = shallow(<NavBar isEditing={true} activePage='PLANTS' handleOpenModal={spy} />);
  navBar.find('.add-item-button').simulate('click');
  expect(spy.mock.calls[0][0]).toBe('ADD_PLANT');
  navBar.setProps({ activePage: 'BOARDS' });
  navBar.find('.add-item-button').simulate('click');
  expect(spy.mock.calls[1][0]).toBe('ADD_BOARD');

});

