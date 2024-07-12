import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { Map, MapCameraChangedEvent } from "@vis.gl/react-google-maps";
import PoiMarkers from "./PoiMarkers";
import { DataItem } from "../type";
import { getData } from "../api";

type Poi = { key: string; location: google.maps.LatLngLiteral };

const mockData: DataItem[] = [
  {
    VATName_GR: "LOUK",
    VATName_EN: "LOUK",
    BrandName_GR: null,
    BrandName_EN: null,
    Address_GR: "ΣΩΤΗΡΟΣ ΔΙΟΣ 7",
    Address_EN: "SOTIROS DIOS 7",
    ZIPCode: "18535",
    District_GR: "ΑΤΤΙΚΗ",
    District_EN: "ATTICA",
    Region_GR: "ΠΕΙΡΑΙΑΣ",
    Region_EN: "PIRAEUS",
    Town_GR: "ΠΕΙΡΑΙΑΣ",
    Town_EN: "PIRAEUS",
    IsHerocorp: 0,
    AcceptedProducts: ["Up Eat", "Up Gift", "Cheque Dejeuner"],
    MCCCategory_GR: "AA",
    MCCCategory_EN: "AA",
    Latitude: 37.9425037,
    Longitude: 23.6455373,
  },
  {
    VATName_GR: "ROASTING WAREHOUSE SPECIALTY COFFEE",
    VATName_EN: "ROASTING WAREHOUSE SPECIALTY COFFEE",
    BrandName_GR: null,
    BrandName_EN: null,
    Address_GR: "ΝΤΕΛΑΚΡΟΥΑ 2",
    Address_EN: "DELAKROUA 2",
    ZIPCode: "11745",
    District_GR: "ΑΤΤΙΚΗ",
    District_EN: "ATTICA",
    Region_GR: "ΑΘΗΝΑ",
    Region_EN: "ATHENS",
    Town_GR: "ΑΘΗΝΑ",
    Town_EN: "ATHENS",
    IsHerocorp: 0,
    AcceptedProducts: ["Up Eat", "Cheque Dejeuner"],
    MCCCategory_GR: "AA",
    MCCCategory_EN: "AA",
    Latitude: 37.9566889,
    Longitude: 23.7228246,
  },
  {
    VATName_GR: "FLAT WHITE ARTISAN CAFÉ",
    VATName_EN: "FLAT WHITE ARTISAN CAFÉ",
    BrandName_GR: null,
    BrandName_EN: null,
    Address_GR: "ΚΑΛΛΙΡΟΗΣ 13",
    Address_EN: "KALLIROIS 13",
    ZIPCode: "11743",
    District_GR: "ΑΤΤΙΚΗ",
    District_EN: "ATTICA",
    Region_GR: "ΑΘΗΝΑ",
    Region_EN: "ATHENS",
    Town_GR: "ΑΘΗΝΑ",
    Town_EN: "ATHENS",
    IsHerocorp: 0,
    AcceptedProducts: ["Cheque Dejeuner"],
    MCCCategory_GR: "AA",
    MCCCategory_EN: "AA",
    Latitude: 37.9664767,
    Longitude: 23.731916,
  },
];

const locations = ["ATHENS", "PIRAEUS"];
const products = ["GoForEat, Up Gift", "Cheque Dejeuner"];
const categories = ["All", "Supermarkets, Restaurants", "Coffee"];

const data = {
  locationsData: locations,
  productsData: products,
  categoriesData: categories,
};

const MerchantsMap = () => {
  const [merchantsData, setMerchantsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [queryParams, setQueryParams] = useState({
    town: "athens",
  });

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
  }, []);

  return (
    <>
      <Sidebar data={data} />
      <Map
        defaultZoom={10}
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
      >
        <PoiMarkers pois={mockData} />
      </Map>
    </>
  );
};

export default MerchantsMap;
