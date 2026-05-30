import api from "./api";

export const signupOwner = async (signupForm) => {
  const response = await api.post("/api/v1/auth/signup", signupForm);

  return response.data;
};
