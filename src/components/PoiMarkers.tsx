import { AdvancedMarker, InfoWindow, useMap } from "@vis.gl/react-google-maps";
import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Marker, MarkerClusterer } from "@googlemaps/markerclusterer";
// @ts-ignore
import marker from "../../assets/marker.svg";
import { merchantsResponse } from "../type";
import { Box } from "@mui/material";
import { smoothZoom } from "../helper";

interface PoiMarkersProps {
  data: merchantsResponse[] | [];
  openLocation: any;
  setOpenLocation: any;
  language: "en" | "gr";
}

const PoiMarkers = ({
  data,
  openLocation,
  setOpenLocation,
  language,
}: PoiMarkersProps) => {
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
    [map, setOpenLocation], // Ensure dependencies are included
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
        // onClusterClick: (ev: google.maps.MapMouseEvent) => {
        //   map.panTo(ev.latLng);
        //   smoothZoom(map, 14, setOpenLocation, clusterer.current);
        //   map.setZoom(18);
        // },
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
                    {poi.is_hero_corp && (
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
                      {poi[`mcc_category_${language}`]}
                    </Box>
                    <Box sx={{ fontWeight: "bold", fontSize: "20px", mb: 0.5 }}>
                      {poi[`brand_name_${language}`] ?? "Brand Name"}
                    </Box>
                    <Box
                      sx={{
                        fontSize: "14px",
                        mb: 0.5,
                        textTransform: "capitalize",
                      }}
                    >
                      {poi[`address_${language}`]},{poi[`region_${language}`]},
                      {poi.zip_code}
                    </Box>
                    <Box display={"flex"} sx={{ mb: 0.5 }}>
                      {poi?.accepted_products.map((product) => (
                        <Box>•{product}</Box>
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

export default PoiMarkers;
