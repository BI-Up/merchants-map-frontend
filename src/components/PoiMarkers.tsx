import { AdvancedMarker, InfoWindow, useMap } from "@vis.gl/react-google-maps";
import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Marker, MarkerClusterer } from "@googlemaps/markerclusterer";
// @ts-ignore
import marker from "../../assets/marker.svg";
import { merchantsResponse } from "../type";
import { Box } from "@mui/material";

interface PoiMarkersProps {
  data: merchantsResponse[] | [];
}

const PoiMarkers = ({ data }: PoiMarkersProps) => {
  const map = useMap();

  const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});
  const clusterer = useRef<MarkerClusterer | null>(null);
  const [openLocation, setOpenLocation] = useState(null);
  const markersRef = useRef<{ [key: string]: Marker }>({});

  const handleClick = useCallback(
    (ev: google.maps.MapMouseEvent, key: string) => {
      if (!map) return;
      if (!ev.latLng) return;
      console.log("marker clicked: ", ev.latLng.toString());
      map.panTo(ev.latLng);
      setOpenLocation(key);
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
    return () => {
      clusterer.current?.clearMarkers();
    };
  }, [map]);

  // Update clusterer with markers
  useEffect(() => {
    if (!clusterer.current) return;

    const markersArray = Object.values(markersRef.current);

    if (markersArray.length > 0) {
      clusterer.current.clearMarkers();
      clusterer.current.addMarkers(markersArray);
    } else {
      console.log("No markers to update in clusterer");
    }
  }, [data]);

  const setMarkerRef = (marker: google.maps.Marker | null, key: number) => {
    if (marker) {
      markersRef.current[key] = marker;
    } else {
      delete markersRef.current[key];
    }
    console.log("Markers updated:", markersRef.current);

    // Update clusterer after setting marker reference
    if (clusterer.current) {
      const markersArray = Object.values(markersRef.current);
      console.log("Updating clusterer with markers:", markersArray);
      clusterer.current.clearMarkers();
      clusterer.current.addMarkers(markersArray);
    }
  };
  return (
    <>
      {data &&
        data.map((poi: merchantsResponse, index) => (
          <Box key={index}>
            <AdvancedMarker
              key={index}
              position={{
                lat: Number(poi?.latitude),
                lng: Number(poi?.longitude),
              }}
              ref={(marker) => setMarkerRef(marker, index)}
              clickable={true}
              onClick={(ev: google.maps.MapMouseEvent) =>
                handleClick(ev, index)
              }
            >
              <img src={marker} alt={poi?.vat_name_en} width={"30px"} />
            </AdvancedMarker>

            {openLocation === index && (
              <>
                <InfoWindow
                  position={{
                    lat: Number(poi.latitude),
                    lng: Number(poi.longitude),
                  }}
                  onCloseClick={() => setOpenLocation(null)}
                >
                  {" "}
                  <p>{poi.vat_name_en}</p>{" "}
                </InfoWindow>
              </>
            )}
          </Box>
        ))}
    </>
  );
};

export default PoiMarkers;
