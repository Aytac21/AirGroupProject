import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  SET_MESSAGE,
  REFRESH_TOKEN_SUCCESS,
} from "./types";

import AuthService from "../services/auth.service";
import { setAuthToken } from "../common/setAuthToken";

export const register =
  (username, email, password, password2, first_name, last_name, phone) =>
  (dispatch) => {
    return AuthService.register(
      username,
      email,
      password,
      password2,
      first_name,
      last_name,
      phone
    ).then(
      (response) => {
        dispatch({
          type: REGISTER_SUCCESS,
        });

        dispatch({
          type: SET_MESSAGE,
          payload: response.data.message,
        });

        return Promise.resolve();
      },
      (error) => {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        dispatch({
          type: REGISTER_FAIL,
        });

        dispatch({
          type: SET_MESSAGE,
          payload: message,
        });

        return Promise.reject();
      }
    );
  };

export const login = (email, password, headers) => (dispatch) => {
  return AuthService.login(email, password, headers).then(
    (data) => {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: { user: data.user, token: data.token },
      });

      return Promise.resolve();
    },
    (error) => {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      dispatch({
        type: LOGIN_FAIL,
      });

      return Promise.reject(message);
    }
  );
};

export const refreshTokenSuccess = (newAccessToken) => ({
  type: REFRESH_TOKEN_SUCCESS,
  payload: newAccessToken,
});

export const logout = () => (dispatch) => {
  AuthService.logout();

  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");

  dispatch({
    type: LOGOUT,
  });
};
