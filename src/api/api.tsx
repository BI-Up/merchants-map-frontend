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

// export const postData = async (payload: requestPayload) => {
//   try {
//     const response = await axios.post("http://localhost/merchants", payload);
//     return response.data;
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// };

// export const getData = async (queryParams?: params) => {
//   try {
//     const response = await axios.get("http://localhost/merchants", {
//       params: queryParams,
//     });
//     return response.data;
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// };

export const getInitialCoordinates = async () => {
  try {
    const response = await axios.get("http://localhost:8000/merchants");
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getFilteredCoordinates = async (payload: filterParams | {}) => {
  try {
    const response = await axios.post(
      "http://localhost/merchants/search",
      payload,
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getMarkerInfo = async (id: number) => {
  try {
    const response = await axios.get(`http://localhost:8000/merchants/${id}`);
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
    const response = await axios.get("http://localhost/filters/values", {
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
