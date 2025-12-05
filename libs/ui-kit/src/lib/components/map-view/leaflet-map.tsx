'use client';

import { FunctionComponent } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { MapViewProps } from './map-view';

// Fix for default marker icons in Leaflet with bundlers
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

export const LeafletMap: FunctionComponent<MapViewProps> = ({
  mapContainerClassName,
  geopoint,
  markerLabel,
}) => {
  return (
    <MapContainer
      center={[geopoint.lat, geopoint.lng]}
      zoom={16}
      scrollWheelZoom={false}
      className={mapContainerClassName}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[geopoint.lat, geopoint.lng]}>
        {markerLabel && <Popup>{markerLabel}</Popup>}
      </Marker>
    </MapContainer>
  );
};

LeafletMap.displayName = 'LeafletMap';
