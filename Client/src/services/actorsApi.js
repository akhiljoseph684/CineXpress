import API from "./api";

export const getAllActors = async () => {
    try {
        const res = await API.get("/actors");
        return res.data;
    } catch (error) {
        throw error.response?.data;
    }
}

export const getActorById = async (id) => {
    try {
        const res = await API.get("/actors/" + id);
        return res.data;
    } catch (error) {
        throw error.response?.data;
    }
}

export const createActor = async (formData) => {
    try {
        const res = await API.post("/actors", formData);
        return res.data
    } catch (error) {
        throw error.response?.data;
    }
}

export const editActor = async (id, formData) => {
    try {
        const res = await API.put("/actors/" + id, formData);
        return res.data
    } catch (error) {
        throw error.response?.data;
    }
}

export const deleteActor = async (id) => {
    try {
        const res = await API.delete("/actors/" + id);
        return res.data;
    } catch (error) {
        throw error.response?.data;
    }
}

export const searchActors = async (query) => {
    try {
        const res = await API.get("/actors/search" + query);
        return res.data;
    } catch (error) {
        throw error.response?.data;
    }
}

export const getMoviesByActors = async (id) => {
    try {
        const res = await API.get(`/actors/${id}/movies`);
        return res.data
    } catch (error) {
        throw error.response?.data
    }
}