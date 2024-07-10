// @ts-ignore
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';

import {AdvancedMarker, APIProvider, InfoWindow, Map, MapCameraChangedEvent, useMap} from '@vis.gl/react-google-maps';

import type {Marker} from '@googlemaps/markerclusterer';
import {MarkerClusterer} from '@googlemaps/markerclusterer';
// @ts-ignore
import marker from '../assets/marker.svg'
import {Box} from "@mui/material";
import Sidebar from "./components/Sidebar";

type Poi ={ key: string, location: google.maps.LatLngLiteral }
const locations: Poi[] = [
  {key: 'operaHouse', location: { lat: 37.979274309954604, lng: 23.729697182849478  }},
  {key: 'tarongaZoo', location: { lat: 37.97946881669508, lng: 23.72608156508297 }},
  {key: 'manlyBeach', location: { lat: 37.977489897782625, lng: 23.725019410366027 }},
  {key: 'test', location: { lat: 37.96920892859149, lng: 23.703532900837516 }},
  {key: 'test1', location: { lat: 37.97026577410168, lng: 23.704327220978314 }},

];

const data = {
  locationsData : ['Athens', 'Thessaloniki', 'Patra', 'Ioannina'],
  productsData : ['GoForEat', 'Up Gift', 'Cheque Dejeuner'],
  categoriesData: ['All', 'Supermarkets, Restaurants', 'Coffee']
}


const App = () => (
  <APIProvider apiKey={process.env.GOOGLE_MAPS_API_KEY} onLoad={() => console.log('Maps API has loaded.')}>
  <Box sx={{height: '100vh', width:'100vw', display: 'flex'}}>
  <Sidebar data={data} />


    <Map
      defaultZoom={10}
      defaultCenter={{ lat: 37.97991702599259, lng: 23.730877354617046 }}
      onCameraChanged={ (ev: MapCameraChangedEvent) =>
        console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
      }
      mapId='da37f3254c6a6d1c'
      >
    <PoiMarkers pois={locations} />
    </Map>
  </Box>
  </APIProvider>
);

const PoiMarkers = (props: { pois: Poi[] }) => {
  const map = useMap();
  const [markers, setMarkers] = useState<{[key: string]: Marker}>({});
  const clusterer = useRef<MarkerClusterer | null>(null);
  const [circleCenter, setCircleCenter] = useState(null)
  const [openLocation, setOpenLocation] = useState(null)

  const handleClick = useCallback((ev: google.maps.MapMouseEvent, key: string
  ) => {
    if(!map) return;
    if(!ev.latLng) return;
    console.log('marker clicked: ', ev.latLng.toString());
    map.panTo(ev.latLng);
  setOpenLocation(key)
    setCircleCenter(ev.latLng);
  }, []);


  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({map,
        renderer: {
          render: ({markers, position: position, count}) => {
            return new google.maps.Marker({
              position,
              label: {
                text: String(count),
                color: "white",
                fontWeight: 'bold',
                fontSize: '16px'
              },

              icon: '/assets/cluster.svg',
              opacity: 0.98,
              zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,

            });
          }
        }
      });
    }
  }, [map]);

  // Update markers, if the markers array has changed
  useEffect(() => {
    clusterer.current?.clearMarkers();
    clusterer.current?.addMarkers(Object.values(markers));
  }, [markers]);

  const setMarkerRef = (marker: Marker | null, key: string) => {
    if (marker && markers[key]) return;
    if (!marker && !markers[key]) return;

    setMarkers(prev => {
      if (marker) {
        return {...prev, [key]: marker};
      } else {
        const newMarkers = {...prev};
        delete newMarkers[key];
        return newMarkers;
      }
    });
  };

  return (
    <>
      {/*<Circle*/}
      {/*    radius={800}*/}
      {/*    center={circleCenter}*/}
      {/*    strokeColor={'#0c4cb3'}*/}
      {/*    strokeOpacity={1}*/}
      {/*    strokeWeight={3}*/}
      {/*    fillColor={'#3b82f6'}*/}
      {/*    fillOpacity={0.3}*/}
      {/*  />*/}
      {props.pois.map( (poi: Poi) => (
          <>

        <AdvancedMarker
          key={poi.key}
          position={poi.location}
          ref={marker => setMarkerRef(marker, poi.key)}
          clickable={true}
          onClick={(ev: google.maps.MapMouseEvent)=> handleClick(ev, poi.key)}
          >
            {/*<Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'}  />*/}
            <img src={marker} alt={poi.key} width={'30px'}  />

        </AdvancedMarker>

            {openLocation === poi.key  && <InfoWindow position={poi.location} onCloseClick={()=>setOpenLocation(null)}> <p>{poi.key}</p> </InfoWindow>}

          </>
      ))}
    </>
  );
};

export default App;

const root = createRoot(document.getElementById('app'));
root.render(
      <App />
  );

