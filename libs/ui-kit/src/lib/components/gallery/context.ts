'use client';

import { atom, useSetAtom, useAtomValue } from 'jotai';

export type GALLERY_VIEW = 'MODAL_GALLERY';

const galleryAtom = atom({
  open: false,
  view: 'MODAL_GALLERY',
  initialSlide: 1,
});

export const useGallery = () => {
  const gallery = useAtomValue(galleryAtom);
  const setGallery = useSetAtom(galleryAtom);

  const openGallery = (view: GALLERY_VIEW, initialSlide?: number) => {
    setGallery({
      ...gallery,
      view,
      open: true,
      initialSlide: initialSlide ?? 1,
    });
  }

  const closeGallery = () => {
    setGallery({
      ...gallery,
      open: false,
    });
  }

  return {
    ...gallery,
    openGallery,
    closeGallery,
  };
}
