import React, { useCallback, useEffect, useState } from "react";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaClock,
  FaCalendarAlt,
  FaEye,
  FaUserTie,
  FaSearch,
  FaFilm,
  FaExclamationCircle,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchMovies = useCallback(
    async (status = activeFilter, title = search, currentPage = 1) => {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams();

        if (status && status !== "all") {
          params.set("status", status);
        }

        if (title.trim()) {
          params.set("title", title.trim());
        }

        params.set("page", String(currentPage));
        params.set("limit", "12");

        const res = await getAllMovies(`?${params.toString()}`);

        if (!res.success) {
          setError(res.message || "Failed to fetch movies");
          setMovies([]);
          return;
        }

        setMovies(res.movies || []);
        setTotalPages(res.totalPages || 1);
        setPage(res.currentPage || currentPage);
      } catch (err) {
        setError(err?.message || "Failed to fetch movies");
        setMovies([]);
      } finally {
        setLoading(false);
      }
    },
    [activeFilter, search]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMovies(activeFilter, search, 1);
    }, search ? 400 : 0);

    return () => clearTimeout(timer);
  }, [activeFilter, search, fetchMovies]);

  const handleFilterChange = (status) => {
    setActiveFilter(status);
    setPage(1);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleEdit = (id) => {
    navigate(`/admin/movies/edit/${id}`);
  };

  const handleDetails = (id) => {
    navigate(`/admin/movies/${id}`);
  };

  const handleStatusChange = async (id, status) => {
    try {
      setError("");

      const res = await updateMovieStatus(id, status);

      if (!res.success) {
        setError(res.message || "Failed to update status");
        return;
      }

      await fetchMovies(activeFilter, search, page);
    } catch (err) {
      setError(err?.message || "Failed to update status");
    }
  };

  const confirmDelete = async () => {
    if (!selectedMovieId || deleting) return;

    try {
      setDeleting(true);
      setError("");

      const res = await deleteMovie(selectedMovieId);

      if (!res.success) {
        setError(res.message || "Failed to delete movie");
        return;
      }

      setShowDeleteModal(false);
      setSelectedMovieId(null);

      const nextPage = movies.length === 1 && page > 1 ? page - 1 : page;

      await fetchMovies(activeFilter, search, nextPage);
    } catch (err) {
      setError(err?.message || "Failed to delete movie");
    } finally {
      setDeleting(false);
    }
  };

  const filters = [
    { label: "All Movies", value: "all" },
    { label: "Now Showing", value: "now_showing" },
    { label: "Upcoming", value: "upcoming" },
    { label: "Off-Screen", value: "Off-Screen" },
  ];

  const getStatusStyles = (status) => {
    if (status === "upcoming") {
      return "bg-amber-500/15 text-amber-400 border-amber-500/20";
    }

    if (status === "now_showing") {
      return "bg-emerald-500/15 text-emerald-400 border-emerald-500/20";
    }

    return "bg-red-500/15 text-red-400 border-red-500/20";
  };

  return (
    <div className="min-h-screen w-full bg-[#080808] text-white">
      <div className="mx-auto w-full max-w-[1600px]">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-xl text-red-500">
                <FaFilm />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Movies
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Manage your movie collection
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate("/admin/movies/create")}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-500 active:scale-[0.98] sm:w-auto"
          >
            <FaPlus />
            Create Movie
          </button>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4">
            <FaExclamationCircle className="mt-0.5 shrink-0 text-red-500" />
            <div className="flex-1">
              <p className="text-sm text-red-300">{error}</p>
            </div>
            <button
              onClick={() => fetchMovies(activeFilter, search, page)}
              className="shrink-0 text-sm font-semibold text-red-400 transition hover:text-red-300"
            >
              Retry
            </button>
          </div>
        )}

        <div className="mb-6 rounded-2xl border border-white/[0.07] bg-[#111111] p-4 sm:p-5">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search movies by title..."
              value={search}
              onChange={handleSearchChange}
              className="w-full rounded-xl border border-white/10 bg-[#080808] py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-red-500/60 focus:ring-2 focus:ring-red-500/10"
            />
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {filters.map((item) => (
              <button
                key={item.value}
                onClick={() => handleFilterChange(item.value)}
                className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                  activeFilter === item.value
                    ? "border-red-600 bg-red-600 text-white shadow-lg shadow-red-950/30"
                    : "border-white/[0.08] bg-[#171717] text-gray-400 hover:border-red-500/40 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111111]"
              >
                <div className="h-[320px] animate-pulse bg-[#1c1c1c]" />
                <div className="space-y-4 p-5">
                  <div className="h-5 w-3/4 animate-pulse rounded bg-[#252525]" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-[#252525]" />
                  <div className="h-4 w-full animate-pulse rounded bg-[#252525]" />
                  <div className="h-11 animate-pulse rounded-xl bg-[#252525]" />
                </div>
              </div>
            ))}
          </div>
        ) : movies.length > 0 ? (
          <>
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-semibold text-gray-300">
                  {movies.length}
                </span>{" "}
                {movies.length === 1 ? "movie" : "movies"}
              </p>
              <span className="rounded-lg border border-white/[0.08] bg-[#111111] px-3 py-1.5 text-xs text-gray-400">
                Page {page} of {totalPages}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {movies.map((movie) => (
                <div
                  key={movie._id}
                  className="group overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111111] transition duration-300 hover:-translate-y-1 hover:border-red-500/40 hover:shadow-xl hover:shadow-red-950/10"
                >
                  <div className="relative overflow-hidden bg-[#191919]">
                    <img
                      src={movie.poster?.card}
                      alt={movie.title}
                      onClick={() => handleDetails(movie._id)}
                      className="h-[320px] w-full cursor-pointer object-cover transition duration-500 group-hover:scale-[1.03]"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

                    <div className="absolute left-4 top-4">
                      <select
                        value={movie.status}
                        onChange={(e) =>
                          handleStatusChange(movie._id, e.target.value)
                        }
                        className={`max-w-[160px] cursor-pointer rounded-lg border px-3 py-2 text-xs font-semibold outline-none backdrop-blur-md ${getStatusStyles(
                          movie.status
                        )}`}
                      >
                        <option value="upcoming">Upcoming</option>
                        <option value="now_showing">Now Showing</option>
                        <option value="Off-Screen">Off-Screen</option>
                      </select>
                    </div>

                    <button
                      onClick={() => handleDetails(movie._id)}
                      className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-black/50 text-white opacity-0 backdrop-blur-md transition hover:bg-red-600 group-hover:opacity-100"
                      aria-label={`View ${movie.title} details`}
                    >
                      <FaEye />
                    </button>
                  </div>

                  <div className="p-5">
                    <h2
                      className="truncate text-xl font-bold text-white transition group-hover:text-red-400"
                      title={movie.title}
                    >
                      {movie.title}
                    </h2>

                    <div className="mt-3 flex min-h-7 flex-wrap gap-2">
                      {movie.genre?.map((item, index) => (
                        <span
                          key={item._id || `${item.name}-${index}`}
                          className="rounded-full border border-red-500/15 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-300"
                        >
                          {item.name}
                        </span>
                      ))}
                    </div>

                    <div className="mt-5 space-y-3 border-t border-white/[0.07] pt-4 text-sm">
                      <div className="flex items-start justify-between gap-4">
                        <span className="shrink-0 text-gray-500">
                          Language
                        </span>
                        <span className="text-right text-gray-300">
                          {movie.language
                            ?.map((item) => item.name)
                            .join(", ") || "-"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <span className="flex items-center gap-2 text-gray-500">
                          <FaClock className="text-red-500" />
                          Duration
                        </span>
                        <span className="text-gray-300">
                          {movie.duration || 0} min
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <span className="flex items-center gap-2 text-gray-500">
                          <FaCalendarAlt className="text-red-500" />
                          Release
                        </span>
                        <span className="text-gray-300">
                          {movie.releaseDate
                            ? new Date(
                                movie.releaseDate
                              ).toLocaleDateString()
                            : "-"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <span className="flex items-center gap-2 text-gray-500">
                          <FaUserTie className="text-red-500" />
                          Director
                        </span>
                        <span
                          className="max-w-[60%] truncate text-right text-gray-300"
                          title={movie.director || "-"}
                        >
                          {movie.director || "-"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-3 gap-3">
                      <button
                        onClick={() => handleDetails(movie._id)}
                        title="View details"
                        aria-label={`View ${movie.title}`}
                        className="flex items-center justify-center rounded-xl border border-white/[0.07] bg-[#1b1b1b] py-3 text-gray-300 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400"
                      >
                        <FaEye />
                      </button>

                      <button
                        onClick={() => handleEdit(movie._id)}
                        title="Edit movie"
                        aria-label={`Edit ${movie.title}`}
                        className="flex items-center justify-center rounded-xl border border-white/[0.07] bg-[#1b1b1b] py-3 text-gray-300 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400"
                      >
                        <FaEdit />
                      </button>

                      <button
                        onClick={() => {
                          setSelectedMovieId(movie._id);
                          setShowDeleteModal(true);
                        }}
                        title="Delete movie"
                        aria-label={`Delete ${movie.title}`}
                        className="flex items-center justify-center rounded-xl border border-red-500/15 bg-red-500/10 py-3 text-red-400 transition hover:border-red-500 hover:bg-red-600 hover:text-white"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() =>
                    fetchMovies(activeFilter, search, page - 1)
                  }
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-gray-300 transition hover:border-red-500/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <FaChevronLeft />
                  Prev
                </button>

                {Array.from({ length: totalPages }, (_, index) => index + 1)
                  .filter(
                    (pageNumber) =>
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      Math.abs(pageNumber - page) <= 1
                  )
                  .reduce((items, pageNumber, index, array) => {
                    if (
                      index > 0 &&
                      pageNumber - array[index - 1] > 1
                    ) {
                      items.push("ellipsis-" + pageNumber);
                    }

                    items.push(pageNumber);
                    return items;
                  }, [])
                  .map((item) =>
                    typeof item === "string" ? (
                      <span
                        key={item}
                        className="px-1 text-gray-600"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={item}
                        onClick={() =>
                          fetchMovies(activeFilter, search, item)
                        }
                        className={`h-11 min-w-11 rounded-xl border px-3 text-sm font-semibold transition ${
                          page === item
                            ? "border-red-600 bg-red-600 text-white"
                            : "border-white/10 bg-[#111111] text-gray-400 hover:border-red-500/40 hover:text-white"
                        }`}
                      >
                        {item}
                      </button>
                    )
                  )}

                <button
                  disabled={page >= totalPages}
                  onClick={() =>
                    fetchMovies(activeFilter, search, page + 1)
                  }
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-gray-300 transition hover:border-red-500/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                >
                  Next
                  <FaChevronRight />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-white/[0.07] bg-[#111111] px-6 py-16 text-center">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 text-3xl text-red-500">
              <FaFilm />
            </div>
            <h2 className="text-xl font-bold text-white">
              No Movies Found
            </h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
              {search
                ? "No movies match your search. Try another title or change the selected filter."
                : "There are no movies to display in this category yet."}
            </p>
            {(search || activeFilter !== "all") && (
              <button
                onClick={() => {
                  setSearch("");
                  setActiveFilter("all");
                  setPage(1);
                }}
                className="mt-5 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-500"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {showDeleteModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={() => {
              if (!deleting) {
                setShowDeleteModal(false);
                setSelectedMovieId(null);
              }
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-movie-title"
              className="w-full max-w-md rounded-2xl border border-white/10 bg-[#141414] p-6 shadow-2xl shadow-black/50 sm:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-xl text-red-500">
                  <FaTrash />
                </div>
                <button
                  disabled={deleting}
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedMovieId(null);
                  }}
                  className="rounded-lg p-2 text-gray-500 transition hover:bg-white/5 hover:text-white disabled:opacity-40"
                  aria-label="Close dialog"
                >
                  <FaTimes />
                </button>
              </div>

              <h2
                id="delete-movie-title"
                className="text-2xl font-bold text-white"
              >
                Delete Movie?
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-400">
                Are you sure you want to delete this movie? This action
                cannot be undone.
              </p>

              <div className="mt-8 flex gap-3">
                <button
                  disabled={deleting}
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedMovieId(null);
                  }}
                  className="flex-1 rounded-xl border border-white/10 bg-[#202020] px-4 py-3 font-medium text-gray-300 transition hover:bg-[#292929] disabled:opacity-40"
                >
                  Cancel
                </button>

                <button
                  disabled={deleting}
                  onClick={confirmDelete}
                  className="flex-1 rounded-xl bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deleting ? "Deleting..." : "Delete Movie"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Movies;