//// ModalConductor

export const OPEN_MODAL = 'OPEN_MODAL';
export function openModal(modalType) {
  return {
    type: OPEN_MODAL,
    modalType
  };
}

export const CLOSE_MODAL = 'CLOSE_MODAL';
export function closeModal() {
  return {
    type: CLOSE_MODAL
  }
}

//// AddPlantModal

export const SELECT_BOARD = 'SELECT_BOARD';
export function selectBoard(selectedBoardIndex) {
  return {
    type: SELECT_BOARD,
    selectedBoardIndex
  }
}

export const SELECT_IMAGE = 'SELECT_IMAGE';
export function selectImage(selectedImage) {
  return {
    type: SELECT_IMAGE,
    name: selectedImage
  }
}

export const UPLOAD_IMAGE_REQUEST = 'UPLOAD_IMAGE_REQUEST';
export function uploadImageRequest() {
  return {
    type: UPLOAD_IMAGE_REQUEST,
  }
}

export const UPLOAD_IMAGE_SUCCESS = 'UPLOAD_IMAGE_SUCCESS';
export function uploadImageSuccess(name) {
  return {
    type: UPLOAD_IMAGE_SUCCESS,
    name
  }
}

export const UPLOAD_IMAGE_FAILURE = 'UPLOAD_IMAGE_FAILURE';
export function uploadImageFailure(error) {
  return {
    type: UPLOAD_IMAGE_FAILURE,
    error
  }
}

export const DELETE_IMAGE_REQUEST = 'DELETE_IMAGE_REQUEST';
export function deleteImageRequest() {
  return {
    type: DELETE_IMAGE_REQUEST
  }
}


export const DELETE_IMAGE_SUCCESS = 'DELETE_IMAGE_SUCCESS';
export function deleteImageSuccess() {
  return {
    type: DELETE_IMAGE_SUCCESS
  }
}

export const DELETE_IMAGE_FAILURE = 'DELETE_IMAGE_FAILURE';
export function deleteImageFailure(error) {
  return {
    type: DELETE_IMAGE_FAILURE,
    error
  }
}
