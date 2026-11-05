import api from "./guestApi";

export const getNearbyCouponStores = async ({ latitude, longitude }) => {
  const response = await api.get("/api/v1/coupons/nearby/stores", {
    params: {
      latitude,
      longitude,
    },
  });

  return response.data;
};

export const getRegionCouponStores = async (region) => {
  const response = await api.get("/api/v1/coupons/region/stores", {
    params: {
      region,
    },
  });

  return response.data;
};

export const getStoreCoupons = async (storeId, { signal } = {}) => {
  const response = await api.get(`/api/v1/coupons/stores/${encodeURIComponent(storeId)}`, { signal });

  return response.data;
};
