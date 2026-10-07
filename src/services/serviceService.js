import axios from "axios";

const API_URL = "http://localhost:5000/api/services";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

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

export const createService = async (serviceData) => {
  const response = await axios.post(
    API_URL,
    serviceData,
    getAuthHeaders()
  );

  return response.data;
};

export const getMyServices = async () => {
  const response = await axios.get(
    `${API_URL}/my`,
    getAuthHeaders()
  );

  return response.data;
};

export const updateService = async (id, serviceData) => {
  const response = await axios.patch(
    `${API_URL}/${id}`,
    serviceData,
    getAuthHeaders()
  );

  return response.data;
};

export const deleteService = async (id) => {
  const response = await axios.delete(
    `${API_URL}/${id}`,
    getAuthHeaders()
  );

  return response.data;
};