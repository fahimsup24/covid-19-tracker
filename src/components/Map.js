import React from 'react';
import '../css/Map.css';
import { MapContainer, TileLayer } from 'react-leaflet';

function Map({ countries, center, zoom, }) {
  return (
    <div className='map'>
      <MapContainer 
        className="markercluster-map"
        center={center}
        zoom={zoom}
      >
        <TileLayer
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        attribution='&copy; < href="http://osm.org/copyright">OpenStreetMap'
        />

      </MapContainer>
    </div>
  )
}

export default Map
