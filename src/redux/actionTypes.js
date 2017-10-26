//// AppConductor

export const GOTO_PLANTS = 'GOTO_PLANTS';
export function goToPlants() {
  return {
    type: GOTO_PLANTS
  }
}

export const GOTO_BOARDS = 'GOTO_BOARDS';
export function goToBoards() {
  return {
    type: GOTO_BOARDS
  }
}

//// ModalConductor

export const OPEN_MODAL = 'OPEN_MODAL';
export function openModal(modalType, modalTarget) {
  return {
    type: OPEN_MODAL,
    modalType,
    modalTarget
  };
}

export const CLOSE_MODAL = 'CLOSE_MODAL';
export function closeModal() {
  return {
    type: CLOSE_MODAL
  }
}

//// NavBar

export const TOGGLE_EDIT_MODE = 'TOGGLE_EDIT_MODE';
export function toggleEditMode() {
  return {
    type: TOGGLE_EDIT_MODE
  }
}
