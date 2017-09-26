import { GOTO_PLANTS,
         GOTO_BOARDS,
         OPEN_MODAL,
         CLOSE_MODAL
       } from './actionTypes';
// Note: All Plant/Board/Sensor data is managed by Apollo.
// This is for non-GraphQL data.

const initialState = {
  modal: {
    modalType: 'ADD_PLANT',
    isActive: false
  },
  app: {
    activePage: 'PLANTS'
  }
};

function modalReducer(state = initialState.modal, action) {
  switch (action.type) {
    case OPEN_MODAL:
      if (state.isActive) {
        return state;
      }
      return { ...state, isActive: true, modalType: action.modalType };
    case CLOSE_MODAL:
      return { ...state, isActive: false } ;
    default:
      return state;
  }
}

function appReducer(state = initialState.app, action) {
  switch (action.type) {
    case GOTO_PLANTS:
      return { ...state, activePage: 'PLANTS' };
    case GOTO_BOARDS:
      return { ...state, activePage: 'BOARDS' };
    default:
      return state;
  }
}

export { modalReducer, appReducer };
