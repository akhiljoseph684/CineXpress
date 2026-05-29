import API from "./api"

export const getTicketById = async (id) => {
    try {
        const res = await API.get("/ticket/" + id);

        return res.data;
    } catch (error) {
        throw error.response?.data;
    }
}

export const scanTicket = async (id) => {
    try {
        const res = await API.post("/ticket/scan/" + id);
        return res.data;
    } catch (error) {
        throw error.response?.data;
    }
}

export const verifyTicketEntry = async (id) => {
    try {
        const res = await API.put("/ticket/verify/" + id);
        return res.data;
    } catch (error) {
        console.log(error)
        throw error.response?.data;
    }
}

