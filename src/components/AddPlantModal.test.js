import React from 'react';
import { mount } from 'enzyme';
// import MockAdapter from 'axios-mock-adapter';
import { AddPlantModalWithoutState as AddPlantModal } from './AddPlantModal';

const noop = () => null;
// lets us wait for async calls resulting from Enzyme input
const asyncNoop = async () => new Promise((resolve) => {
  setTimeout(() => {
    resolve();
  }, 0);
});
const testData = {
  boards: [
    { _id: 'testDataId', sensors: [{ _id: 'sensor1Id' }, { _id: 'sensor2Id' }, { _id: 'sensor3Id' }] }
  ]
};

test('renders', () => {
  mount(<AddPlantModal />);
});

test('closes when the cancel button is clicked', () => {
  const mockClose = jest.fn();
  const modal = mount(<AddPlantModal handleCloseModal={mockClose} />);
  modal.find('.js-cancel-button').simulate('click');
  expect(mockClose).toHaveBeenCalled();
});

test('populates form input with preexisting data if editing a plant', () => {

});

// Test that a populated form selects the correct board on the dropdown on
// page load?

test('stores text input in state', () => {
  const modal = mount(<AddPlantModal />);
  modal.find('.js-name').simulate('change', { target: { value: 'fooName' } });
  modal.find('.js-alt-name').simulate('change', { target: { value: 'fooAltName' } });
  modal.find('.js-notes').simulate('change', { target: { value: 'fooNotes' } });
  expect(modal.state()).toEqual(expect.objectContaining({
    name: 'fooName',
    altName: 'fooAltName',
    notes: 'fooNotes'
  }));
});

test('keeps state authoritative over text input', () => {
  const modal = mount(<AddPlantModal />);
  modal.setState({ name: '1', altName: '2', notes: '3' });
  expect(modal.find('.js-name').props().value).toBe('1');
  expect(modal.find('.js-alt-name').props().value).toBe('2');
  expect(modal.find('.js-notes').props().value).toBe('3');
});

test('stores file input in state as a name string and a FormData object', () => {
  const modal = mount(<AddPlantModal />);
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

test(`stores the selected board's id in state`, () => {
  const modal = mount(<AddPlantModal boardsData={testData} />);
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

test(`displays a board's sensors when the board is selected`, () => {
  const modal = mount(<AddPlantModal boardsData={testData} />);
  expect(modal.find('.js-sensor').length).toBe(0);
  modal.find('.js-board-select').simulate('change', {
    target: {
      value: 'testDataId'
    }
  });
  expect(modal.find('.js-sensor-checkbox').length).toBe(3);
});

test('keeps track of selected sensor ids', () => {
  const modal = mount(<AddPlantModal boardsData={testData} />);
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
test('submits on click when given required form data', () => {
  // Types are enforced by the inputs and the server has to validate anyways
  // so just check that we require name and board to submit.
  const spyMutate = jest.fn().mockImplementation(async () => Promise.resolve());
  const modal = mount(<AddPlantModal boardsData={testData} mutate={spyMutate} handleCloseModal={noop}/>);
  const submitButton = modal.find('.js-submit-form');
  submitButton.simulate('click');
  expect(spyMutate).not.toHaveBeenCalled();
  modal.setState({ name: 'foo'});
  submitButton.simulate('click');
  expect(spyMutate).not.toHaveBeenCalled();
  modal.setState({ name: '', selectedBoardId: null });
  submitButton.simulate('click');
  expect(spyMutate).not.toHaveBeenCalled();
  modal.setState({ name: 'foo', selectedBoardId: 'testDataId' });
  submitButton.simulate('click');
  expect(spyMutate).toHaveBeenCalled();
});

// Note: This is the only test that has to be async, since it's the only test in which
// axios.post (which handleFormSubmit awaits) is called.
test('uploads thumbnail on form submission when a thumbnail is provided', async () => {
  const spyAxios = () => null;
  spyAxios.post = jest.fn().mockImplementation(async () => Promise.resolve({ data: 'url/img.jpg' }));
  const spyMutate = jest.fn().mockImplementation(async () => Promise.resolve());
  const modal = mount(<AddPlantModal boardsData={testData} axios={spyAxios}
                                     mutate={spyMutate} handleCloseModal={noop} />);
  modal.setState({ name: 'foo', selectedBoardId: 'testDataId', imageData: 'img.jpg' });
  modal.find('.js-submit-form').simulate('click');
  await asyncNoop();
  expect(spyAxios.post).toHaveBeenCalled();
  expect(spyMutate).toHaveBeenCalled();
  expect(spyMutate.mock.calls[0][0]).toEqual(expect.objectContaining({
    variables: expect.objectContaining({
      name: 'foo',
      board: 'testDataId',
      thumbnail: 'url/img.jpg'
    })
  }));
});

test('closes after submission', () => {
  const mockClose = jest.fn();
  const modal = mount(<AddPlantModal boardsData={testData} mutate={noop} handleCloseModal={mockClose} />);
  modal.setState({ name: 'foo', selectedBoardId: 'testDataId' });
  modal.find('.js-submit-form').simulate('click');
  expect(mockClose).toHaveBeenCalled();
});
