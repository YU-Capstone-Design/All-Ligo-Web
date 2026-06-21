import api from "./api";

const unwrapResponseData = (data) => data?.data ?? data?.result ?? data;

export const getNotifications = async () => {
  const response = await api.get("/api/v1/notifications");

  return unwrapResponseData(response.data);
};

export const markNotificationAsRead = async (notificationId) => {
  await api.patch(`/api/v1/notifications/${notificationId}/read`);

  return true;
};
