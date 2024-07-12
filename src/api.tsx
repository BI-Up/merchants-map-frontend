import axios from "axios";

export const getData = async (queryParams) => {
  try {
    const response = await axios.get("http://10.10.81.124/merchants", {
      params: queryParams,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const getTowns = async () => {
  try {
    const response = await axios.get(
      "http://10.10.81.124/filter-values/?filter_label=town",
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
