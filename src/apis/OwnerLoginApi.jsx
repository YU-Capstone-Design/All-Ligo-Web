import api, { setAuthToken } from "./api";

const saveAuthToken = (response) => {
  const authorization = response.headers?.authorization;
  const accessToken = response.data?.accessToken || response.data?.token;
  const token = authorization || accessToken;

  if (!token) return;

  setAuthToken(token);
};

export const loginOwner = async ({ email, password }) => {
  const response = await api.post("/api/v1/auth/login", {
    email,
    password,
  });

  saveAuthToken(response);
  return response.data;
};
