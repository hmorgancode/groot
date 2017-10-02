import React from 'react';
import { shallow } from 'enzyme';
import { AppWithoutState as App } from './App';

it('renders without crashing', () => {
  shallow(<App />);
});

// what else to test here? come back when you have conditional rendering / skeletal state?

it('renders content when a page is active', () => {
  let app = shallow(<App activePage="PLANTS" />);
  expect(app.find('#content').length).toBe(1);
  app = shallow(<App />);
  expect(app.find('#content').length).toBe(0);
});

it('always renders the nav bar and modal conductor', () => {
  const app = shallow(<App />);
  expect(app.find('#nav-bar').length).toBe(1);
  expect(app.find('#modal-conductor').length).toBe(1);
});
