import API from "./api";

export const reserveSeats = async (data) => {
  try {
    const res = await API.post("/booking/reserve-seats", data);
    return res.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const getAllBookings = async (query) => {
  try {
    const res = await API.get("/booking" + query);
    return res.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const getBookingsByOwner = async () => {
  try {
    const res = await API.get("/booking/owner");
    return res.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const getBookingById = async (id) => {
  try {
    const res = await  API.get("/booking/" + id);
    return res.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const getMyBookings = async () => {
  try {
    const res = await  API.get("/booking/my-bookings");
    return res.data;
  } catch (error) {
    throw error.response?.data;
  }
};
