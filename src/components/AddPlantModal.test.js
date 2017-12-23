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
const testBoards = {
  boards: [
    { _id: 'testBoardId', sensors: [{ _id: 'sensor1Id' }, { _id: 'sensor2Id' }, { _id: 'sensor3Id' }] }
  ]
};
const testTarget = 'testTargetId';
const testPlants = { plants: [{
  _id: 'testTargetId',
  name: 'Test Target Plant',
  board: {
    _id: 'testBoardId'
  },
  thumbnail: '',
  altName: 'testTargetAltName',
  tags: [],
  notes: 'testTargetNotes',
  sensors: [{ _id: 'sensor1Id' }, { _id: 'sensor2Id' }]
}]};

///////////////////////////
/// ADD + GENERAL TESTS ///
///////////////////////////

test('renders', () => {
  mount(<AddPlantModal />);
});

test('closes when the cancel button is clicked', () => {
  const mockClose = jest.fn();
  const modal = mount(<AddPlantModal handleCloseModal={mockClose} />);
  modal.find('.js-cancel-button').simulate('click');
  expect(mockClose).toHaveBeenCalled();
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
  const modal = mount(<AddPlantModal boardsData={testBoards} />);
  const boardSelect = modal.find('.js-board-select');
  boardSelect.simulate('change', {
    target: {
      value: 'testBoardId'
    }
  });
  expect(modal.state('selectedBoardId')).toBe('testBoardId')
  boardSelect.simulate('change', {
    target: {
      value: 'null'
    }
  });
  expect(modal.state('selectedBoardId')).toBe(null);
});

test(`displays a board's sensors when the board is selected`, () => {
  const modal = mount(<AddPlantModal boardsData={testBoards} />);
  expect(modal.find('.js-sensor').length).toBe(0);
  modal.find('.js-board-select').simulate('change', {
    target: {
      value: 'testBoardId'
    }
  });
  expect(modal.find('.js-sensor-checkbox').length).toBe(3);
});

test('keeps track of selected sensor ids', () => {
  const modal = mount(<AddPlantModal boardsData={testBoards} />);
  modal.find('.js-board-select').simulate('change', {
    target: {
      value: 'testBoardId'
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
test('submits createPlant on click when given required original form data', async () => {
  // Types are enforced by the inputs and the server has to validate anyways
  // so just check that we require name and board to submit.
  const spyAddPlant = jest.fn().mockImplementation(async () => Promise.resolve());
  const modal = mount(<AddPlantModal boardsData={testBoards} createPlant={spyAddPlant} handleCloseModal={noop}/>);
  const submitButton = modal.find('.js-submit-form');
  submitButton.simulate('click');
  expect(spyAddPlant).not.toHaveBeenCalled();
  modal.setState({ name: 'foo'});
  submitButton.simulate('click');
  expect(spyAddPlant).not.toHaveBeenCalled();
  modal.setState({ name: '', selectedBoardId: null });
  submitButton.simulate('click');
  expect(spyAddPlant).not.toHaveBeenCalled();
  modal.setState({ name: 'foo', selectedBoardId: 'testBoardId' });
  submitButton.simulate('click');
  await asyncNoop();
  expect(spyAddPlant).toHaveBeenCalled();
});

// Note: This is the only test that has to be async, since it's the only test in which
// axios.post (which handleFormSubmit awaits) is called.
test('uploads thumbnail on plant creation when a thumbnail is provided', async () => {
  const spyAxios = () => null;
  spyAxios.post = jest.fn().mockImplementation(async () => Promise.resolve({ data: 'url/img.jpg' }));
  const spyCreatePlant = jest.fn().mockImplementation(async () => Promise.resolve());
  const modal = mount(<AddPlantModal boardsData={testBoards} axios={spyAxios}
                                     createPlant={spyCreatePlant} handleCloseModal={noop} />);
  modal.setState({ name: 'foo', selectedBoardId: 'testBoardId', imageData: 'img.jpg' });
  modal.find('.js-submit-form').simulate('click');
  await asyncNoop();
  expect(spyAxios.post).toHaveBeenCalled();
  expect(spyCreatePlant).toHaveBeenCalled();
  expect(spyCreatePlant.mock.calls[0][0]).toEqual(expect.objectContaining({
    variables: expect.objectContaining({
      name: 'foo',
      board: 'testBoardId',
      thumbnail: 'url/img.jpg'
    })
  }));
});

test('closes after submission', async () => {
  const mockClose = jest.fn();
  const modal = mount(<AddPlantModal boardsData={testBoards} createPlant={noop} handleCloseModal={mockClose} />);
  modal.setState({ name: 'foo', selectedBoardId: 'testBoardId' });
  modal.find('.js-submit-form').simulate('click');
  await asyncNoop();
  expect(mockClose).toHaveBeenCalled();
});

///////////////////////////
///// EDIT MODE TESTS /////
///////////////////////////

test('populates form input with preexisting data if editing a plant', () => {
  const modal = mount(<AddPlantModal boardsData={testBoards} plantsData={testPlants} target={testTarget} />);
  expect(modal.state()).toEqual(expect.objectContaining({
    name: 'Test Target Plant',
    selectedBoardId: 'testBoardId',
    altName: 'testTargetAltName',
    notes: 'testTargetNotes',
    selectedSensors: expect.objectContaining({
      'sensor1Id': true,
      'sensor2Id': true
    })
  }));
});

test('calls updatePlant on click when given updated form data', async () => {
  const spyUpdatePlant = jest.fn();
  const modal = mount(<AddPlantModal boardsData={testBoards} plantsData={testPlants} target={testTarget} updatePlant={spyUpdatePlant} handleCloseModal={noop} />);
  modal.find('.js-submit-form').simulate('click');
  expect(spyUpdatePlant).toHaveBeenCalled();
  expect(spyUpdatePlant.mock.calls[0][0]).toEqual(expect.objectContaining({
    variables: expect.objectContaining({
      _id: 'testTargetId',
      name: 'Test Target Plant',
      board: 'testBoardId',
      thumbnail: '',
      altName: 'testTargetAltName',
      notes: 'testTargetNotes',
      sensors: ['sensor1Id', 'sensor2Id']
    })
  }));
});

test('uploads thumbnail on plant update when a new thumbnail is provided', async () => {
  const spyUpdatePlant = jest.fn().mockImplementation(async () => Promise.resolve());
  const spyAxios = () => null;
  spyAxios.post = jest.fn().mockImplementation(async () => Promise.resolve({ data: 'url/img.jpg' }));
  const modal = mount(<AddPlantModal boardsData={testBoards} plantsData={testPlants}
    target={testTarget} updatePlant={spyUpdatePlant} axios={spyAxios} handleCloseModal={noop} />);
  modal.setState({ imageData: 'img.jpg' });
  modal.find('.js-submit-form').simulate('click');
  await asyncNoop();
  expect(spyAxios.post).toHaveBeenCalled();
  expect(spyUpdatePlant).toHaveBeenCalled();
  expect(spyUpdatePlant.mock.calls[0][0]).toEqual(expect.objectContaining({
    variables: expect.objectContaining({
      name: 'Test Target Plant',
      board: 'testBoardId',
      thumbnail: 'url/img.jpg'
    })
  }));
});

// test('requests deletion of original thumbnail when a new thumbnail is set', async () => {

// });

test('only shows delete button when editing an existing plant', () => {
  let modal = mount(<AddPlantModal boardsData={testBoards} />);
  expect(modal.find('.js-delete-button').length).toBe(0);
  modal = mount(<AddPlantModal target={testTarget} boardsData={testBoards} plantsData={testPlants} />);
  expect(modal.find('.js-delete-button').length).toBe(1);
});

test('submits deletePlant when delete button is clicked twice', () => {
  const spyDeletePlant = jest.fn();
  const modal = mount(<AddPlantModal target={testTarget} plantsData={testPlants} boardsData={testBoards} deletePlant={spyDeletePlant} handleCloseModal={noop} />);
  expect(modal.state().confirmingDelete).toBe(false);
  const deleteButton = modal.find('.js-delete-button');
  deleteButton.simulate('click');
  expect(spyDeletePlant).not.toHaveBeenCalled();
  expect(modal.state().confirmingDelete).toBe(true);
  deleteButton.simulate('click');
  expect(spyDeletePlant).toHaveBeenCalled();
  expect(modal.state().confirmingDelete).toBe(false);
});

test('closes modal after plant deletion', () => {
  const spyCloseModal = jest.fn();
  const modal = mount(<AddPlantModal target={testTarget} plantsData={testPlants} boardsData={testBoards} deletePlant={noop} handleCloseModal={spyCloseModal} />);
  const deleteButton = modal.find('.js-delete-button');
  deleteButton.simulate('click');
  deleteButton.simulate('click');
  expect(spyCloseModal).toHaveBeenCalled();
});
