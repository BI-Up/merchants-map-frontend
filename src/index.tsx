import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import Sidebar from "./components/Sidebar";
import { Map, MapCameraChangedEvent, useMap } from "@vis.gl/react-google-maps";
import Markers from "./components/Markers";
import { merchantsResponse } from "./type";
import { getData } from "./api/api";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Header from "./components/Header";
import { c } from "vite/dist/node/types.d-aGj9QkWt";

const MerchantsMap = () => {
  const [loading, setLoading] = useState(true);

  const [merchantsData, setMerchantsData] = useState<merchantsResponse[]>([]);
  const [merchantsAllData, setMerchantsAllData] = useState<merchantsResponse[]>(
    [],
  );
  const [openLocation, setOpenLocation] = useState<Object | number | null>(
    null,
  );
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "gr">("gr");
  const [queryParams, setQueryParams] = useState({
    town: "",
    accepted_products: "",
    region: "",
    is_hero_corp: false,
    mcc_category: "",
  });

  const handleSelectedTowns = (towns: string[]) => {
    const enFormattedTowns = towns.map((town) => {
      if (selectedLanguage === "gr") {
        const merchant = merchantsAllData.find(
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
        const merchant = merchantsAllData.find(
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getData(queryParams);
        setMerchantsData(res);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, [queryParams]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getData();
        setMerchantsAllData(res);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
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
        {!loading && (
          <Sidebar
            handleSelectedTowns={handleSelectedTowns}
            handleSelectedProducts={handleSelectedProducts}
            handleIsHerocorp={handleIsHerocorp}
            handleSelectedCategories={handleSelectedCategories}
            data={merchantsData}
            setOpenLocation={setOpenLocation}
            language={selectedLanguage}
            languageHandler={setSelectedLanguage}
          />
        )}
        <Map
          defaultZoom={9}
          defaultCenter={{ lat: 37.97991702599259, lng: 23.730877354617046 }}
          onCameraChanged={(ev: MapCameraChangedEvent) =>
            console.log(
              "camera changed:",
              ev.detail.center,
              "zoom:",
              ev.detail.zoom,
            )
          }
          mapId="da37f3254c6a6d1c"
          disableDefaultUI={true}
          clickableIcons={false}
        >
          {!loading && (
            <Markers
              data={merchantsData}
              openLocation={openLocation}
              setOpenLocation={setOpenLocation}
              language={selectedLanguage}
            />
          )}
        </Map>
      </Box>
    </Box>
  );
};

export default MerchantsMap;
