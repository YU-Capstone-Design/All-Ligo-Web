import guestApi from "./guestApi";
import { normalizeStores, readItems, storesNearLocation } from "../utils/guestDiscovery";

export const getNearbyGuestStores = async (location, { signal } = {}) => {
  // This endpoint returns all stores, without coordinate query parameters.
  const response = await guestApi.get("/api/v1/stores/public", { signal });
  return storesNearLocation(normalizeStores(readItems(response.data)), location);
};

export const getGuestStoreContents = async (storeId, { signal } = {}) => {
  const response = await guestApi.get(
    `/api/v1/contents/public/stores/${encodeURIComponent(storeId)}`,
    { signal },
  );
  return readItems(response.data);
};
