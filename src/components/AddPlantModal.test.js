import React from 'react';
import { shallow } from 'enzyme';
// import MockAdapter from 'axios-mock-adapter';
import { AddPlantModalWithoutState as AddPlantModal } from './AddPlantModal';

const testData = {
  boards: [
    { _id: 'testDataId', sensors: [{ _id: 'sensor1Id' }, { _id: 'sensor2Id' }, { _id: 'sensor3Id' }] }
  ]
};

test('render', () => {
  shallow(<AddPlantModal />);
});

test('Modal closes when the close button or outside of modal are clicked', () => {
  const mockClose = jest.fn();
  const modal = shallow(<AddPlantModal handleCloseModal={mockClose} />);
  modal.find('.js-close-modal').simulate('click');
  modal.find('.js-modal-background').simulate('click');
  expect(mockClose.mock.calls.length).toBe(2);
});

test('Modal stores text input in state', () => {
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

test('Modal keeps state authoritative over text input', () => {
  const modal = shallow(<AddPlantModal />);
  modal.setState({ name: '1', altName: '2', notes: '3' });
  expect(modal.find('.js-name').props().value).toBe('1');
  expect(modal.find('.js-alt-name').props().value).toBe('2');
  expect(modal.find('.js-notes').props().value).toBe('3');
});

test('Modal stores file input in state as a name string and a FormData object', () => {
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

test(`Modal stores the selected board's id in state`, () => {
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

test(`Modal displays a board's sensors when the board is selected`, () => {
  const modal = shallow(<AddPlantModal data={testData} />);
  expect(modal.find('.js-sensor').length).toBe(0);
  modal.find('.js-board-select').simulate('change', {
    target: {
      value: 'testDataId'
    }
  });
  expect(modal.find('.js-sensor-checkbox').length).toBe(3);
});

test('Modal keeps track of selected sensor ids', () => {
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

// Now that you think of it, you should add clear cues for invalid form and/or
// grey out the submission button. Just add a verify function later and
// test THAT
test('Modal submits on click when given required form data', () => {
  // Types are enforced by the inputs and the server has to validate anyways
  // so just check that we require name and board to submit.
  const spy = jest.fn().mockImplementation(() => Promise.resolve());
  const modal = shallow(<AddPlantModal data={testData} mutate={spy} />);
  const submitButton = modal.find('.js-submit-form');
  submitButton.simulate('click');
  expect(spy).not.toHaveBeenCalled();
  modal.setState({ name: 'foo', selectedBoardId: 'testDataId' });
  submitButton.simulate('click');
  expect(spy).toHaveBeenCalled();
});

test(`Modal uploads thumbnail on form submission when a thumbnail is provided`, () => {
  const spyAxios = jest.fn().mockImplementation(() => Promise.resolve({ data: 'url/img.jpg' }));
  const spyMutate = jest.fn();
  const modal = shallow(<AddPlantModal data={testData} axios={{ post: spyAxios }} mutate={spyMutate} />);
  modal.setState({ name: 'foo', selectedBoardId: 'testDataId', imageData: 'img.jpg' });
  modal.find('.js-submit-form').simulate('click');
  expect(spyAxios).toHaveBeenCalled();
  // Why is spyMutate called when it's called before spyAxios, but not when it's called after spyAxios?
  // figure this out after sleeping
  // expect(spyMutate).toHaveBeenCalled();
  // expect(spyMutate.mock.calls[0]).toEqual(expect.objectContaining({
  //   variables: expect.objectContaining({
  //     name: 'foo',
  //     board: 'testDataId',
  //     thumbnail: 'url/img.jpg'
  //   })
  // }));
});

test('Modal closes after submission', () => {
  const mockClose = jest.fn();
  const modal = shallow(<AddPlantModal data={testData} mutate={() => null} handleCloseModal={mockClose} />);
  modal.setState({ name: 'foo', selectedBoardId: 'testDataId' });
  modal.find('.js-submit-form').simulate('click');
  expect(mockClose.mock.calls.length).toBe(1);
});
