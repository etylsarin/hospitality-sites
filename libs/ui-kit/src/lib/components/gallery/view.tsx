'use client';

import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeInBottom } from '../../configs';
import { GALLERY_VIEW, useGallery } from './context';

const GalleryCarousel = dynamic(
  () => import('./gallery-carousel')
);

function renderGalleryContent(
  view: GALLERY_VIEW | string,
  initialSlide: number
) {
  switch (view) {
    case 'MODAL_GALLERY':
      return <GalleryCarousel data={[]} initialSlide={initialSlide} />;
    default:
      return null;
  }
}

export default function GalleryCarouselView() {
  const { open, view, initialSlide } = useGallery();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={fadeInBottom().from}
          animate={fadeInBottom(0.4).to}
          exit={fadeInBottom().from}
          variants={fadeInBottom()}
          className="fixed inset-0 z-[999] overflow-hidden bg-white"
        >
          {view && renderGalleryContent(view, initialSlide)}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
