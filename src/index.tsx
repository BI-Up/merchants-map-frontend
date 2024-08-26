import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import Sidebar from "./components/layout/Sidebar";
import {
  InfoWindow,
  Map,
  MapCameraChangedEvent,
  useMap,
} from "@vis.gl/react-google-maps";
import Markers from "./components/Markers";
import { merchantsGeojson, merchantsResponse } from "./type";
import { getData, postData } from "./api/api";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Header from "./components/layout/Header";
import { convertToGeoJSON } from "./helper";
import ClusteredMarkers from "./components/ClusteredMarkers";
import { Feature, Point } from "geojson";
import InfoWindowContent from "./components/InfoWindowContent";

const MerchantsMap = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [allStores, setAllStores] = useState(null);
  const [geojson, setGeojson] = useState<merchantsGeojson | null>(null);
  const [numClusters, setNumClusters] = useState(0);

  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "gr">("gr");
  const [queryParams, setQueryParams] = useState({
    town: "",
    accepted_products: "",
    region: "",
    is_hero_corp: false,
    mcc_category: "",
  });

  useEffect(() => {
    const fetchAllStores = async () => {
      try {
        const payload = {
          merchant_filter: {},
        };

        const response = await postData(payload);
        setAllStores(response);
        const convertedData = convertToGeoJSON(response);
        setGeojson(convertedData);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllStores();
  }, []);

  useEffect(() => {
    const fetchFilteredStores = async () => {
      try {
        const payload = {
          merchant_filter: queryParams,
        };

        const response = await postData(payload);
        setData(response);
        const convertedData = convertToGeoJSON(response);
        setGeojson(convertedData);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredStores();
  }, [queryParams]);

  console.log("postData", data);

  // useEffect(() => {
  //   if (data) {
  //     const convertedData = convertToGeoJSON(data);
  //     // @ts-ignore
  //     setGeojson(convertedData);
  //   }
  // }, [data]);

  console.log("geo", geojson);

  const [infoWindowData, setInfoWindowData] = useState<{
    anchor: google.maps.marker.AdvancedMarkerElement;
    features: Feature<Point>[];
  } | null>(null);

  console.log("info", infoWindowData);

  // const [merchantsData, setMerchantsData] = useState<any[]>(stores);

  // const [merchantsAllData, setMerchantsAllData] = useState<any[]>([]);
  const [openLocation, setOpenLocation] = useState<Object | number | null>(
    null,
  );

  const handleInfoWindowClose = useCallback(
    () => setInfoWindowData(null),
    [setInfoWindowData, infoWindowData],
  );

  // const mapRef = useRef(null);
  //

  // const handleSelectedTowns = (towns: string[]) => {
  //   const enFormattedTowns = towns.map((town) => {
  //     if (selectedLanguage === "gr") {
  //       const merchant = merchantsAllData.find(
  //         (merchant) => merchant.town_gr === town,
  //       );
  //       return merchant ? merchant.town_en : town;
  //     }
  //     return town;
  //   });
  //   const joinedTowns = enFormattedTowns.join(",");
  //   setQueryParams((prevState) => ({
  //     ...prevState,
  //     town: joinedTowns,
  //   }));
  // };

  // const handleSelectedProducts = (products: string[]) => {
  //   const joinedProducts = products.join(",");
  //
  //   setQueryParams((prevState) => ({
  //     ...prevState,
  //     accepted_products: joinedProducts,
  //   }));
  // };
  //
  // const handleIsHerocorp = (is_herocorp: boolean) => {
  //   setQueryParams((prevState) => ({
  //     ...prevState,
  //     is_hero_corp: is_herocorp,
  //   }));
  // };
  //
  // const handleSelectedCategories = (categories: string[]) => {
  //   const enFormattedCategories = categories.map((category) => {
  //     if (selectedLanguage === "gr") {
  //       const merchant = merchantsAllData.find(
  //         (merchant) => merchant.mcc_category_gr === category,
  //       );
  //       return merchant ? merchant.mcc_category_en : category;
  //     }
  //     return category;
  //   });
  //
  //   const joinedCategories = enFormattedCategories.join(",");
  //
  //   setQueryParams((prevState) => ({
  //     ...prevState,
  //     mcc_category: joinedCategories,
  //   }));
  // };

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

  console.log("queryParams", queryParams);

  // const debounceTimeoutRef = useRef(null);
  // const debounce = (func, delay) => {
  //   return function (...args) {
  //     clearTimeout(debounceTimeoutRef.current);
  //     debounceTimeoutRef.current = setTimeout(() => {
  //       func(...args);
  //     }, delay);
  //   };
  // };
  //
  // const handleCameraChange = useCallback(
  //   debounce((newCamera) => {
  //     console.log('Camera or Zoom changed:', newCamera);
  //     // Your logic here
  //   }, 1000), // Adjust debounce delay as needed
  //   [],
  // );
  //
  // const handleIdle = useCallback(
  //   debounce(() => {
  //     const map = mapRef.current;
  //     if (map) {
  //       const camera = {
  //         zoom: map.getZoom(),
  //         center: map.getCenter(),
  //         heading: map.getHeading(),
  //         tilt: map.getTilt(),
  //       };
  //       console.log('Map interaction completed:', camera);
  //       // Your logic here
  //     }
  //     console.log('Map interaction completed:');
  //   }, 3000), // Adjust debounce delay as needed
  //   [],
  // );
  //
  // useEffect(() => {
  //   const fetchData = () => {
  //     try {
  //       //const res = await getData(queryParams);
  //       setMerchantsData(stores);
  //       setLoading(false);
  //     } catch (err) {
  //       console.error(err);
  //       setLoading(false);
  //     }
  //   };
  //   fetchData();
  // }, []);
  //
  //
  // useEffect(() => {
  //   const fetchData = () => {
  //     try {
  //       // const res = await getData();
  //       setMerchantsAllData(stores);
  //       setLoading(false);
  //     } catch (err) {
  //       console.error(err);
  //       setLoading(false);
  //     }
  //   };
  //   fetchData();
  // }, []);
  //
  const GREECE_BOUNDS = {
    north: 12,
    south: 58,
    west: 12,
    east: 39,
  };

  const ATHENS = { lat: 37.97991702599259, lng: 23.730877354617046 };

  console.log("infoWindow", infoWindowData?.features[0].properties);

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
        {/*<Sidebar*/}
        {/*  handleSelectedTowns={handleSelectedTowns}*/}
        {/*  handleSelectedProducts={handleSelectedProducts}*/}
        {/*  handleIsHerocorp={handleIsHerocorp}*/}
        {/*  handleSelectedCategories={handleSelectedCategories}*/}
        {/*  data={merchantsData}*/}
        {/*  setOpenLocation={setOpenLocation}*/}
        {/*  language={selectedLanguage}*/}
        {/*  languageHandler={setSelectedLanguage}*/}
        {/*/>*/}

        <Sidebar
          handleSelectedTowns={handleSelectedTowns}
          handleSelectedProducts={handleSelectedProducts}
          handleIsHerocorp={handleIsHerocorp}
          handleSelectedCategories={handleSelectedCategories}
          data={data}
          setInfoWindowData={setInfoWindowData}
          language={selectedLanguage}
          languageHandler={setSelectedLanguage}
        />

        <Map
          // mapId="da37f3254c6a6d1c"
          mapId="116fd91f1d18588b"
          disableDefaultUI={true}
          clickableIcons={false}
          defaultZoom={7}
          minZoom={7}
          maxZoom={17}
          defaultCenter={ATHENS}
          onDrag={handleInfoWindowClose}
          onZoomChanged={handleInfoWindowClose}
        >
          {geojson && (
            <ClusteredMarkers
              geojson={geojson}
              setNumClusters={setNumClusters}
              setInfoWindowData={setInfoWindowData}
            >
              {infoWindowData && (
                <InfoWindow
                  onCloseClick={handleInfoWindowClose}
                  anchor={infoWindowData?.anchor}
                  shouldFocus={false}
                >
                  <InfoWindowContent
                    info={infoWindowData?.features[0].properties}
                    key={infoWindowData?.features[0].properties.id}
                    language={selectedLanguage}
                  />
                </InfoWindow>
              )}
            </ClusteredMarkers>
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
