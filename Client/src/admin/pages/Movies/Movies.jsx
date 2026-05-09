import React, { useEffect, useState } from "react";

import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaClock,
  FaCalendarAlt,
  FaEye,
  FaUserTie,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import {
  deleteMovie,
  getAllMovies,
  updateMovieStatus,
} from "../../../services/moviesApi";

function Movies() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchMovies("all");
  }, []);
  useEffect(() => {

    const timer =
      setTimeout(() => {

        fetchMovies(
          activeFilter,
          search,
          1
        );

      }, 500);

    return () =>
      clearTimeout(timer);

  }, [
    search,
    activeFilter
  ]);

  const fetchMovies = async (status = "all",title = "",currentPage = 1) => {

    try {

      setLoading(true);

      setError("");

      let query = [];

      if (status && status !== "all") {
        query.push(
          `status=${status}`
        );
      }

      if (title.trim()) {
        query.push(
          `title=${title}`
        );
      }

      query.push(
        `page=${currentPage}`
      );

      query.push("limit=12");

      const queryString =
        `?${query.join("&")}`;

      const res = await getAllMovies(queryString);

      if (!res.success) {

        setError(
          res.message
        );

        return;
      }

      setMovies(
        res.movies || []
      );

      setTotalPages(
        res.totalPages || 1
      );

      setPage(
        res.currentPage || 1
      );

    } catch (error) {

      setError(
        error?.message ||
        "Failed to fetch movies"
      );

    } finally {

      setLoading(false);
    }
  };


  const handleDelete = async (id) => {
    try {
      const res = await deleteMovie(id);

      if (!res.success) {
        setError(res.message);

        return;
      }

      fetchMovies();
    } catch (error) {
      setError(error?.message || "Failed to delete movie");
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/movies/edit/${id}`);
  };

  const handleDetails = (id) => {
    navigate(`/admin/movies/${id}`);
  };

  const handleStatusChange = async (id, status) => {
    try {
      const res = await updateMovieStatus(id, status);

      if (!res.success) {
        setError(res.message);

        return;
      }

      fetchMovies();
      setActiveFilter("all");
    } catch (error) {
      setError(error?.message || "Failed to update status");
    }
  };

  return (
    <div className="w-full">
      <div
        className="
          flex flex-col md:flex-row
          md:items-center
          md:justify-between
          gap-4 mb-8
        "
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Movies 🎬</h1>

          <p className="text-gray-400 text-sm mt-2">Manage all movies here</p>
        </div>

        <button
          onClick={() => navigate("/admin/movies/create")}
          className="
            flex items-center justify-center gap-2
            bg-gradient-to-r
            from-[#8b5c76]
            to-[#6f4660]
            px-5 py-3
            rounded-xl
            font-medium
            hover:opacity-90
            transition
            w-full md:w-auto
          "
        >
          <FaPlus />
          Create Movie
        </button>
      </div>
      {error ? (
        <div
          className="
            w-full
            bg-[#1a1a1a]
            border border-red-500/30
            rounded-2xl
            py-14 px-6
            flex flex-col
            items-center
            justify-center
            text-center
          "
        >
          <div
            className="
              w-20 h-20
              rounded-full
              bg-red-500/10
              flex items-center
              justify-center
              text-4xl
              mb-5
            "
          >
            ⚠️
          </div>

          <h2
            className="
              text-2xl
              font-bold
              text-white
            "
          >
            {error}
          </h2>
        </div>
      ) : (
        <>
        <div className="mb-8">

          <input
            type="text"
            placeholder="Search movies..."
            value={search}
            onChange={(e) => {
            
              const value =
                e.target.value;
            
              setSearch(value);
            }}
            className="
              w-full
              bg-[#1a1a1a]
              border border-gray-800
              rounded-2xl
              px-5 py-4
              outline-none
              focus:border-[#8b5c76]
              transition
            "
          />

        </div>
          <div
            className="
            flex flex-wrap
            items-center
            gap-3
            mb-8
          "
          >
            {[
              {
                label: "All",
                value: "all",
              },

              {
                label: "Now Showing",
                value: "now_showing",
              },

              {
                label: "Upcoming",
                value: "upcoming",
              },

              {
                label: "Off-Screen",
                value: "Off-Screen",
              },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => {
                  setActiveFilter(item.value);
                  setPage(1);
                  fetchMovies(
                    item.value,
                    search,
                    1
                  );
                }}
                className={`
                px-5 py-3
                rounded-xl
                text-sm font-medium
                transition
                border

                ${
                  activeFilter === item.value
                    ? "bg-gradient-to-r from-[#8b5c76] to-[#6f4660] border-[#8b5c76] text-white"
                    : "bg-[#1a1a1a] border-gray-800 text-gray-300 hover:border-[#8b5c76]"
                }
              `}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div
            className={`        
                          w-full
                          ${
                            !movies.length
                              ? `
                                flex
                                items-center
                                justify-center
                                min-h-[70vh]
                              `
                              : `
                                grid
                                grid-cols-1
                                md:grid-cols-2
                                xl:grid-cols-3
                                gap-6
                              `
                          }
                        `}
                                >
            {movies.length ? (
              movies.map((movie) => {
                return (
                  <div
                    key={movie._id}
                    className="
              bg-[#1a1a1a]
              rounded-2xl
              overflow-hidden
              shadow-2xl
              border border-gray-800
              hover:border-[#8b5c76]
              transition
            "
                  >
                    <div className="relative">
                      <div className="absolute top-4 left-4">
                        <select
                          value={movie.status}
                          onChange={(e) =>
                            handleStatusChange(movie._id, e.target.value)
                          }
                          className={`
                    px-3 py-2
                    rounded-lg
                    text-xs font-medium
                    outline-none
                    cursor-pointer
                    border-none
                    ${
                      movie.status === "upcoming"
                        ? "bg-yellow-500 text-black"
                        : movie.status === "now_showing"
                          ? "bg-green-500 text-black"
                          : "bg-red-500 text-white"
                    }
                  `}
                        >
                          <option value="upcoming">Upcoming</option>

                          <option value="now_showing">Now Showing</option>

                          <option value="Off-Screen">Off-Screen</option>
                        </select>
                      </div>

                      <img
                        src={movie.poster?.card}
                        alt={movie.title}
                        className="
                  w-full
                  h-[320px]
                  object-cover
                "
                      />
                    </div>

                    <div className="p-5">
                      <h2
                        className="
                  text-xl
                  font-bold
                  line-clamp-1
                "
                      >
                        {movie.title}
                      </h2>

                      <div
                        className="
                  flex flex-wrap gap-2
                  mt-3
                "
                      >
                        {movie.genre?.map((item, index) => (
                          <span
                            key={index}
                            className="
                        px-3 py-1
                        rounded-full
                        text-xs
                        bg-[#8b5c76]/20
                        text-[#d6a7c1]
                      "
                          >
                            {item.name}
                          </span>
                        ))}
                      </div>

                      <div
                        className="
                  mt-5
                  space-y-3
                  text-sm text-gray-400
                "
                      >
                        <div
                          className="
                    flex items-center
                    justify-between
                    gap-5
                  "
                        >
                          <span>Language</span>

                          <span className="text-white">
                            {" "}
                            {movie.language
                              ?.map((item) => item.name)
                              .join(", ") || "-"}{" "}
                          </span>
                        </div>

                        <div
                          className="
                    flex items-center
                    justify-between
                  "
                        >
                          <div className="flex items-center gap-2">
                            <FaClock />
                            Duration
                          </div>

                          <span className="text-white">
                            {movie.duration || 0} min
                          </span>
                        </div>

                        <div
                          className="
                    flex items-center
                    justify-between
                  "
                        >
                          <div className="flex items-center gap-2">
                            <FaCalendarAlt />
                            Release
                          </div>

                          <span className="text-white">
                            {movie.releaseDate
                              ? new Date(movie.releaseDate).toLocaleDateString()
                              : "-"}
                          </span>
                        </div>

                        <div
                          className="
                    flex items-center
                    justify-between
                  "
                        >
                          <div className="flex items-center gap-2">
                            <FaUserTie />
                            Director
                          </div>

                          <span className="text-white">
                            {movie.director || "-"}
                          </span>
                        </div>
                      </div>

                      <div
                        className="
                  grid grid-cols-3 gap-3 mt-6
                "
                      >
                        <button
                          onClick={() => handleDetails(movie._id)}
                          className=" py-3 rounded-xl bg-[#252525] hover:bg-[#333] transition flex items-center justify-center gap-2 "
                        >
                          <FaEye />
                        </button>

                        <button
                          onClick={() => handleEdit(movie._id)}
                          className=" py-3 rounded-xl bg-[#252525] hover:bg-[#333] transition flex items-center justify-center gap-2 "
                        >
                          <FaEdit />
                        </button>

                        <button
                          onClick={() => handleDelete(movie._id)}
                          className=" py-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition flex items-center justify-center gap-2 "
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
              
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <h2 className="text-2xl font-semibold text-gray-700">
                  No Movies Found 🎬
                </h2>

                <p className="mt-2 text-gray-500">
                  We couldn't find any movies matching your search.
                </p>
              </div>
            )}
          </div>
  {
    totalPages > 2 && (

      <div
        className="
          flex items-center
          justify-center
          gap-3
          mt-10
          flex-wrap
        "
      >

        <button
          disabled={page === 1}
          onClick={() =>
            fetchMovies(
              activeFilter,
              search,
              page - 1
            )
          }
          className="
            px-5 py-3
            rounded-xl
            bg-[#1a1a1a]
            border border-gray-800
            disabled:opacity-50
          "
        >

          Prev

        </button>

        {[...Array(totalPages)]
          .map((_, index) => {

            const pageNumber =
              index + 1;

            return (

              <button
                key={pageNumber}
                onClick={() =>
                  fetchMovies(
                    activeFilter,
                    search,
                    pageNumber
                  )
                }
                className={`
                  w-12 h-12
                  rounded-xl
                  border
                  transition

                  ${
                    page ===
                    pageNumber

                      ? "bg-gradient-to-r from-[#8b5c76] to-[#6f4660] border-[#8b5c76]"

                      : "bg-[#1a1a1a] border-gray-800"
                  }
                `}
              >

                {pageNumber}

              </button>
            );
          })}

        <button
          disabled={
            page ===
            totalPages
          }
          onClick={() =>
            fetchMovies(
              activeFilter,
              search,
              page + 1
            )
          }
          className="
            px-5 py-3
            rounded-xl
            bg-[#1a1a1a]
            border border-gray-800
            disabled:opacity-50
          "
        >

          Next

        </button>

      </div>
    )
  }
          </>
        )}
      </div>
    );
  }

export default Movies;
