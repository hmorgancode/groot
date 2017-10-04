import { openModal } from './actionTypes';

test('openModal', () => {
  expect(openModal('test')).toEqual({ type: 'OPEN_MODAL', modalType: 'test'});
});
