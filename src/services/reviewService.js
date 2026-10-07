import axios from "axios";

const API_URL = "http://localhost:5000/api/reviews";

export const createReview = async (
  requestId,
  rating,
  comment
) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    `${API_URL}/${requestId}`,
    {
      rating,
      comment,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getRequestReview = async (requestId) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${API_URL}/request/${requestId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getProviderReviews = async (providerId) => {
  const response = await axios.get(
    `${API_URL}/provider/${providerId}`
  );

  return response.data;
};