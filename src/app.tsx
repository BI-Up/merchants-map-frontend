// @ts-ignore
import React, { useCallback, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";

import {
  APIProvider,
  Map,
  MapCameraChangedEvent,
} from "@vis.gl/react-google-maps";
import { Box } from "@mui/material";
import Sidebar from "./components/Sidebar";
import PoiMarkers from "./components/PoiMarkers";
type Poi = { key: string; location: google.maps.LatLngLiteral };

const locations: Poi[] = [
  {
    key: "operaHouse",
    location: { lat: 37.979274309954604, lng: 23.729697182849478 },
  },
  {
    key: "tarongaZoo",
    location: { lat: 37.97946881669508, lng: 23.72608156508297 },
  },
  {
    key: "manlyBeach",
    location: { lat: 37.977489897782625, lng: 23.725019410366027 },
  },
  {
    key: "test",
    location: { lat: 37.96920892859149, lng: 23.703532900837516 },
  },
  {
    key: "test1",
    location: { lat: 37.97026577410168, lng: 23.704327220978314 },
  },
];

const data = {
  locationsData: ["Athens", "Thessaloniki", "Patra", "Ioannina"],
  productsData: ["GoForEat", "Up Gift", "Cheque Dejeuner"],
  categoriesData: ["All", "Supermarkets, Restaurants", "Coffee"],
};

const App = () => (
  <APIProvider
    apiKey={process.env.GOOGLE_MAPS_API_KEY}
    onLoad={() => console.log("Maps API has loaded.")}
  >
    <Box sx={{ height: "100vh", width: "100vw", display: "flex" }}>
      <Sidebar data={data} />

      <Map
        defaultZoom={10}
        defaultCenter={{ lat: 37.97991702599259, lng: 23.730877354617046 }}
        onCameraChanged={(ev: MapCameraChangedEvent) =>
          console.log(
            "camera changed:",
            ev.detail.center,
            "zoom:",
            ev.detail.zoom,
          )
        }
        mapId="da37f3254c6a6d1c"
      >
        <PoiMarkers pois={locations} />
      </Map>
    </Box>
  </APIProvider>
);

export default App;

const root = createRoot(document.getElementById("app"));
root.render(<App />);
