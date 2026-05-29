import API from "./api"

export const getOwnerDashboard = async () => {
    try {
        const res = await API.get("/dashboard");
        return res.data;
    } catch (error) {
        throw error.response?.data;
    }
}