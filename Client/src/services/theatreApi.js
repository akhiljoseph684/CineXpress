import API from "./api";

export const createTheatre = async (data) => {
    try {
        const res = await API.post("/theatre", data);
        return res.data;
    } catch (error) {
        throw error.response?.data
    }
};

export const getAllTheatres = async () => {
    try {
        const res = await API.get("/theatre");
        return res.data;
    } catch (error) {
        throw error.response?.data
    }
};

export const editTheatre = async (id, data) => {
    try {
        const res = await API.put(`/theatre/${id}`, data);
        return res.data;
    } catch (error) {
        throw error.response?.data
    }
};

export const getTheatreById = async (id) => {
    try {
        const res = await API.get(`/theatre/${id}`);
        return res.data;
    } catch (error) {
        throw error.response?.data;
    }
}

export const getTheatreByOwner = async () => {
    try {
        const res = await API.get(`/theatre/owner`);
        return res.data;
    } catch (error) {
        throw error.response?.data;
    }
}

export const deleteTheatre = async (id) => {
    try {
        console.log(id)
        const res = await API.delete(`theatre/${id}`);
        return res.data;
    } catch (error) {
        throw error.response?.data;
    }
}