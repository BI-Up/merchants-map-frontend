import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import Sidebar from "./components/layout/Sidebar";
import { InfoWindow, Map } from "@vis.gl/react-google-maps";
import { postData } from "./api/api";
import { Box, CircularProgress } from "@mui/material";
import Header from "./components/layout/Header";
import { convertToGeoJSON } from "./helper";
import ClusteredMarkers from "./components/ClusteredMarkers";
import { Feature, FeatureCollection, Point } from "geojson";
import InfoWindowContent from "./components/InfoWindowContent";
import { ATHENS, GREECE_BOUNDS } from "./constants";

const MerchantsMap = () => {
  const [geojson, setGeojson] = useState<FeatureCollection<Point> | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "gr">("gr");

  const [stores, setStores] = useState({
    allStores: null,
    filteredStores: null,
  });

  const { allStores, filteredStores } = stores;

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

  const fetchStores = useCallback(async () => {
    try {
      const payload = {
        merchant_filter: queryParams,
      };

      const response = await postData(payload);
      if (allStores === null)
        setStores((prevState) => ({ ...prevState, allStores: response }));
      setStores((prevState) => ({ ...prevState, filteredStores: response }));
      setGeojson(convertToGeoJSON(response));
    } catch (err) {
      setState((prevState) => ({
        ...prevState,
        error: err.message || "Unknown error",
      }));
    } finally {
      setState((prevState) => ({ ...prevState, loading: false }));
    }
  }, [queryParams]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const handleSelectedTowns = (towns: string[]) => {
    const enFormattedTowns = towns.map((town) => {
      if (selectedLanguage === "gr") {
        const merchant = allStores.find(
          (merchant) => merchant.town_gr === town,
        );
        return merchant ? merchant.town_en : town;
      }
      return town;
    });
    const joinedTowns = enFormattedTowns.join(",");
    setQueryParams((prevState) => ({
      ...prevState,
      town: joinedTowns,
    }));
  };

  const handleSelectedProducts = (products: string[]) => {
    const joinedProducts = products.join(",");

    setQueryParams((prevState) => ({
      ...prevState,
      accepted_products: joinedProducts,
    }));
  };

  const handleIsHerocorp = (is_herocorp: boolean) => {
    setQueryParams((prevState) => ({
      ...prevState,
      is_hero_corp: is_herocorp,
    }));
  };

  const handleSelectedCategories = (categories: string[]) => {
    const enFormattedCategories = categories.map((category) => {
      if (selectedLanguage === "gr") {
        const merchant = allStores.find(
          (merchant) => merchant.mcc_category_gr === category,
        );
        return merchant ? merchant.mcc_category_en : category;
      }
      return category;
    });

    const joinedCategories = enFormattedCategories.join(",");

    setQueryParams((prevState) => ({
      ...prevState,
      mcc_category: joinedCategories,
    }));
  };

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
          data={filteredStores}
          geojson={geojson}
          setInfoWindowData={setInfoWindowData}
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
                >
                  <InfoWindowContent
                    info={infoWindowData?.features[0].properties}
                    key={infoWindowData?.features[0].properties.vat_name_gr}
                    language={selectedLanguage}
                  />
                </InfoWindow>
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
