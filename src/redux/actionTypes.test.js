import { openModal } from './actionTypes';

test('openModal', () => {
  expect(openModal('test')).toBe({ type: 'OPEN_MODAL', modalType: 'test'});
});
