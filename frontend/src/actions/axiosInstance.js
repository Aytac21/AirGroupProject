import axios from "axios";
import { refreshTokenSuccess, logout } from "./auth";
import store from "../store";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8080/users",
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) {
        store.dispatch(logout());
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(
          `http://127.0.0.1:8080/users/token/refresh/`,
          {
            refresh_token: refreshToken,
          }
        );

        const { access_token } = data;
        localStorage.setItem("access_token", access_token);
        store.dispatch(refreshTokenSuccess(access_token));
        axiosInstance.defaults.headers[
          "Authorization"
        ] = `Bearer ${access_token}`;
        processQueue(null, access_token);

        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        store.dispatch(logout());
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
