import { data } from "react-router-dom";
import API from "./api";

export const getAllMovies = async (query)  => {
    try {
        const res = await API.get("/movies" + query);
        return res.data;
    } catch (error) {
        throw error.response?.data;
    }
}

export const getMovieById = async (id) => {
    try {
        const res = await API.get("/movies/" + id);
        return res.data;
    } catch (error) {
        throw error.response?.data;
    }
}

export const createMovie = async (formData) => {
    try {
        const res = await API.post("/movies", formData);
        return res.data;
    } catch (error) {
        if(error.response?.data?.field){
            return error.response?.data
        }
        throw error.response?.data
    }
}

export const editMovie = async (id, formData) => {
    try {
        const res = await API.put("/movies/" + id, formData);
        return res.data;
    } catch (error) {
        throw error.response?.data
    }
}

export const deleteMovie = async (id) => {
    try {
        const res = await API.delete("/movies/" +id);
        return res.data
    } catch (error) {
        throw error.response?.data
    }
}

export const updateMovieStatus = async (id, status) => {
    try {
      const res = await API.patch(`/movies/status/${id}`, { status });
      return res.data;
    } catch (error) {
      throw error.response?.data;
    }
};

export const bannerFetch = async () => {
    try {
        const res = await API.get("/movies/banners");
        return res.data;
    } catch (error) {
        throw error.response?.data
    }
}

export const addReview = async (id, data) => {
    try {
        const res = await API.post(`/movies/${id}/review`, data);
        return res.data;
    } catch (error) {
        console.log(error)
        throw error.response?.data
    }
}