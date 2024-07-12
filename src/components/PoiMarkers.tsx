import { AdvancedMarker, InfoWindow, useMap } from "@vis.gl/react-google-maps";
// @ts-ignore
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Marker, MarkerClusterer } from "@googlemaps/markerclusterer";
// @ts-ignore
import marker from "../../assets/marker.svg";
import { DataItem } from "../type";

const PoiMarkers = (props: { pois: DataItem[] }) => {
  const map = useMap();
  const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});
  const clusterer = useRef<MarkerClusterer | null>(null);
  const [circleCenter, setCircleCenter] = useState(null);
  const [openLocation, setOpenLocation] = useState(null);

  const handleClick = useCallback(
    (ev: google.maps.MapMouseEvent, key: string) => {
      if (!map) return;
      if (!ev.latLng) return;
      console.log("marker clicked: ", ev.latLng.toString());
      map.panTo(ev.latLng);
      setOpenLocation(key);
      setCircleCenter(ev.latLng);
    },
    [],
  );

  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({
        map,
        renderer: {
          render: ({ markers, position: position, count }) => {
            return new google.maps.Marker({
              position,
              label: {
                text: String(count),
                color: "white",
                fontWeight: "bold",
                fontSize: "16px",
              },

              icon: "/assets/cluster.svg",
              opacity: 0.98,
              zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
            });
          },
        },
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

    setMarkers((prev) => {
      if (marker) {
        return { ...prev, [key]: marker };
      } else {
        const newMarkers = { ...prev };
        delete newMarkers[key];
        return newMarkers;
      }
    });
  };

  return (
    <>
      {props.pois.map((poi: DataItem) => (
        <>
          <AdvancedMarker
            key={poi.key}
            position={{ lat: poi.Latitude, lng: poi.Longitude }}
            ref={(marker) => setMarkerRef(marker, poi.VATName_EN)}
            clickable={true}
            onClick={(ev: google.maps.MapMouseEvent) =>
              handleClick(ev, poi.VATName_EN)
            }
          >
            {/*<Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'}  />*/}
            <img src={marker} alt={poi.VATName_EN} width={"30px"} />
          </AdvancedMarker>

          {openLocation === poi.VATName_EN && (
            <>
              <InfoWindow
                position={{ lat: poi.Latitude, lng: poi.Longitude }}
                onCloseClick={() => setOpenLocation(null)}
              >
                {" "}
                <p>{poi.VATName_EN}</p>{" "}
              </InfoWindow>
            </>
          )}
        </>
      ))}
    </>
  );
};

export default PoiMarkers;
