import axios from "axios";

const API_URL = "http://localhost:5000/api/notifications";

export const getMyNotifications = async (token) => {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getUnreadNotificationCount = async (token) => {
  const response = await axios.get(`${API_URL}/unread-count`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const markNotificationAsRead = async (id, token) => {
  const response = await axios.patch(
    `${API_URL}/${id}/read`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const markAllNotificationsAsRead = async (token) => {
  const response = await axios.patch(
    `${API_URL}/read-all`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const deleteNotification = async (id, token) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};