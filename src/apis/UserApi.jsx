import axios from "axios";
import api from "./api";

export const getMyPageInfo = async () => {
  const response = await api.get("/api/v1/users/me");

  return response.data;
};

export const updateMyProfile = async (profileForm) => {
  const response = await api.patch("/api/v1/users/me/profile", profileForm);

  return response.data;
};

export const updateMyProfileImage = async (profileImageUrl) => {
  const response = await api.patch("/api/v1/users/me/profile-image", {
    profileImageUrl,
  });

  return response.data;
};

export const getProfileImagePresignedUrl = async ({
  fileName,
  contentType,
}) => {
  const response = await api.post("/api/v1/s3/presigned-url", {
    domain: "PROFILE",
    fileName,
    contentType,
  });

  return response.data;
};

export const uploadProfileImageToS3 = async ({
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
