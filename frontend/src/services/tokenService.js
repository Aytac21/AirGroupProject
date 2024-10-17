import axios from "axios";
import { store } from "../store";
import { refreshTokenSuccess, logout } from "../actions/auth";

const setupAxiosInterceptors = () => {
  axios.interceptors.request.use(
    async (config) => {
      const state = store.getState();
      const accessToken = state.auth.accessToken; 

      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      if (
        error.response &&
        error.response.status === 403 &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;
        const state = store.getState();
        const refreshToken = state.auth.refreshToken;

        if (refreshToken) {
          try {
            const response = await axios.post(
              "http://127.0.0.1:8080/users/token/refresh/",
              {
                refresh: refreshToken,
              }
            );

            store.dispatch(refreshTokenSuccess(response.data.access));

            axios.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${response.data.access}`;
            originalRequest.headers[
              "Authorization"
            ] = `Bearer ${response.data.access}`;
            return axios(originalRequest);
          } catch (error) {
            store.dispatch(logout());
            return Promise.reject(error);
          }
        }
      }

      return Promise.reject(error);
    }
  );
};

export default setupAxiosInterceptors;
