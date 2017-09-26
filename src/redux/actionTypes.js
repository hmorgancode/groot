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
