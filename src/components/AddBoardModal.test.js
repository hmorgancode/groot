import React from 'react';
import { shallow } from 'enzyme';


import { AddBoardModalWithoutState as AddBoardModal } from './AddBoardModal';

test('Modal renders', () => {
  // shallow(<AddBoardModal />);
});


// oh, you can just pass head, body, and foot as three children! then use
// those to render the modal. Sweet! You're good, go make that modal factory!
test('closes when the close button or outside of modal are clicked', () => {
  // const mockClose = jest.fn();
  // const modal = shallow(<AddBoardModal handleCloseModal={mockClose} />);
  // modal.find('.js-close-modal').simulate('click');
  // modal.find('.js-modal-background').simulate('click');
  // expect(mockClose.mock.calls.length).toBe(2);
});

test('stores text input in state', () => {
  // const modal = shallow(<AddPlantModal />);
  // modal.find('.js-name').simulate('change', { target: { value: 'fooName' } });
  // modal.find('.js-alt-name').simulate('change', { target: { value: 'fooAltName' } });
  // modal.find('.js-notes').simulate('change', { target: { value: 'fooNotes' } });
  // expect(modal.state()).toEqual(expect.objectContaining({
  //   name: 'fooName',
  //   altName: 'fooAltName',
  //   notes: 'fooNotes'
  // }));
});

test('keeps state authoritative over text input', () => {
  // const modal = shallow(<AddPlantModal />);
  // modal.setState({ name: '1', altName: '2', notes: '3' });
  // expect(modal.find('.js-name').props().value).toBe('1');
  // expect(modal.find('.js-alt-name').props().value).toBe('2');
  // expect(modal.find('.js-notes').props().value).toBe('3');
});

test('stores file input in state as a name string and a FormData object', () => {
  // const modal = shallow(<AddPlantModal />);
  // const spy = jest.spyOn(FormData.prototype, 'append');
  // modal.find('#add-plant-image').simulate('change', {
  //   target: {
  //     files: [{ name: 'foo.bmp' }]
  //   }
  // });
  // expect(modal.state('imageName')).toBe('foo.bmp');
  // expect(spy).toHaveBeenCalled();
  // expect(modal.state('imageData').has('thumbnail')).toBe(true);
  // spy.mockReset();
  // spy.mockRestore();
});

test('submits on click when given required form data', () => {
  // location: string!
  // type: string
  // isRemote: boolean
  // thumbnail: name + image

  // Types are enforced by the inputs and the server has to validate anyways
  // so just check that we require name and board to submit.
  // const spy = jest.fn().mockImplementation(() => Promise.resolve());
  // const modal = shallow(<AddPlantModal data={testData} mutate={spy} />);
  // const submitButton = modal.find('.js-submit-form');
  // submitButton.simulate('click');
  // expect(spy).not.toHaveBeenCalled();
  // modal.setState({ name: 'foo', selectedBoardId: 'testDataId' });
  // submitButton.simulate('click');
  // expect(spy).toHaveBeenCalled();
});

test(`uploads thumbnail on form submission when a thumbnail is provided`, () => {
  // const spyAxios = jest.fn().mockImplementation(() => Promise.resolve({ data: 'url/img.jpg' }));
  // const spyMutate = jest.fn();
  // const modal = shallow(<AddPlantModal data={testData} axios={{ post: spyAxios }} mutate={spyMutate} />);
  // modal.setState({ name: 'foo', selectedBoardId: 'testDataId', imageData: 'img.jpg' });
  // modal.find('.js-submit-form').simulate('click');
  // expect(spyAxios).toHaveBeenCalled();
});

test('closes after submission', () => {
  // const mockClose = jest.fn();
  // const modal = shallow(<AddBoardModal handleCloseModal={mockClose} />);
  // modal.setState({ name: 'foo', selectedBoardId: 'testDataId' });
  // modal.find('.js-submit-form').simulate('click');
  // expect(mockClose.mock.calls.length).toBe(1);
});
