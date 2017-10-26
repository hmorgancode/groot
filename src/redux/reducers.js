import { GOTO_PLANTS,
         GOTO_BOARDS,
         OPEN_MODAL,
         CLOSE_MODAL,
         TOGGLE_EDIT_MODE
       } from './actionTypes';
// Note: All Plant/Board/Sensor data is managed by Apollo.
// This is for non-GraphQL data.

const initialState = {
  app: {
    activePage: 'PLANTS',
    isEditing: false
  },
  modal: {
    modalType: 'ADD_PLANT',
    isActive: false,
    // the id of the item we're editing, if this is an edit modal
    modalTarget: null
  }
};

function appReducer(state = initialState.app, action) {
  switch (action.type) {
    case GOTO_PLANTS:
      return { ...state, activePage: 'PLANTS' };
    case GOTO_BOARDS:
      return { ...state, activePage: 'BOARDS' };
    case TOGGLE_EDIT_MODE:
      return { ...state, isEditing: !state.isEditing };
    default:
      return state;
  }
}

function modalReducer(state = initialState.modal, action) {
  switch (action.type) {
    case OPEN_MODAL:
      if (state.isActive) {
        return state;
      }
      return { ...state, isActive: true, modalType: action.modalType, modalTarget: action.modalTarget };
    case CLOSE_MODAL:
      if (!state.isActive) {
        return state;
      }
      return { ...state, isActive: false, modalTarget: null } ;
    default:
      return state;
  }
}

export { modalReducer, appReducer };
