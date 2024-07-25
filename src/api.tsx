import axios from "axios";

interface params {
  town: string;
  accepted_products: string;
  region: string;
  is_hero_corp: boolean;
  mcc_category: string;
}
export const getData = async (queryParams?: params) => {
  try {
    const response = await axios.get("http://localhost/merchants", {
      params: queryParams,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
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
    console.error("Error fetching data:", error);
    throw error;
  }
};
