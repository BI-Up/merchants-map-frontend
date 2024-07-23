import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import Sidebar from "./Sidebar";
import { Map, MapCameraChangedEvent, useMap } from "@vis.gl/react-google-maps";
import PoiMarkers from "./PoiMarkers";
import { merchantsResponse } from "../type";
import { getData } from "../api";
import { Box } from "@mui/material";

const MerchantsMap = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [queryParams, setQueryParams] = useState({
    town: "",
    accepted_products: "",
    region: "",
    is_hero_corp: false,
    mcc_category: "",
  });

  const [merchantsData, setMerchantsData] = useState<merchantsResponse[]>([]);

  const [openLocation, setOpenLocation] = useState(null);

  const handleSelectedTown = (town: string[]) => {
    const townString = town.join(",");
    setQueryParams((prevState) => ({
      ...prevState,
      town: townString,
    }));
  };

  const handleSelectedProducts = (products: string[]) => {
    const productString = products.join(",");

    setQueryParams((prevState) => ({
      ...prevState,
      accepted_products: productString,
    }));
  };

  const handleIsHerocorp = (is_herocorp: boolean) => {
    setQueryParams((prevState) => ({
      ...prevState,
      is_hero_corp: is_herocorp,
    }));
  };

  const handleSelectedCategory = (category: string[]) => {
    const categorieString = category.join(",");

    setQueryParams((prevState) => ({
      ...prevState,
      mcc_category: categorieString,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getData(queryParams);
        setMerchantsData(res);
        setLoading(false);
      } catch (err) {
        setError("An error occurred while fetching the data.");
        setLoading(false);
      }
    };
    fetchData();
  }, [queryParams]);

  return (
    <Box position={"relative"} width={"100%"} display={"flex"}>
      {!loading && (
        <Sidebar
          handleSelectedTown={handleSelectedTown}
          handleSelectedProducts={handleSelectedProducts}
          handleIsHerocorp={handleIsHerocorp}
          handleSelectedCategory={handleSelectedCategory}
          data={merchantsData}
          setOpenLocation={setOpenLocation}
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
      >
        {!loading && (
          <PoiMarkers
            data={merchantsData}
            openLocation={openLocation}
            setOpenLocation={setOpenLocation}
          />
        )}
      </Map>
    </Box>
  );
};

export default MerchantsMap;
