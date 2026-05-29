import axios from "axios";


const api = axios.create({

  
  baseURL: 'http://spring.allligo-agent.cloud',
  

  headers: {
    "Content-Type": "application/json",
  },
  
  withCredentials: true,
});

export default api;