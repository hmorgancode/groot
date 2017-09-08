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
