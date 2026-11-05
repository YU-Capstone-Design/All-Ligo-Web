export const DEFAULT_GUEST_CENTER = { latitude: 35.8338, longitude: 128.7597 };

export const safeWebUrl = (value) => {
  if (typeof value !== "string") return "";
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
};

export const readItems = (data) => {
  if (Array.isArray(data)) return data;
  throw new Error("목록 응답 형식이 올바르지 않아요.");
};

const toNumber = (value) => {
  if ((typeof value !== "number" && typeof value !== "string") || String(value).trim() === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

export const hasCoordinates = (store) =>
  toNumber(store.latitude) !== null && toNumber(store.longitude) !== null &&
  Math.abs(Number(store.latitude)) <= 90 && Math.abs(Number(store.longitude)) <= 180;

export const normalizeStores = (items, { couponOnly = false } = {}) => {
  const stores = new Map();
  for (const item of items) {
    if (!item || item.storeId == null || !hasCoordinates(item)) continue;
    const couponCount = toNumber(item.couponCount) === null ? null : Math.max(0, Math.floor(Number(item.couponCount)));
    const contentCount = toNumber(item.contentCount) === null ? null : Math.max(0, Math.floor(Number(item.contentCount)));
    const hasCoupons = couponCount === null ? couponOnly || item.hasCoupons === true : couponCount > 0;
    const hasContents = contentCount > 0 || item.hasContents === true || item.contents?.length > 0;
    if (!hasCoupons && !hasContents) continue;
    const id = String(item.storeId);
    stores.set(id, {
      id,
      name: item.storeName || "가게",
      latitude: Number(item.latitude),
      longitude: Number(item.longitude),
      address: item.address || item.region || "",
      description: item.description || "",
      imageUrl: safeWebUrl(item.profileImageUrl),
      mapUrl: safeWebUrl(item.mapUrl),
      couponCount,
      contentCount,
      hasCoupons,
      hasContents,
      contents: Array.isArray(item.contents) ? item.contents : undefined,
    });
  }
  return [...stores.values()];
};

export const distanceInMeters = (from, to) => {
  if (!from || !to || !hasCoordinates(from) || !hasCoordinates(to)) return null;
  const rad = (degrees) => degrees * Math.PI / 180;
  const a = Math.sin(rad(to.latitude - from.latitude) / 2) ** 2 +
    Math.cos(rad(from.latitude)) * Math.cos(rad(to.latitude)) *
    Math.sin(rad(to.longitude - from.longitude) / 2) ** 2;
  return 6371000 * 2 * Math.asin(Math.sqrt(Math.min(1, a)));
};

export const formatDistance = (distance) => distance == null ? "" : distance < 1000
  ? `${Math.round(distance)}m` : `${(distance / 1000).toFixed(1)}km`;

// Preserve the existing 3 km discovery radius with the new nationwide list API.
export const storesNearLocation = (stores, location, radiusMeters = 3000) =>
  stores.filter((store) => {
    const distance = distanceInMeters(location, store);
    return distance !== null && distance <= radiusMeters;
  });

export const youtubeEmbedUrl = (value) => {
  const safeUrl = safeWebUrl(value);
  if (!safeUrl) return "";
  const url = new URL(safeUrl);
  const parts = url.pathname.split("/").filter(Boolean);
  let id;
  if (url.hostname === "youtu.be") {
    id = parts[0];
  } else if (["youtube.com", "www.youtube.com", "m.youtube.com", "youtube-nocookie.com", "www.youtube-nocookie.com"].includes(url.hostname)) {
    id = url.pathname === "/watch"
      ? url.searchParams.get("v")
      : ["shorts", "embed", "live"].includes(parts[0]) ? parts[1] : null;
  }
  return /^[\w-]{11}$/.test(id || "")
    ? `https://www.youtube.com/embed/${id}?playsinline=1&rel=0`
    : "";
};

export const filterStores = (stores, filter, query = "") => stores.filter((store) =>
  (filter !== "coupons" || store.hasCoupons) &&
  (filter !== "contents" || store.hasContents) &&
  `${store.name} ${store.address}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()),
);

export const formatCouponDiscount = (coupon) => {
  const amount = Number(coupon.discountNum);
  if (!Number.isFinite(amount) || amount <= 0) return "할인 쿠폰";
  return coupon.discountType === "AMOUNT" ? `${amount.toLocaleString("ko-KR")}원` : `${amount}%`;
};
