import api from "./api";

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

export const getStoreCoupons = async (storeId) => {
  const response = await api.get(`/api/v1/coupons/stores/${storeId}`);

  return response.data;
};
