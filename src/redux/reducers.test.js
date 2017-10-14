import { appReducer, modalReducer } from './reducers';
import { toggleEditMode,
         goToPlants,
         goToBoards,
         openModal,
         closeModal } from './actionTypes';

describe('appReducer', () => {
  test('GOTO_PLANTS', () => {
    expect(appReducer({ activePage: '' }, goToPlants())).toEqual({ activePage: 'PLANTS' });
  });
  test('GOTO_BOARDS', () => {
    expect(appReducer({ activePage: '' }, goToBoards())).toEqual({ activePage: 'BOARDS' });
  });
  test('TOGGLE_EDIT_MODE', () => {
    expect(appReducer({ isEditing: false }, toggleEditMode())).toEqual({ isEditing: true });
    expect(appReducer({ isEditing: true }, toggleEditMode())).toEqual({ isEditing: false });
  });
});

describe('modalReducer', () => {
  test('OPEN_MODAL', () => {
    expect(modalReducer({ isActive: false }, openModal('FOO'))).toEqual({ isActive: true, modalType: 'FOO' });
    expect(modalReducer({ isActive: true }, openModal())).toEqual({ isActive: true });
  });
  test('CLOSE_MODAL', () => {
    expect(modalReducer({ isActive: false }, closeModal())).toEqual({ isActive: false });
    expect(modalReducer({ isActive: true }, closeModal())).toEqual({ isActive: false });
  });
});
