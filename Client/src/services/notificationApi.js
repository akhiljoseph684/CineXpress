import API from "./api";

export const getNotifications = async (query)  => {
    try {
        const res = await API.get("/notification" + query);
        return res.data;
    } catch (error) {
        throw error.response?.data;
    }
}
export const getUnreadNotificationCount = async ()  => {
    try {
        const res = await API.get("/notification/count");
        return res.data;
    } catch (error) {
        throw error.response?.data;
    }
}
