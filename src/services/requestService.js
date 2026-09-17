import axios from "axios";

const API_URL = "http://localhost:5000/api/requests";

export const getMyRequests = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${API_URL}/my-requests`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getProviderRequests = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${API_URL}/provider-requests`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const updateRequestStatus = async (requestId, status) => {
  const token = localStorage.getItem("token");

  const response = await axios.patch(
    `${API_URL}/${requestId}/status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};