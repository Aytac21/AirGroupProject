import axios from "axios";

const API_URL = "http://127.0.0.1:8080/users/";
import axiosInstance from "../actions/axiosInstance";

const register = (
  username,
  email,
  password,
  password2,
  first_name,
  last_name,
  phone
) => {
  return axios
    .post(
      API_URL + "register/",
      {
        username,
        email,
        first_name,
        last_name,
        phone,
        password,
        password2,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Registration failed", error);
      throw error;
    });
};

const refreshAccessToken = (refresh_token) => {
  return axios
    .post(API_URL + "token/refresh/", { refresh: refresh_token })
    .then((response) => response.data);
};

const scheduleTokenRefresh = (refresh_token) => {
  const tokenPayload = JSON.parse(atob(refresh_token.split(".")[1]));
  const expiryTime = tokenPayload.exp * 1000 - Date.now();

  const refreshTime = expiryTime - 60000;

  setTimeout(() => {
    refreshAccessToken(refresh_token)
      .then((newTokens) => {
        localStorage.setItem("access_token", newTokens.access_token);
        scheduleTokenRefresh(newTokens.refresh_token);
      })
      .catch((error) => {
        console.error("Token refresh failed", error);
        logout();
      });
  }, refreshTime);
};

const login = (email, password) => {
  return axiosInstance
    .post(
      API_URL + "login/",
      {
        email,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => {
      if (response.data.access_token && response.data.refresh_token) {
        localStorage.setItem("access_token", response.data.access_token);
        localStorage.setItem("refresh_token", response.data.refresh_token);

        scheduleTokenRefresh(response.data.refresh_token);
      }
      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
};

export default {
  register,
  login,
  logout,
};
