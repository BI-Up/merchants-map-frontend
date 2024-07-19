import { AdvancedMarker, InfoWindow, useMap } from "@vis.gl/react-google-maps";
import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Marker, MarkerClusterer } from "@googlemaps/markerclusterer";
// @ts-ignore
import marker from "../../assets/marker.svg";
import { merchantsResponse } from "../type";

interface PoiMarkersProps {
  data: merchantsResponse[] | [];
}

const PoiMarkers = ({ data }: PoiMarkersProps) => {
  const map = useMap();
  const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});
  const clusterer = useRef<MarkerClusterer | null>(null);
  const [openLocation, setOpenLocation] = useState(null);

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
      {data &&
        data.map(
          (poi: merchantsResponse) =>
            poi.latitude != null &&
            poi.longitude != null && (
              <>
                <AdvancedMarker
                  key={poi.vat_name_en}
                  position={{
                    lat: Number(poi?.latitude),
                    lng: Number(poi?.longitude),
                  }}
                  ref={(marker) => setMarkerRef(marker, poi?.vat_name_en)}
                  clickable={true}
                  onClick={(ev: google.maps.MapMouseEvent) =>
                    handleClick(ev, poi?.vat_name_en)
                  }
                >
                  <img src={marker} alt={poi?.vat_name_en} width={"30px"} />
                </AdvancedMarker>

                {openLocation === poi.vat_name_en && (
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
              </>
            ),
        )}
    </>
  );
};

export default PoiMarkers;
