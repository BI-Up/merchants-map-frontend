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

const MerchantsMap = () => {
  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState(null);
  const [filteredStores, setFilteredStores] = useState(null);
  const [allStores, setAllStores] = useState(null);
  const [geojson, setGeojson] = useState<FeatureCollection<Point> | null>(null);
  const [numClusters, setNumClusters] = useState(0);
  const [selectedListItem, setSelectedListItem] = useState(null);

  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "gr">("gr");

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

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const payload = {
          merchant_filter: queryParams,
        };

        const response = await postData(payload);
        if (allStores === null) setAllStores(response);
        setFilteredStores(response);
        const convertedData = convertToGeoJSON(response);
        setGeojson(convertedData);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
        setIsFetching(false);
      }
    };

    fetchStores();
  }, [queryParams]);

  const handleInfoWindowClose = useCallback(
    () => setInfoWindowData(null),
    [setInfoWindowData, infoWindowData],
  );
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

  const GREECE_BOUNDS = {
    north: 41.748, // Northernmost point (near the Greece-Albania border)
    south: 34.815, // Southernmost point (Gavdos Island)
    west: 19.374, // Westernmost point (near the Greece-Albania border)
    east: 28.246, // Easternmost point (near the Greece-Turkey border, on the island of Kastellorizo)
  };

  const ATHENS = { lat: 37.97991702599259, lng: 23.730877354617046 };

  console.log("infoWindowData", infoWindowData);

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
          {geojson ? (
            <ClusteredMarkers
              geojson={geojson}
              setNumClusters={setNumClusters}
              setInfoWindowData={setInfoWindowData}
              isFetching={isFetching}
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
          ) : (
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
          )}

          {/*<Markers*/}
          {/*  data={merchantsData}*/}
          {/*  openLocation={openLocation}*/}
          {/*  setOpenLocation={setOpenLocation}*/}
          {/*  language={selectedLanguage}*/}
          {/*/>*/}
        </Map>
      </Box>
    </Box>
  );
};

export default MerchantsMap;
