import axios from "axios";

import store from "../redux/store";

import { setCredentials, logout } from "../features/authSlice";


const API = axios.create({

  baseURL:
    import.meta.env
      .VITE_BACKEND_API_URL,

  withCredentials: true

});


API.interceptors.request.use(

  (config) => {

    const token =
      store.getState()
        .auth.accessToken;

    config.headers =
      config.headers || {};

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;

    }

    return config;

  },

  (error) => {

    return Promise.reject(error);

  }

);

API.interceptors.response.use(

  (response) => response,

  async (error) => {

    const originalRequest =
      error.config || {};

    if (

      error.response?.status === 401 &&

      !originalRequest._retry &&

      !originalRequest?.url?.includes(
        "/auth/refresh"
      )

    ) {

      originalRequest._retry = true;

      try {

        const res =
          await API.post(
            "/auth/refresh"
          );

        const {
          accessToken,
          user
        } = res.data;

        store.dispatch(

          setCredentials({
            user,
            accessToken
          })

        );

        originalRequest.headers =
          originalRequest.headers || {};

        originalRequest.headers.Authorization =
          `Bearer ${accessToken}`;

        return API(originalRequest);

      } catch (refreshError) {

        store.dispatch(logout());

        return Promise.reject(
          refreshError
        );

      }

    }

    return Promise.reject(error);

  }

);

export default API;