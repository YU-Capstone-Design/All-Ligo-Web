import api from "./api";

export const checkEmailDuplicate = async (email) => {
  const response = await api.get("/api/v1/auth/email/check", {
    params: { email },
  });

  return response.data;
};

export const sendVerificationEmail = async (email) => {
  const response = await api.post("/api/v1/auth/email/send", {
    email,
  });

  return response.data;
};

export const checkEmailVerificationStatus = async (email) => {
  const response = await api.get("/api/v1/auth/email/status", {
    params: { email },
  });

  return response.data;
};
