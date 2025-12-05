'use client';

import { FunctionComponent } from 'react';
import dynamic from 'next/dynamic';

interface Geopoint {
  lat: number;
  lng: number;
}

export interface MapViewProps {
  geopoint: Geopoint;
  mapContainerClassName?: string;
  markerLabel?: string;
}

// Dynamically import the actual map component with SSR disabled
const LeafletMap = dynamic(() => import('./leaflet-map').then(mod => mod.LeafletMap), {
  ssr: false,
  loading: () => (
    <div style={{ background: '#e5e7eb', height: '100%', width: '100%' }}>
      <div className="flex items-center justify-center h-full text-gray-500">
        Loading map...
      </div>
    </div>
  ),
});

export const MapView: FunctionComponent<MapViewProps> = (props) => {
  return <LeafletMap {...props} />;
};

MapView.displayName = 'MapView';
