"use client"

import { useMemo, useRef, useState } from 'react';
import ReactMapGL, { Layer, Source, Marker} from 'react-map-gl';
import { bboxPolygon } from '@turf/turf';
import { bbox } from "@turf/bbox";
import mapboxgl from 'mapbox-gl';


type GeoJSONFeatureCollection = {
  type: "FeatureCollection";
  features: Array<GeoJSONFeature>;
};

type GeoJSONFeature = {
  type: "Feature";
  geometry: GeoJSONGeometry;
  properties: Record<string, any>;
};

type GeoJSONGeometry = {
  type: "Polygon";
  coordinates: Array<Array<[number, number]>>;
};

const maine: GeoJSONFeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-67.13734, 45.13745],
            [-66.96466, 44.8097],
            [-68.03252, 44.3252],
            [-69.06, 43.98],
            [-70.11617, 43.68405],
            [-70.64573, 43.09008],
            [-70.75102, 43.08003],
            [-70.79761, 43.21973],
            [-70.98176, 43.36789],
            [-70.94416, 43.46633],
            [-71.08482, 45.30524],
            [-70.66002, 45.46022],
            [-70.30495, 45.91479],
            [-70.00014, 46.69317],
            [-69.23708, 47.44777],
            [-68.90478, 47.18479],
            [-68.2343, 47.35462],
            [-67.79035, 47.06624],
            [-67.79141, 45.70258],
            [-67.13734, 45.13745],
          ],
        ],
      },
      properties: {},
    },
  ],
};


export const MapComponent = () => {
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  const popup = useMemo(() => {
    return new mapboxgl.Popup().setText('Hello world!');
  }, [])
  const boundingBox = bboxPolygon(bbox(maine))
    const [viewState, setViewState] = useState({
        latitude: boundingBox.bbox?.[3]!, 
        longitude: boundingBox.bbox?.[2]!, 
        zoom: 10, 
      });
    return (
        <ReactMapGL
          {...viewState}
          mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || ''}
          style={{ width: '100vw', height: '100vh' }}
          onMove={evt => setViewState(evt.viewState)}
          mapStyle="mapbox://styles/mapbox/streets-v9"
        >
              <Marker longitude={boundingBox.bbox?.[2]!} latitude={boundingBox.bbox?.[3]!} color="red" popup={popup} />
        <Source id="maine" type="geojson" data={maine}>
        <Layer
          id="maine-polygon"
          type="fill"
          paint={{
            "fill-color": "#088",
            "fill-opacity": 1,
          }}
        />
        </Source>
        <Source id="bbox" type="geojson" data={boundingBox}>
        <Layer
          id="maine-polygon-boundingBox"
          type="line"
          paint={{
            "line-color": "#088", // Set line color
            "line-width": 2, 
            "line-dasharray": [4, 2],     // Set line width
          }}
        />
        </Source>
        </ReactMapGL>
      );
}