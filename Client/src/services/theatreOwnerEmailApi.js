import API from "./api"

export const addTheatreOwnerEmail = async (data) => {
    try {
        const res = await API.post("/admin", data);
        return res.data;
    } catch (error) {
        throw error.response?.data;
    }
}
export const getTheatreOwnerEmails = async () => {
    try {
        const res = await API.get("/admin");
        return res.data;
    } catch (error) {
        throw error.response?.data;
    }
}
export const deleteTheatreOwnerEmail = async (id) => {
    try {
        const res = await API.delete("/admin/" +  id);
        return res.data;
    } catch (error) {
        throw error.response?.data;
    }
}