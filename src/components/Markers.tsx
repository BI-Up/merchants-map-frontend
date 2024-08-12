import { AdvancedMarker, InfoWindow, useMap } from "@vis.gl/react-google-maps";
import * as React from "react";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Marker, MarkerClusterer } from "@googlemaps/markerclusterer";
// @ts-ignore
// import marker from "../../assets/marker.svg";
import marker from "../../assets/marker.png";
import { merchantsResponse } from "../type";
import { Box } from "@mui/material";
import { smoothZoom } from "../helper";

interface MarkersProps {
  data: merchantsResponse[] | [];
  openLocation: Object | number | null;
  setOpenLocation: Dispatch<SetStateAction<Object | number | null>>;
  language: "en" | "gr";
}

const Markers = ({
  data,
  openLocation,
  setOpenLocation,
  language,
}: MarkersProps) => {
  const map = useMap();
  const clusterer = useRef<MarkerClusterer | null>(null);
  const markersRef = useRef<{ [key: string]: Marker }>({});

  const handleClick = useCallback(
    (ev: google.maps.MapMouseEvent, key: string) => {
      if (!map) return;
      if (!ev.latLng) return;

      map.panTo(ev.latLng);

      smoothZoom(map, 18, setOpenLocation, key);
    },
    [map, setOpenLocation],
  );
  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({
        map,
        renderer: {
          render: ({ markers, position: position, count }) => {
            console.log("position:", position);
            return new google.maps.Marker({
              position,
              map,
              label: {
                text: String(count),
                color: "white",
                fontWeight: "bold",
                fontSize: "16px",
              },
              // icon: "/assets/cluster.svg",
              icon: "/assets/cluster.png",
              opacity: 0.98,
              zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
              optimized: true,
            });
          },
        },
        onClusterClick: (event, cluster) => {
          map.panTo(event.latLng);
          if (cluster.markers.length > 2)
            smoothZoom(map, 12, setOpenLocation, clusterer.current);
          else smoothZoom(map, 18, setOpenLocation, clusterer.current);
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
    }
  }, [data]);

  const setMarkerRef = (marker: google.maps.Marker | null, key: number) => {
    if (marker) {
      markersRef.current[key] = marker;
    } else {
      delete markersRef.current[key];
    }

    // Update clusterer after setting marker reference
    if (clusterer.current) {
      const markersArray = Object.values(markersRef.current);
      console.log("markersArray", markersArray);
      clusterer.current.clearMarkers();
      clusterer.current.addMarkers(markersArray);
    }
  };

  return (
    <>
      {data &&
        data.map((mark: merchantsResponse, index) => (
          <Box key={index}>
            <AdvancedMarker
              key={index}
              position={{
                lat: Number(mark?.latitude),
                lng: Number(mark?.longitude),
              }}
              ref={(marker) => setMarkerRef(marker, index)}
              clickable={true}
              onClick={(ev: google.maps.MapMouseEvent) =>
                handleClick(ev, index)
              }
            >
              <img src={marker} alt={mark?.vat_name_en} width={"40px"} />
            </AdvancedMarker>

            {openLocation === index && (
              <>
                <InfoWindow
                  position={{
                    lat: Number(mark.latitude),
                    lng: Number(mark.longitude),
                  }}
                  onCloseClick={() => setOpenLocation(null)}
                  shouldFocus={true}
                  maxWidth={250}
                >
                  <Box
                    sx={{
                      paddingBottom: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-start",
                      alignItems: "flex-start",
                    }}
                  >
                    {mark.is_hero_corp && (
                      <Box
                        sx={{
                          backgroundColor: "#F59100",
                          borderRadius: 100,
                          px: 1,
                          fontSize: "14px",
                          fontWeight: 600,
                          color: "white",
                          width: 130,
                          mb: 0.5,
                        }}
                      >
                        Cashback partner
                      </Box>
                    )}
                    <Box sx={{ fontSize: "15px", mb: 0.5 }}>
                      {mark[`mcc_category_${language}`]}
                    </Box>
                    <Box sx={{ fontWeight: "bold", fontSize: "20px", mb: 0.5 }}>
                      {mark[`brand_name_${language}`] ?? "Brand Name"}
                    </Box>
                    <Box
                      sx={{
                        fontSize: "14px",
                        mb: 0.5,
                        textTransform: "capitalize",
                        fontWeight: "normal",
                      }}
                    >
                      {mark[`address_${language}`]},{mark[`region_${language}`]}
                      ,{mark.zip_code}
                    </Box>
                    <Box display={"flex"} sx={{ mb: 0.5 }}>
                      {mark?.accepted_products.map((product) => (
                        <Box mr={0.5}>•{product} </Box>
                      ))}
                    </Box>
                  </Box>
                </InfoWindow>
              </>
            )}
          </Box>
        ))}
    </>
  );
};

export default Markers;
