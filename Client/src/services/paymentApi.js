import API from "./api"

export const createPaymentOrder = async (data) => {
    try {
        const res = await API.post("/payment/create-order", data);
        return res.data;
    } catch (error) {
        throw error.response?.data
    }
}

export const verifyPayment = async (data) => {
    try {
        const res = await API.post("/payment/verify-payment", data);
        return res.data;
    } catch (error) {
        throw error.response?.data
    }
}

export const paymentFailed = async (data) => {
    try {
        const res = await API.post("/payment/payment-failed", data);
        return res.data;
    } catch (error) {
        throw error.response?.data;
    }
}