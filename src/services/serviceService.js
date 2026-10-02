import axios from "axios";

const API_URL = "http://localhost:5000/api/services";

export const getAllServices = async () => {
  const response = await axios.get(API_URL);

  return response.data;
};

export const getSingleService = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);

  return response.data;
};

export const findAvailableServices = async (
  category,
  latitude,
  longitude
) => {
  const response = await axios.get(`${API_URL}/available`, {
    params: {
      category,
      latitude,
      longitude,
    },
  });

  return response.data;
};