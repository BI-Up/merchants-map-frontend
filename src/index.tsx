import * as React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import Sidebar from "./components/layout/Sidebar";
import { InfoWindow, Map } from "@vis.gl/react-google-maps";
import { getInitialCoordinates, getMarkerInfo } from "./api/api";
import { Box, CircularProgress } from "@mui/material";
import Header from "./components/layout/Header";
import { convertPointsToGeoJSON } from "./helper";
import ClusteredMarkers from "./components/ClusteredMarkers";
import { Feature, FeatureCollection, Point } from "geojson";
import InfoWindowContent from "./components/InfoWindowContent";
import { ATHENS, GREECE_BOUNDS } from "./constants";

const markerStores = [
  {
    id: 1,
    vat_name_gr: "Greek VAT Name",
    vat_name_en: "English VAT Name",
    brand_name_gr: "Greek Brand Name",
    brand_name_en: "English Brand Name",
    address_gr: "11Ο ΔΗΜΟΤΙΚΟ ΣΧΟΛΕΙΟ ΞΑΝΘΗΣ - ΝΕΑΠΟΛΗ",
    address_en: "11O DIMOTIKO SCHOLEIO XANTHIS - NEAPOLI",
    zip_code: "67133",
    district_gr: "ΞΑΝΘΗΣ",
    district_en: "XANTHIS",
    region_gr: "ΞΑΝΘΗ",
    region_en: "XANTHI",
    town_gr: "ΞΑΝΘΗ",
    town_en: "XANTHI",
    is_hero_corp: false,
    accepted_products: ["Cheque Dejeuner"],
    mcc_category_gr: "Κατηγορία 4",
    mcc_category_en: "Category 4",
    latitude: "41.123323",
    longitude: "24.876545",
  },
  {
    id: 2,
    vat_name_gr: "Greek VAT Name",
    vat_name_en: "English VAT Name",
    brand_name_gr: "Greek Brand Name",
    brand_name_en: "English Brand Name",
    address_gr: "ΜΠΟΤΣΑΡΗ ΜΑΡΚΟΥ 1",
    address_en: "MPOTSARI MARKOU 1",
    zip_code: "69132",
    district_gr: "ΚΟΜΟΤΗΝΗΣ",
    district_en: "KOMOTINIS",
    region_gr: "ΚΟΜΟΤΗΝΗ",
    region_en: "KOMOTINI",
    town_gr: "ΚΟΜΟΤΗΝΗ",
    town_en: "KOMOTINI",
    is_hero_corp: false,
    accepted_products: ["UP Gift", "Cheque Dejeuner"],
    mcc_category_gr: "Κατηγορία 3",
    mcc_category_en: "Category 3",
    latitude: "41.117506",
    longitude: "25.395841",
  },
  {
    id: 3,
    vat_name_gr: "Greek VAT Name",
    vat_name_en: "English VAT Name",
    brand_name_gr: "Greek Brand Name",
    brand_name_en: "English Brand Name",
    address_gr: "ΚΑΤΩ ΝΕΥΡΟΚΟΠΙ",
    address_en: "KATO NEUROKOPI",
    zip_code: "66033",
    district_gr: "ΚΑΤΩ ΝΕΥΡΟΚΟΠΙΟΥ",
    district_en: "KATO NEUROKOPIOU",
    region_gr: "ΚΑΤΩ ΝΕΥΡΟΚΟΠΙ ΔΡΑΜΑΣ",
    region_en: "KATO NEUROKOPI DRAMAS",
    town_gr: "ΚΑΤΩ ΝΕΥΡΟΚΟΠΙ ΔΡΑΜΑΣ",
    town_en: "KATO NEUROKOPI DRAMAS",
    is_hero_corp: false,
    accepted_products: ["UP Eat", "UP Gift", "Cheque Dejeuner"],
    mcc_category_gr: "Κατηγορία 4",
    mcc_category_en: "Category 4",
    latitude: "41.340871",
    longitude: "23.867196",
  },
  {
    id: 4,
    vat_name_gr: "Greek VAT Name",
    vat_name_en: "English VAT Name",
    brand_name_gr: "Greek Brand Name",
    brand_name_en: "English Brand Name",
    address_gr: "ΑΓΙΟΣ ΑΘΑΝΑΣΙΟΣ",
    address_en: "AGIOS ATHANASIOS",
    zip_code: "66300",
    district_gr: "ΔΟΞΑΤΟΥ",
    district_en: "DOXATOU",
    region_gr: "ΑΓΙΟΣ ΑΘΑΝΑΣΙΟΣ ΔΡΑΜΑΣ",
    region_en: "AGIOS ATHANASIOS DRAMAS",
    town_gr: "ΑΓΙΟΣ ΑΘΑΝΑΣΙΟΣ ΔΡΑΜΑΣ",
    town_en: "AGIOS ATHANASIOS DRAMAS",
    is_hero_corp: false,
    accepted_products: ["UP Eat", "UP Gift", "Cheque Dejeuner"],
    mcc_category_gr: "Κατηγορία 4",
    mcc_category_en: "Category 4",
    latitude: "41.073576",
    longitude: "24.23833",
  },
  {
    id: 5,
    vat_name_gr: "Greek VAT Name",
    vat_name_en: "English VAT Name",
    brand_name_gr: "Greek Brand Name",
    brand_name_en: "English Brand Name",
    address_gr: "ΜΑΚΕΔΟΝΟΜΑΧΩΝ",
    address_en: "MAKEDONOMACHON",
    zip_code: "66200",
    district_gr: "ΠΡΟΣΟΤΣΑΝΗΣ",
    district_en: "PROSOTSANIS",
    region_gr: "ΠΡΟΣΟΤΣΑΝΗ",
    region_en: "PROSOTSANI",
    town_gr: "ΠΡΟΣΟΤΣΑΝΗ",
    town_en: "PROSOTSANI",
    is_hero_corp: false,
    accepted_products: ["UP Eat", "UP Gift", "Cheque Dejeuner"],
    mcc_category_gr: "Κατηγορία 4",
    mcc_category_en: "Category 4",
    latitude: "41.182699",
    longitude: "23.977375",
  },
  {
    id: 6,
    vat_name_gr: "Greek VAT Name",
    vat_name_en: "English VAT Name",
    brand_name_gr: "Greek Brand Name",
    brand_name_en: "English Brand Name",
    address_gr: "ΔΟΞΑΤΟ ΔΡΑΜΑΣ",
    address_en: "DOXATO DRAMAS",
    zip_code: "66300",
    district_gr: "ΔΟΞΑΤΟΥ",
    district_en: "DOXATOU",
    region_gr: "ΔΟΞΑΤΟΥ",
    region_en: "DOXATOU",
    town_gr: "ΔΟΞΑΤΟΥ",
    town_en: "DOXATOU",
    is_hero_corp: false,
    accepted_products: ["UP Eat", "UP Gift", "Cheque Dejeuner"],
    mcc_category_gr: "Κατηγορία 4",
    mcc_category_en: "Category 4",
    latitude: "41.09886",
    longitude: "24.226933",
  },
];

const initialRequest = [
  {
    id: 1,
    latitude: 41.123323,
    longitude: 24.876545,
  },
  {
    id: 2,
    latitude: 41.117506,
    longitude: 25.395841,
  },
  {
    id: 3,
    latitude: 41.340871,
    longitude: 23.867196,
  },
  {
    id: 4,
    latitude: 41.073576,
    longitude: 24.23833,
  },
  {
    id: 5,
    latitude: 41.182699,
    longitude: 23.977375,
  },
  {
    id: 6,
    latitude: 41.09886,
    longitude: 24.226933,
  },
];

const MerchantsMap = () => {
  const [geojson, setGeojson] = useState<FeatureCollection<Point> | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "gr">("gr");

  const [stores, setStores] = useState({
    allStores: null,
    filteredStores: null,
  });

  const [coordinates, setCoordinates] = useState({});

  const { allStores, filteredStores } = stores;

  function setItemWithExpiry(key, value) {
    const now = new Date();

    // Set expiration to 1 day (86400000 milliseconds)
    // const ttl = 24 * 60 * 60 * 1000; // 1 day in milliseconds
    const ttl = 10 * 1000; // 10 seconds in milliseconds

    const item = {
      value: value,
      expiry: now.getTime() + ttl,
    };

    localStorage.setItem(key, JSON.stringify(item));
  }

  function getItemWithExpiry(key) {
    const itemStr = localStorage.getItem(key);

    if (!itemStr) {
      return null;
    }

    const item = JSON.parse(itemStr);
    const now = new Date();

    // If the item has expired, remove it from storage and return null
    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }

    return item.value;
  }

  // Store in localStorage with a 1-day expiration
  setItemWithExpiry("initialRequest", initialRequest);

  setTimeout(() => {
    const storedData = getItemWithExpiry("initialRequest");
    console.log(storedData); // If expired, returns null; otherwise, the stored data
  }, 11000); // Wait for 11 seconds to ensure expiration

  console.log(allStores);

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

  const payload = useMemo(
    () => ({
      merchant_filter: queryParams,
    }),
    [queryParams],
  );

  // const fetchStores = useCallback(async () => {
  //   try {
  //     setState((prevState) => ({ ...prevState, loading: true }));
  //     const response = await getInitialCoordinates();
  //     // const response = await postData(payload);
  //     // const response = initialRequest;
  //     if (allStores === null)
  //       setStores((prevState) => ({ ...prevState, allStores: response }));
  //     setStores((prevState) => ({ ...prevState, filteredStores: response }));
  //     setGeojson(convertToGeoJSON(response));
  //   } catch (err) {
  //     setState((prevState) => ({
  //       ...prevState,
  //       error: err.message || "Unknown error",
  //     }));
  //   } finally {
  //     setState((prevState) => ({ ...prevState, loading: false }));
  //   }
  // }, [payload]);

  const fetchInitialCoordinates = useCallback(async () => {
    try {
      setState((prevState) => ({ ...prevState, loading: true }));
      const response = await getInitialCoordinates();
      setCoordinates(response);
      setGeojson(convertPointsToGeoJSON(response));
    } catch (err) {
      setState((prevState) => ({
        ...prevState,
        error: err.message || "Unknown error",
      }));
    } finally {
      setState((prevState) => ({ ...prevState, loading: false }));
    }
  }, []);

  useEffect(() => {
    fetchInitialCoordinates();
  }, [fetchInitialCoordinates]);

  console.log("initial geojson", geojson);

  const fetchMarkerInfo = useCallback(async ({ id }: { id: number }) => {
    return getMarkerInfo(Number(Number(id as number)));
  }, []);

  // const fetchMarkerInfo = ({ id }: { id: number }) => {
  //   const store = markerStores.find((store) => store.id === id);
  //
  //   return store;
  // };

  // useEffect(() => {
  //   fetchStores();
  // }, [fetchStores]);

  const handleSelectedTowns = useCallback(
    (towns: string[]) => {
      const formattedTowns = towns.map((town) => {
        if (selectedLanguage === "gr" && allStores) {
          const merchant = allStores.find(
            (merchant) => merchant.town_gr === town,
          );
          return merchant ? merchant.town_en : town;
        }
        return town;
      });

      setQueryParams((prevState) => ({
        ...prevState,
        town: formattedTowns.join(","),
      }));
    },
    [allStores, selectedLanguage],
  );

  const handleSelectedProducts = useCallback((products: string[]) => {
    setQueryParams((prevState) => ({
      ...prevState,
      accepted_products: products.join(","),
    }));
  }, []);

  const handleIsHerocorp = useCallback((isHerocorp: boolean) => {
    setQueryParams((prevState) => ({
      ...prevState,
      is_hero_corp: isHerocorp,
    }));
  }, []);

  const handleSelectedCategories = useCallback(
    (categories: string[]) => {
      const formattedCategories = categories.map((category) => {
        if (selectedLanguage === "gr" && allStores) {
          const merchant = allStores.find(
            (merchant) => merchant.mcc_category_gr === category,
          );
          return merchant ? merchant.mcc_category_en : category;
        }
        return category;
      });

      setQueryParams((prevState) => ({
        ...prevState,
        mcc_category: formattedCategories.join(","),
      }));
    },
    [allStores, selectedLanguage],
  );

  const handleInfoWindowClose = useCallback(() => {
    setInfoWindowData(null);
  }, []);

  console.log("infowindow", infoWindowData);

  console.log(
    "coordinates",
    infoWindowData?.features[0].geometry.coordinates[0],
  );

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
