import API from "./api"

export const reserveSeats = async (data) => {
    console.log(data)
    try {
        const res = await API.post("/booking/reserve-seats", data);
        return res.data;
    } catch (error) {
        throw error.response?.data
    }
}