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

test.skip('Enables edit mode when add/remove button is clicked', () => {

});
