import * as React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import Sidebar from "./components/layout/Sidebar";
import { InfoWindow, Map } from "@vis.gl/react-google-maps";
import {
  getFilteredCoordinates,
  getInitialCoordinates,
  getMarkerInfo,
} from "./api/api";
import { Box, CircularProgress } from "@mui/material";
import Header from "./components/layout/Header";
import {
  convertPointsToGeoJSON,
  getDataFromLocalStorage,
  setDataToLocalStorage,
} from "./helper";
import ClusteredMarkers from "./components/ClusteredMarkers";
import { Feature, FeatureCollection, Point } from "geojson";
import InfoWindowContent from "./components/InfoWindowContent";
import { ATHENS, GREECE_BOUNDS } from "./constants";

const MerchantsMap = () => {
  const [geojson, setGeojson] = useState<FeatureCollection<Point> | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "gr">("gr");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [state, setState] = useState<{
    loading: boolean;
    error: null | string;
  }>({
    loading: true,
    error: null,
  });

  const { loading, error } = state;

  const [infoWindowData, setInfoWindowData] = useState<{
    anchor: google.maps.marker.AdvancedMarkerElement;
    features: Feature<Point>[];
  } | null>(null);

  const [queryParams, setQueryParams] = useState({
    town: "",
    accepted_products: "",
    region: "",
    is_hero_corp: false,
    mcc_category: "",
  });

  const memoizedQueryParams = useMemo(() => queryParams, [queryParams]);

  // Fetch initial coordinates
  useEffect(() => {
    const fetchInitialCoordinates = async () => {
      setState((prevState) => ({
        ...prevState,
        loading: true,
        error: null,
      }));
      try {
        // Check if stored data exists and is not expired
        const storedData = getDataFromLocalStorage("initialRequest");
        if (storedData) {
          setGeojson(storedData);
        } else {
          // If no stored data, proceed with API fetch
          const response = await getInitialCoordinates();
          const geojson = convertPointsToGeoJSON(response);
          setGeojson(geojson);
          // Store in localStorage with a 1-day expiration
          setDataToLocalStorage("initialRequest", geojson);
        }
      } catch (err) {
        setState((prevState) => ({
          ...prevState,
          loading: false,
          error: err.message || "Unknown error",
        }));
      } finally {
        setState((prevState) => ({
          ...prevState,
          loading: false,
        }));
      }
    };

    fetchInitialCoordinates();
  }, []);

  const fetchFilteredCoordinates = useCallback(async () => {
    if (!submitted) return;
    setState((prevState) => ({ ...prevState, loading: true }));

    try {
      const response = await getFilteredCoordinates(memoizedQueryParams);
      setGeojson(convertPointsToGeoJSON(response));
    } catch (err) {
      setState((prevState) => ({
        ...prevState,
        error: err.message || "Unknown error",
      }));
    } finally {
      setState((prevState) => ({ ...prevState, loading: false }));
    }
  }, [memoizedQueryParams, submitted]);

  useEffect(() => {
    if (!submitted) return;
    fetchFilteredCoordinates();
  }, [fetchFilteredCoordinates, submitted]);

  const fetchMarkerInfo = useCallback(async ({ id }: { id: number }) => {
    try {
      return await getMarkerInfo(Number(Number(id as number)));
    } catch (err) {
      console.error("Error fetching marker info:", err);
    }
  }, []);

  const handleSelectedTowns = useCallback(
    (towns: string[]) => {
      setQueryParams((prevState) => ({
        ...prevState,
        town: towns.join(","),
      }));
    },
    [selectedLanguage, setQueryParams],
  );

  const handleSelectedProducts = useCallback(
    (products: string[]) => {
      setQueryParams((prevState) => ({
        ...prevState,
        accepted_products: products.join(","),
      }));
    },
    [selectedLanguage, setQueryParams],
  );

  const handleIsHerocorp = useCallback(
    (isHerocorp: boolean) => {
      setQueryParams((prevState) => ({
        ...prevState,
        is_hero_corp: isHerocorp,
      }));
    },
    [selectedLanguage, setQueryParams],
  );

  const handleSelectedCategories = useCallback(
    (categories: string[]) => {
      setQueryParams((prevState) => ({
        ...prevState,
        mcc_category: categories.join(","),
      }));
    },
    [selectedLanguage, setQueryParams],
  );

  const handleInfoWindowClose = useCallback(() => {
    setInfoWindowData(null);
  }, []);

  return (
    <Box sx={{ width: "100%", height: "100vh", overflow: "hidden" }}>
      <Header
        language={selectedLanguage}
        languageHandler={setSelectedLanguage}
      />
      <Box
        position={"relative"}
        width={"100%"}
        display={"flex"}
        height={"calc(100vh - 84px)"}
      >
        <Sidebar
          handleSelectedTowns={handleSelectedTowns}
          handleSelectedProducts={handleSelectedProducts}
          handleIsHerocorp={handleIsHerocorp}
          handleSelectedCategories={handleSelectedCategories}
          geojson={geojson}
          setInfoWindowData={setInfoWindowData}
          submitted={submitted}
          setSubmitted={setSubmitted}
          language={selectedLanguage}
          languageHandler={setSelectedLanguage}
        />
        {loading && !geojson ? (
          <Box
            display={"flex"}
            width={"100%"}
            height={"100vh"}
            justifyContent={"center"}
            alignItems={"center"}
            flexDirection={"column"}
          >
            <CircularProgress sx={{ color: "#FF9018" }} size={50} />
          </Box>
        ) : (
          <Map
            // mapId="da37f3254c6a6d1c"
            mapId="116fd91f1d18588b"
            disableDefaultUI={true}
            clickableIcons={false}
            defaultZoom={5}
            minZoom={7}
            maxZoom={17}
            // defaultBounds={GREECE_BOUNDS}
            defaultCenter={ATHENS}
            onDrag={handleInfoWindowClose}
            onZoomChanged={handleInfoWindowClose}
            restriction={{
              strictBounds: false,
              latLngBounds: GREECE_BOUNDS,
            }}
          >
            <ClusteredMarkers
              geojson={geojson}
              setInfoWindowData={setInfoWindowData}
              isLoading={loading}
              fetchMarkerInfo={fetchMarkerInfo}
            >
              {infoWindowData && (
                <InfoWindow
                  onCloseClick={handleInfoWindowClose}
                  anchor={infoWindowData?.anchor ?? null}
                  position={{
                    lat:
                      infoWindowData?.features[0].geometry.coordinates[1] ??
                      null,
                    lng:
                      infoWindowData?.features[0].geometry.coordinates[0] ??
                      null,
                  }}
                  shouldFocus={false}
                  maxWidth={300}
                  children={
                    <InfoWindowContent
                      info={infoWindowData?.features[0].properties}
                      key={infoWindowData?.features[0].properties.vat_name_gr}
                      language={selectedLanguage}
                    />
                  }
                />
              )}
            </ClusteredMarkers>
            )
          </Map>
        )}
      </Box>
    </Box>
  );
};

export default MerchantsMap;
