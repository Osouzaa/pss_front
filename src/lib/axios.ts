import axios from "axios";
import { env } from "../env";
import { TokenSistems } from "../constants/env.constantes";

const api = axios.create({
  baseURL: env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TokenSistems.TOKEN_PSS);
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {

    return Promise.reject(error);
  }
);

export { api };
