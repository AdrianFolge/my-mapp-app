"use client";
import { useEffect, useState } from "react";
import ReactMapGL, { Source, Layer, LngLat } from "react-map-gl";
import { booleanPointInPolygon } from "@turf/boolean-point-in-polygon";
import { point } from "@turf/helpers";

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
  const [geoJSONData, setGeoJSONData] = useState<GeoJSONFeatureCollection>(
    maine
  );
  const [mousePosition, setMousePosition] = useState<LngLat | undefined>(
    undefined
  );
  const [mouseDownPosition, setMouseDownPosition] = useState<LngLat | undefined>(
    undefined
  );
  const [isActive, setIsActive] = useState<boolean>(false);
  const [viewState, setViewState] = useState({
    latitude: 45.13745,
    longitude: -67.13734,
    zoom: 10,
  });

  // Mouse down event listener
  const mouseDownFunction = (e: any) => {
    const turfPoint = point([e.lngLat.lng, e.lngLat.lat]);
    const isInside = booleanPointInPolygon(
      turfPoint,
      geoJSONData.features[0].geometry
    );
    if (isInside) {
      setIsActive(true);
      setMouseDownPosition(e.lngLat);

      // Start tracking mouse movements while mouse is down
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", mouseUpFunction);
    }
  };

  // Mouse up event listener
  const mouseUpFunction = () => {
    setIsActive(false);
    setMouseDownPosition(undefined);

    // Remove mousemove event listener
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", mouseUpFunction);
  };

  // Mouse move handler
  const handleMouseMove = (e: any) => {
    if (isActive && mouseDownPosition) {
      const deltaX = e.lngLat.lng - mouseDownPosition.lng;
      const deltaY = e.lngLat.lat - mouseDownPosition.lat;

      const updatedCoordinates = geoJSONData.features[0].geometry.coordinates.map(
        (ring) =>
          ring.map(([lon, lat]) => [lon + deltaX, lat + deltaY] as [number, number])
      );

      setGeoJSONData((prev) => ({
        ...prev,
        features: prev.features.map((feature, index) =>
          index === 0
            ? {
                ...feature,
                geometry: {
                  ...feature.geometry,
                  coordinates: updatedCoordinates as Array<
                    Array<[number, number]>
                  >,
                },
              }
            : feature
        ),
      }));

      // Update mouseDownPosition for incremental movement
      setMouseDownPosition(e.lngLat);
    }
  };

  return (
    <ReactMapGL
      {...viewState}
      mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || ""}
      style={{ width: "100vw", height: "100vh" }}
      {...(!isActive && { onMove: (evt) => setViewState(evt.viewState) })}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      onMouseDown={mouseDownFunction}
    >
      <Source id="maine" type="geojson" data={geoJSONData}>
        <Layer
          id="maine-polygon"
          type="fill"
          paint={{
            "fill-color": "#088",
            "fill-opacity": isActive ? 1 : 0.6,
          }}
        />
        <Layer
          id="maine-outline"
          type="line"
          paint={{
            "line-color": "#000",
            "line-width": 2,
          }}
        />
      </Source>
    </ReactMapGL>
  );
};
