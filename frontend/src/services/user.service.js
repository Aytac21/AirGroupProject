import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://127.0.0.1:8080/";

const getPublicContent = () => {
  return axios.get(API_URL + "");
};

const getUserBoard = () => {
  return axios.get(API_URL + "users/users/", { headers: authHeader() });
};

const getAdminBoard = () => {
  return axios.get(API_URL + "admin/", { headers: authHeader() });
};

export default {
  getPublicContent,
  getUserBoard,
  getAdminBoard,
};
