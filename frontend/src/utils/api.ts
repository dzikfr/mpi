import axios, { AxiosRequestConfig, Method } from "axios";

const API_BASE_URL = "http://localhost:3000";

export const apiRequest = async (
  method: Method,
  url: string,
  data?: any
) => {
  const token = sessionStorage.getItem("token");

  const headers: Record<string, string> = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config: AxiosRequestConfig = {
    method,
    url: `${API_BASE_URL}${url}`,
    headers,
    ...(data && { data }),
  };

  const response = await axios(config);
  return response.data;
};
