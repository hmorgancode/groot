import React from 'react';
import { shallow } from 'enzyme';
// import MockAdapter from 'axios-mock-adapter';
import { AddPlantModalWithoutState as AddPlantModal } from './AddPlantModal';

const testData = {
  boards: [
    { _id: 'testDataId', sensors: [{ _id: 'sensor1Id' }, { _id: 'sensor2Id' }, { _id: 'sensor3Id' }] }
  ]
};

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

it(`stores the selected board's id in state`, () => {
  const modal = shallow(<AddPlantModal data={testData} />);
  const boardSelect = modal.find('.js-board-select');
  boardSelect.simulate('change', {
    target: {
      value: 'testDataId'
    }
  });
  expect(modal.state('selectedBoardId')).toBe('testDataId')
  boardSelect.simulate('change', {
    target: {
      value: 'null'
    }
  });
  expect(modal.state('selectedBoardId')).toBe(null);
});

it(`displays a board's sensors when the board is selected`, () => {
  const modal = shallow(<AddPlantModal data={testData} />);
  expect(modal.find('.js-sensor').length).toBe(0);
  modal.find('.js-board-select').simulate('change', {
    target: {
      value: 'testDataId'
    }
  });
  expect(modal.find('.js-sensor-checkbox').length).toBe(3);
});

it('keeps track of selected sensor ids', () => {
  const modal = shallow(<AddPlantModal data={testData} />);
  modal.find('.js-board-select').simulate('change', {
    target: {
      value: 'testDataId'
    }
  });
  expect(modal.state('selectedSensors')).toEqual({});
  const sensorNodes = modal.find('.js-sensor-checkbox');
  sensorNodes.at(0).simulate('change', {
    target: {
      checked: true
    }
  });
  sensorNodes.at(2).simulate('change', {
    target: {
      checked: true
    }
  });
  expect(modal.state('selectedSensors').sensor1Id).toBeDefined();
  expect(modal.state('selectedSensors').sensor2Id).toBeUndefined();
  expect(modal.state('selectedSensors').sensor3Id).toBeDefined();
});

it('verifies form input', () => {

});

it('handles form submission and file upload', () => {
  // set defaultProp for "mutate" and use that.
});
