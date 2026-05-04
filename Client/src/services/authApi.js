import API from "./api";

export const register = async (data) => {
  try {
    const res = await API.post("/auth/register", data);
    return res.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const login = async (data) => {
  try {
    const res = await API.post("/auth/login", data);
    return res.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const refreshToken = async () => {
  try {
    const res = await API.post("/auth/refresh");
    return res.data;
  } catch (error) {
    return error.response
  }
};

export const logoutApi = async () => {
  await API.post("/auth/logout");
};