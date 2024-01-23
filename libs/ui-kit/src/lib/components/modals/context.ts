'use client';

import { atom, useSetAtom, useAtomValue } from 'jotai';

export type MODAL_VIEW =
  | 'SIGN_IN'
  | 'SIGN_UP'
  | 'ADD_REVIEW'
  | 'REPORT_LISTING'
  | 'CONTACT_HOST'
  | 'SEARCH_MODAL'
  | 'SHARE';

const modalAtom = atom({
  open: false,
  view: 'ADD_REVIEW_VIEW',
});

export const useModal = () => {
  const modal = useAtomValue(modalAtom);
  const setModal = useSetAtom(modalAtom);

  const openModal = (view: MODAL_VIEW) => {
    setModal({
      ...modal,
      view,
      open: true,
    });
  }

  const closeModal = () => {
    setModal({
      ...modal,
      open: false,
    });
  }

  return {
    ...modal,
    openModal,
    closeModal,
  };
}
