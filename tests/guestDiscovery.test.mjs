import test from "node:test";
import assert from "node:assert/strict";
import { normalizeStores, filterStores, distanceInMeters, formatDistance, formatCouponDiscount, readItems, safeWebUrl, storesNearLocation, youtubeEmbedUrl } from "../src/utils/guestDiscovery.js";

const store = { storeId: 1, storeName: "우리 가게", latitude: 35.8338, longitude: 128.7597, couponCount: 2 };

test("coupon-only and content-only stores both appear once; empty stores do not", () => {
  const items = normalizeStores([
    store, store,
    { ...store, storeId: 2, couponCount: 0, contentCount: 1 },
    { ...store, storeId: 3, couponCount: 0, contentCount: 0 },
  ]);
  assert.deepEqual(items.map((item) => item.id), ["1", "2"]);
  assert.deepEqual(filterStores(items, "coupons").map((item) => item.id), ["1"]);
  assert.deepEqual(filterStores(items, "contents").map((item) => item.id), ["2"]);
  assert.equal(filterStores(items, "all", "없는 가게").length, 0);
});

test("missing counts stay unknown, and the documented coupon endpoint implies coupon availability", () => {
  const [item] = normalizeStores([{ ...store, couponCount: undefined }], { couponOnly: true });
  assert.equal(item.couponCount, null);
  assert.equal(item.hasCoupons, true);
  assert.equal(item.contentCount, null);
  assert.equal(normalizeStores([{ ...store, couponCount: null }], { couponOnly: true })[0].couponCount, null);
});

test("invalid coordinates cannot become markers at zero or invalid positions", () => {
  for (const latitude of [undefined, null, "", "  ", true, "invalid", 91, -91]) {
    assert.equal(normalizeStores([{ ...store, latitude }]).length, 0);
  }
  assert.equal(normalizeStores([{ ...store, latitude: "0", longitude: "0" }])[0].latitude, 0);
});

test("public media links reject executable and local URLs", () => {
  for (const url of ["javascript:alert(1)", "data:text/html,test", "file:///tmp/a", "/tmp/video.mp4", "invalid"]) assert.equal(safeWebUrl(url), "");
  assert.equal(safeWebUrl("https://example.com/store"), "https://example.com/store");
});

test("distance uses actual coordinates and formats meters and kilometers", () => {
  assert.equal(distanceInMeters(store, store), 0);
  assert.equal(distanceInMeters(null, store), null);
  assert.ok(Math.abs(distanceInMeters({ latitude: 0, longitude: 0 }, { latitude: 0, longitude: 1 }) - 111195) < 1);
  assert.equal(formatDistance(500), "500m");
  assert.equal(formatDistance(1520), "1.5km");
  assert.equal(formatDistance(null), "");
});

test("coupon values and malformed API responses do not silently create placeholder offers", () => {
  assert.equal(formatCouponDiscount({ discountType: "AMOUNT", discountNum: 1000 }), "1,000원");
  assert.equal(formatCouponDiscount({ discountType: "RATE", discountNum: 20 }), "20%");
  assert.throws(() => readItems({ message: "error" }));
  assert.deepEqual(readItems([]), []);
});

test("nationwide public stores keep nearby content-only stores and exclude other regions", () => {
  const items = normalizeStores([
    store,
    { ...store, storeId: 2, couponCount: 0, contentCount: 4, latitude: 35.83, longitude: 128.75 },
    { ...store, storeId: 3, couponCount: 0, contentCount: 1, latitude: 37.4985, longitude: 127.0276 },
  ]);
  assert.deepEqual(storesNearLocation(items, store).map((item) => item.id), ["1", "2"]);
  assert.deepEqual(storesNearLocation(items, items[2]).map((item) => item.id), ["3"]);
  assert.deepEqual(storesNearLocation(items, null), []);
  assert.deepEqual(storesNearLocation(items, store, 0).map((item) => item.id), ["1"]);
});

test("public video URLs support YouTube Shorts, watch, share and embed formats", () => {
  const id = "xL9MCuD03hE";
  for (const url of [
    `https://youtube.com/shorts/${id}`,
    `https://www.youtube.com/watch?v=${id}&t=20`,
    `https://youtu.be/${id}?si=example`,
    `https://www.youtube-nocookie.com/embed/${id}`,
  ]) {
    assert.equal(youtubeEmbedUrl(url), `https://www.youtube.com/embed/${id}?playsinline=1&rel=0`);
  }
});

test("video files and untrusted URLs are never embedded as arbitrary iframes", () => {
  for (const url of [null, "https://example.com/video.mp4", "javascript:alert(1)",
    "https://youtube.com.evil.example/shorts/xL9MCuD03hE", "https://youtube.com@evil.example/shorts/xL9MCuD03hE",
    "https://youtube.com/shorts/invalid", "https://www.youtube.com/playlist?list=PLexample"]) {
    assert.equal(youtubeEmbedUrl(url), "");
  }
});
