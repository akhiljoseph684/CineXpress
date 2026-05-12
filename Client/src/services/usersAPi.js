import API from "./api"

export const getAllUsers = async (query) => {
    try {
        const res = await API.get("/users" + query);
        return res.data;
    } catch (error) {
        throw error.response?.data;
    }
}

export const getUserById = async (id) => {
    try {
        const res = await API.get("/users/" + id);
        return res.data;
    } catch (error) {
        throw error.response?.data;
    }
}


export const deleteUser = async (id) => {
    try {
        const res = await API.delete("/users/" + id);
        return res.data;
    } catch (error) {
        throw error.response?.data;
    }
}

export const blockUser = async (id, data) => {
    try {
        const res = await API.patch("/users/" + id, data);
        return res.data;
    } catch (error) {
        throw error.response?.data;
    }
}

export const updateUser = async (data) => {
    try {
        const res = await API.put("/users", data);
        return res.data;
    } catch (error) {
        throw error.response?.data;
    }
}