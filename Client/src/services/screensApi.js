import API from "./api";

export const createScreen = async (data) => {
  try {
    const res = await API.post("/screens", data);
    return res.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const getScreenById = async (id) => {
  try {
    const res = await API.get("/screens/" + id);
    return res.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const getScreensByOwner = async () => {
  try {
    const res = await API.get("/screens", {
      withCredentials: true,
    });
    return res?.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const updateScreen = async (id, data) => {
  try {
    const res = await API.put("/screens/" + id, data);
    return res.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const deleteScreen = async (id) => {
  try {
    const res = await API.delete("/screens/" + id, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const getAllScreens = async () => {
  try {
    const res = await API.get("/screens/all", {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    throw error.response?.data;
  }
}