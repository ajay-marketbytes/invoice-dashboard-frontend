import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  headers: { "Content-Type": "multipart/form-data" },
});

apiClient.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const { data } = await axios.post("refresh/", { refresh: refreshToken });
          localStorage.setItem("accessToken", data.access);
          error.config.headers["Authorization"] = `Bearer ${data.access}`;
          return axios(error.config);
        } catch (refreshError) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
