'use client';

import clsx from 'clsx';
import { atom, useAtom } from 'jotai';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { FunctionComponent, useEffect } from 'react';

import { Drawer } from '../drawer/drawer';
import { SanityConfigProps } from 'queries';

const PhotoGallery = dynamic(
  () => import('./photo-gallery')
);
// const SideMenu = dynamic(() => import('@/components/ui/drawers/side-menu'));
// const Filter = dynamic(() => import('@/components/explore/filter'));
// const BookingFormModal = dynamic(
//   () => import('@/components/ui/drawers/booking-form-drawer')
// );

export type DRAWER_VIEW =
  | 'PHOTO_GALLERY'
  | 'SIDE_MENU'
  | 'BOOKING_FORM'
  | 'FILTER_MENU';

// render drawer contents
function renderDrawerContent(view: DRAWER_VIEW | string, sanity: SanityConfigProps) {
  switch (view) {
    case 'PHOTO_GALLERY':
      return <PhotoGallery sanity={sanity} />;
    // case 'SIDE_MENU':
    //   return <SideMenu />;
    // case 'FILTER_MENU':
    //   return <Filter />;
    // case 'BOOKING_FORM':
    //   return <BookingFormModal />;
    default:
      return null;
  }
}

type DrawerPropsType = {
  isOpen: boolean;
  placement?: 'top' | 'right' | 'bottom' | 'left';
  view: string;
  customSize?: string;
};

export const drawerStateAtom = atom<DrawerPropsType>({
  isOpen: false,
  placement: 'left',
  view: 'SIDE_MENU',
});

export interface DrawerContainerProps {
  sanity: SanityConfigProps;
}

export const DrawerContainer: FunctionComponent<DrawerContainerProps> = ({ sanity }) => {
  const [drawerSate, setDrawerState] = useAtom(drawerStateAtom);
  const pathName = usePathname();
  useEffect(() => {
    setDrawerState({ ...drawerSate, isOpen: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathName]);

  return (
    <>
      <Drawer
        isOpen={drawerSate.isOpen}
        placement={drawerSate.placement}
        customSize={drawerSate.customSize}
        containerClassName={clsx(
          drawerSate.view === 'BOOKING_FORM' && 'bg-white',
          drawerSate.view === 'PHOTO_GALLERY' && 'bg-white overflow-y-auto'
        )}
        onClose={() => setDrawerState({ ...drawerSate, isOpen: false })}
      >
        {renderDrawerContent(drawerSate.view, sanity)}
      </Drawer>
    </>
  );
};

DrawerContainer.displayName = 'DrawerContainer';
