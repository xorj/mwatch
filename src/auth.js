import axios from "axios";

const auth = axios.create({
  baseURL: "https://mwatch-server.herokuapp.com/",
});

auth.interceptors.request.use(async (config) => {
  if (localStorage.getItem("SESSION")) {
    const token = JSON.parse(localStorage.getItem("SESSION")).token;

    config.headers.authorization = `Bearer ${token}`;
  }
  return config;
});

export default auth;
