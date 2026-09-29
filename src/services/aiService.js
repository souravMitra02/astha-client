import axios from "axios";

const API_URL = "http://localhost:5000/api/ai";

export const askAI = async (message) => {
  const response = await axios.post(API_URL, {
    message,
  });

  return response.data;
};