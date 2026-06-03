import axios from "axios";
import api from "./api";

export const getCouponPresignedUrl = async ({ fileName, contentType }) => {
  const response = await api.post("/api/v1/s3/presigned-url", {
    domain: "COUPON",
    fileName,
    contentType,
  });

  return response.data;
};

export const uploadCouponImageToS3 = async ({
  presignedUrl,
  file,
  contentType,
}) => {
  await axios.put(presignedUrl, file, {
    headers: {
      "Content-Type": contentType,
    },
    withCredentials: false,
  });
};

export const createCoupon = async (couponForm) => {
  const response = await api.post("/api/v1/coupons", couponForm);

  return response.data;
};

export const getMyCoupons = async () => {
  const response = await api.get("/api/v1/coupons/me");

  return response.data;
};

export const updateCoupon = async ({ couponId, couponForm }) => {
  const response = await api.patch(`/api/v1/coupons/${couponId}`, couponForm);

  return response.data;
};

export const deleteCoupon = async (couponId) => {
  const response = await api.delete(`/api/v1/coupons/${couponId}`);

  return response.data;
};
