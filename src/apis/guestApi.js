import axios from "axios";

// Public discovery must not depend on an owner's session or its 401 interceptor.
const guestApi = axios.create({
  baseURL: import.meta.env.DEV ? "" : "https://spring.allligo-agent.cloud",
  timeout: 15000,
  withCredentials: false,
});

export default guestApi;
