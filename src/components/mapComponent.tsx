"use client"

import { useState } from 'react';
import ReactMapGL from 'react-map-gl';

export const MapComponent = () => {
    const [viewState, setViewState] = useState({
        latitude: 0, 
        longitude: 0, 
        zoom: 10, 
      });
    return (
        <ReactMapGL
          {...viewState}
          mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || ''}
          style={{ width: '100vw', height: '100vh' }}
          onMove={evt => setViewState(evt.viewState)}
          mapStyle="mapbox://styles/mapbox/streets-v9"
        />
      );
}