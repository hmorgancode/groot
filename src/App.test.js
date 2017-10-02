import React from 'react';
import { shallow } from 'enzyme';
import { AppWithoutState as App } from './App';

it('renders without crashing', () => {
  const wrapper = shallow(<App />);
});
