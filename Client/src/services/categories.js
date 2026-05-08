import API from "./api";

export const createLanguage = async (lang) => {
    try {
        const res = await API.post("/language", lang)
        return res.data;
    } catch (error) {
        throw error.response?.data
    }
}

export const getLanguages = async () => {
    try {
        const res = await API.get("/language")
        return res.data;
    } catch (error) {
        throw error.response?.data
    }
}

export const deleteLanguage = async (id) => {
    try {
        const res = await API.delete("/language/" + id);
        return res.data
    } catch (error) {
        throw error.response?.data
    }
}

export const createGenre = async (lang) => {
    try {
        const res = await API.post("/genre", lang)
        return res.data;
    } catch (error) {
        throw error.response?.data
    }
}

export const getGenres = async () => {
    try {
        const res = await API.get("/genre")
        return res.data;
    } catch (error) {
        throw error.response?.data
    }
}

export const deleteGenre = async (id) => {
    try {
        const res = await API.delete("/genre/" + id);
        return res.data
    } catch (error) {
        throw error.response?.data
    }
}