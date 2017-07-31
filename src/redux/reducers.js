import { OPEN_MODAL,
         CLOSE_MODAL,
         SELECT_BOARD,
         SELECT_IMAGE,
         UPLOAD_IMAGE_REQUEST,
         UPLOAD_IMAGE_SUCCESS,
         UPLOAD_IMAGE_FAILURE,
         DELETE_IMAGE_REQUEST,
         DELETE_IMAGE_SUCCESS,
         DELETE_IMAGE_FAILURE
       } from './actionTypes';
// Note: All Plant/Board/Sensor data is managed by Apollo.
// This is for non-GraphQL data.

const initialState = {
  modal: {
    modalType: 'ADD_PLANT',
    isActive: false
  },
  addPlantModal: {
    selectedBoardIndex: -1,
    selectedImageName: '',
    uploadedImageName: null,
    isFetching: false,
    uploadImageError: null,
    deleteImageError: null
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

function addPlantModalReducer(state = initialState.addPlantModal, action) {
  switch (action.type) {
    case SELECT_BOARD:
      return { ...state, selectedBoardIndex : action.selectedBoardIndex };
    case SELECT_IMAGE:
      return { ...state, selectedImageName: action.name };
    case UPLOAD_IMAGE_REQUEST:
      return { ...state, isFetching: true };
    case UPLOAD_IMAGE_SUCCESS:
      return { ...state, isFetching: false, uploadedImageName: action.name };
    case UPLOAD_IMAGE_FAILURE:
      return { ...state, isFetching: false, uploadImageError: action.error };
    case DELETE_IMAGE_REQUEST:
      return { ...state, isFetching: true };
    case DELETE_IMAGE_SUCCESS:
      return { ...state, isFetching: false, uploadedImageName: null };
    case DELETE_IMAGE_FAILURE:
      return { ...state, isFetching: false, deleteImageError: action.error };
    default:
      return state;
  }
}

export { modalReducer, addPlantModalReducer };
