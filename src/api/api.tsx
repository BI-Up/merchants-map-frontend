import axios from "axios";

interface filterParams {
  town: string;
  accepted_products: string;
  region: string;
  is_hero_corp: boolean;
  mcc_category: string;
}

interface points {
  latitude: string;
  longitude: string;
}

interface requestPayload {
  merchant_filter: filterParams | {};
  northwest_point?: points;
  southwest_point?: points;
}

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL;

export const getInitialCoordinates = async () => {
  try {
    const response = await axios.get(BACKEND_BASE_URL + "/merchants");
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getFilteredCoordinates = async (
  payload: filterParams | {},
  language: "en" | "gr",
) => {
  try {
    const response = await axios.post(
      BACKEND_BASE_URL + "/merchants/search",

      { merchant_filter: payload, language },
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}; //payload

export const getMarkerInfo = async (id: number) => {
  try {
    const response = await axios.get(BACKEND_BASE_URL + `/merchants/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getFilters = async (
  filter_value: string,
  language?: "en" | "gr",
) => {
  try {
    const response = await axios.get(BACKEND_BASE_URL + "/filters/values", {
      params: {
        filter_label: filter_value,
        language,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
