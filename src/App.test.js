import React from 'react';
import { shallow } from 'enzyme';
import { AppWithoutState as App } from './App';

it('renders without crashing', () => {
  const app = shallow(<App />);
  expect(app.find('#content').length).toBe(1);
});

// what else to test here? come back when you have conditional rendering / skeletal state?
