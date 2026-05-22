import API from "./api"

export const createShow = async (data) => {
    try {
        const res = await API.post("/shows", data);
        return res.data;
    } catch (error) {
        throw error.response?.data
    }
}

export const getMovieShows = async (movieId, showDate) => {
    try {
        const res = await API.get(`/shows/movie-shows?movieId=${movieId}&showDate=${showDate}`);
        return res.data;
    } catch (error) {
        throw error.response?.data
    }
}