import API from "./api"

export const createShow = async (data) => {
    try {
        const res = await API.post("/shows", data);
        return res.data;
    } catch (error) {
        throw error.response?.data
    }
}

export const editShow = async () => {
    
}

export const getMovieShows = async (movieId, showDate) => {
    try {
        const res = await API.get(`/shows/movie-shows?movieId=${movieId}&showDate=${showDate}`);
        return res.data;
    } catch (error) {
        throw error.response?.data
    }
}

export const getShowById = async (id) => {
    try {
        const res = await API.get("/shows/" + id);
        return res.data;
    } catch (error) {
        throw error.response?.data;
    }
}

export const getAllShows = async (query) => {
    console.log(query)
    try {
        const res = await API.get("/shows/all" + query);
        return res.data;
    } catch (error) {
        throw error.response?.data;
    }
}

export const getShowsByOwner = async (query) => {
    try {
        const res = await API.get("/shows/owner" + query);
        return res.data;
    } catch (error) {
        throw error.response?.data;
    }
}