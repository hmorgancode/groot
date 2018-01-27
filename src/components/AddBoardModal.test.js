import React from 'react';
import { mount } from 'enzyme';
import { AddBoardModalWithoutState as AddBoardModal } from './AddBoardModal';

const noop = () => null;
// lets us wait for async calls resulting from Enzyme input
const asyncNoop = async () => new Promise((resolve) => {
  setTimeout(() => {
    resolve();
  }, 0);
});

const testBoards = {
  boards: [
    { _id: 'testBoardId',
      location: 'testBoardLocation',
      isRemote: false,
      type: 'testArduino',
      sensors: [{
        _id: 'sensor1Id',
        type: 'Moisture',
        dataPin: 1,
        powerPin: 1,
      }, {
        _id: 'sensor2Id',
        type: 'Water Level',
        dataPin: 2,
        powerPin: 2,
      }, {
        _id: 'sensor3Id',
        type: 'Humidity',
        dataPin: 3,
        powerPin: 3,
      }] }
  ]
};
const testTarget = 'testBoardId';

test('Modal renders', () => {
  mount(<AddBoardModal />);
});

test('closes when the cancel button is clicked', () => {
  const mockClose = jest.fn();
  const modal = mount(<AddBoardModal handleCloseModal={mockClose} />);
  modal.find('.js-cancel-button').simulate('click');
  expect(mockClose).toHaveBeenCalled();
});

test('stores input in state', () => {
  const modal = mount(<AddBoardModal />);
  modal.find('.js-location').simulate('change', { target: { value: 'fooLocation' } });
  modal.find('.js-type').simulate('change', { target: { value: 'fooType' } });
  modal.find('.js-is-remote').simulate('change', { target: { checked: true } });
  expect(modal.state()).toEqual(expect.objectContaining({
    location: 'fooLocation',
    type: 'fooType',
    isRemote: true
  }));
});

test('keeps state authoritative over input', () => {
  const modal = mount(<AddBoardModal />);
  modal.setState({ location: '1', type: '2', isRemote: true });
  expect(modal.find('.js-location').props().value).toBe('1');
  expect(modal.find('.js-type').props().value).toBe('2');
  expect(modal.find('.js-is-remote').props().checked).toBe(true);
});

test('stores file input in state as a name string and a FormData object', () => {
  const modal = mount(<AddBoardModal />);
  const spy = jest.spyOn(FormData.prototype, 'append');
  modal.find('#add-board-image').simulate('change', {
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

test('submits on click when given required form data', () => {
  const spy = jest.fn().mockImplementation(() => Promise.resolve());
  const modal = mount(<AddBoardModal createBoard={spy} handleCloseModal={noop} />);
  const submitButton = modal.find('.js-submit-form');
  submitButton.simulate('click');
  expect(spy).not.toHaveBeenCalled();
  modal.setState({ location: 'foo' });
  submitButton.simulate('click');
  expect(spy).toHaveBeenCalled();
});

// see the equivalent test in AddPlantModal for why this is the only async test.
test(`uploads thumbnail on form submission when a thumbnail is provided`, async () => {
  const spyAxios = () => null;
  spyAxios.post = jest.fn().mockImplementation(() => Promise.resolve({ data: 'url/img.jpg' }));
  const spyCreateBoard = jest.fn().mockImplementation(async () => Promise.resolve());
  const modal = mount(<AddBoardModal axios={spyAxios} createBoard={spyCreateBoard} handleCloseModal={noop} />);
  modal.setState({ location: 'foo', imageData: 'img.jpg' });
  modal.find('.js-submit-form').simulate('click');
  await asyncNoop();
  expect(spyAxios.post).toHaveBeenCalled();
  expect(spyCreateBoard).toHaveBeenCalled();
  expect(spyCreateBoard.mock.calls[0][0]).toEqual(expect.objectContaining({
    variables: expect.objectContaining({
      location: 'foo',
      thumbnail: 'url/img.jpg'
    })
  }));
});

test('closes after submission', async () => {
  const mockClose = jest.fn();
  const modal = mount(<AddBoardModal handleCloseModal={mockClose} createBoard={noop} />);
  modal.setState({ location: 'foo' });
  modal.find('.js-submit-form').simulate('click');
  // okay so there is ABSOLUTELY a better way to do this but
  await asyncNoop();
  expect(mockClose).toHaveBeenCalled();
});


///////////////////////////
///// EDIT MODE TESTS /////
///////////////////////////

test('populates form input with preexisting data if editing a board', () => {
  const modal = mount(<AddBoardModal boardsData={testBoards} target={testTarget} />);
  expect(modal.state()).toEqual(expect.objectContaining({
    location: 'testBoardLocation',
    isRemote: false,
    type: 'testArduino',
    sensors: testBoards.boards[0].sensors,
  }));
});

test('calls updateBoard on click when given updated form data', async () => {
  const spyUpdateBoard = jest.fn();
  const modal = mount(<AddBoardModal boardsData={testBoards} target={testTarget} updateBoard={spyUpdateBoard} handleCloseModal={noop} />);
  modal.find('.js-submit-form').simulate('click');
  expect(spyUpdateBoard).toHaveBeenCalled();
  expect(spyUpdateBoard.mock.calls[0][0]).toEqual(expect.objectContaining({
    variables: expect.objectContaining({
      _id: 'testBoardId',
      location: 'testBoardLocation',
      isRemote: false,
      type: 'testArduino',
      // sensors should not be part of this! each Sensor component can handle its own mutation.
    })
  }));
});

test('uploads thumbnail on board update when a new thumbnail is provided', async () => {
  const spyUpdateBoard = jest.fn().mockImplementation(async () => Promise.resolve());
  const spyAxios = () => null;
  spyAxios.post = jest.fn().mockImplementation(async () => Promise.resolve({ data: 'url/img.jpg' }));
  const modal = mount(<AddBoardModal boardsData={testBoards}
    target={testTarget} updateBoard={spyUpdateBoard} axios={spyAxios} handleCloseModal={noop} />);
  modal.setState({ imageData: 'img.jpg' });
  modal.find('.js-submit-form').simulate('click');
  await asyncNoop();
  expect(spyAxios.post).toHaveBeenCalled();
  expect(spyUpdateBoard).toHaveBeenCalled();
  expect(spyUpdateBoard.mock.calls[0][0]).toEqual(expect.objectContaining({
    variables: expect.objectContaining({
      _id: 'testBoardId',
      location: 'testBoardLocation',
      isRemote: false,
      type: 'testArduino',
      thumbnail: 'url/img.jpg'
    })
  }));
});

// test('requests deletion of original thumbnail when a new thumbnail is set', async () => {

// });

test('only shows delete button when editing an existing board', () => {
  let modal = mount(<AddBoardModal boardsData={testBoards} />);
  expect(modal.find('.js-delete-button').length).toBe(0);
  modal = mount(<AddBoardModal target={testTarget} boardsData={testBoards} />);
  expect(modal.find('.js-delete-button').length).toBe(1);
});

test('submits deleteBoard when delete button is clicked twice', () => {
  const spyDeleteBoard = jest.fn();
  const modal = mount(<AddBoardModal target={testTarget} boardsData={testBoards} deleteBoard={spyDeleteBoard} handleCloseModal={noop} />);
  expect(modal.state().confirmingDelete).toBe(false);
  const deleteButton = modal.find('.js-delete-button');
  deleteButton.simulate('click');
  expect(spyDeleteBoard).not.toHaveBeenCalled();
  expect(modal.state().confirmingDelete).toBe(true);
  deleteButton.simulate('click');
  expect(spyDeleteBoard).toHaveBeenCalled();
  expect(modal.state().confirmingDelete).toBe(false);
});

test('closes modal after plant deletion', () => {
  const spyCloseModal = jest.fn();
  const modal = mount(<AddBoardModal target={testTarget} boardsData={testBoards} deleteBoard={noop} handleCloseModal={spyCloseModal} />);
  const deleteButton = modal.find('.js-delete-button');
  deleteButton.simulate('click');
  deleteButton.simulate('click');
  expect(spyCloseModal).toHaveBeenCalled();
});

describe('sensors panel', () => {
  it('is only visible in Edit mode', () => {
    let modal = mount(<AddBoardModal boardsData={testBoards} />);
    expect(modal.find('.js-sensors-list')).toHaveLength(0);
    modal = mount(<AddBoardModal target={testTarget} boardsData={testBoards} />);
    expect(modal.find('.js-sensors-list')).toHaveLength(1);
  });
});
