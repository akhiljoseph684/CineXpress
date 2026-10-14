import React, { useEffect, useState } from "react";
import {
  FaFilm,
  FaMapMarkerAlt,
  FaClock,
  FaTv,
  FaSpinner,
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
  FaExclamationCircle,
  FaRedo,
} from "react-icons/fa";
import { getAllShows } from "../../../services/showApi";

function Shows() {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("running");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchShows(activeFilter, currentPage);
  }, [activeFilter, currentPage]);

  const fetchShows = async (type, page = 1) => {
    try {
      setLoading(true);
      setError("");

      const res = await getAllShows(
        `?type=${type}&page=${page}&limit=12`
      );

      setShows(res.shows || []);
      setTotalPages(res.totalPages || 1);
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load shows."
      );
    } finally {
      setLoading(false);
    }
  };

  const filters = [
    { label: "Running", value: "running" },
    { label: "Upcoming", value: "upcoming" },
    { label: "Ended", value: "ended" },
  ];

  return (
    <div className="min-h-screen w-full bg-[#080808] text-white px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-11 h-11 rounded-xl bg-red-600/10 border border-red-500/20 flex items-center justify-center">
                <FaFilm className="text-red-500 text-xl" />
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Shows
              </h1>
            </div>

            <p className="text-white/50 text-sm sm:text-base">
              Manage and monitor all movie shows.
            </p>
          </div>

          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-600/10 border border-red-500/20 w-fit">
            <FaTv className="text-red-400" />
            <span className="text-red-400 font-semibold">
              {shows.length} Shows
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap mb-8">
          {filters.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => {
                if (activeFilter !== item.value) {
                  setActiveFilter(item.value);
                  setCurrentPage(1);
                }
              }}
              className={`px-5 py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
                activeFilter === item.value
                  ? "bg-red-600 border-red-600 text-white shadow-lg shadow-red-600/10"
                  : "bg-[#111] border-white/10 text-white/60 hover:text-white hover:border-red-500/50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl border border-red-500/20 bg-red-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <FaExclamationCircle className="text-red-400 shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>

            <button
              type="button"
              onClick={() => fetchShows(activeFilter, currentPage)}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors"
            >
              <FaRedo />
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <FaSpinner className="text-red-500 text-4xl animate-spin" />
            <p className="text-white/50 text-sm">Loading shows...</p>
          </div>
        ) : shows.length === 0 ? (
          <div className="bg-[#111] border border-white/10 rounded-2xl p-8 sm:p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-red-600/10 flex items-center justify-center">
              <FaFilm className="text-red-500 text-3xl" />
            </div>

            <h2 className="text-xl sm:text-2xl font-semibold">
              No {activeFilter} shows found
            </h2>

            <p className="text-white/50 mt-2 text-sm">
              There are no shows available in this category right now.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {shows.map((show) => (
              <div
                key={show._id}
                className="bg-[#111] border border-white/10 hover:border-red-500/30 rounded-2xl p-4 sm:p-5 transition-colors duration-200"
              >
                <div className="flex flex-col xl:flex-row xl:items-center gap-5">
                  {show.movieId?.poster?.card ? (
                    <img
                      src={show.movieId.poster.card}
                      alt={show.movieId?.title || "Movie poster"}
                      className="w-full sm:w-36 xl:w-28 h-48 sm:h-44 xl:h-28 rounded-xl object-cover bg-black"
                    />
                  ) : (
                    <div className="w-full sm:w-36 xl:w-28 h-48 sm:h-44 xl:h-28 rounded-xl bg-black border border-white/5 flex items-center justify-center">
                      <FaFilm className="text-white/20 text-3xl" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5">
                    <div className="min-w-0">
                      <p className="text-white/40 text-xs uppercase tracking-wider">
                        Movie
                      </p>

                      <h3 className="font-semibold text-white mt-2 break-words">
                        {show.movieId?.title || "Unknown Movie"}
                      </h3>
                    </div>

                    <div className="min-w-0">
                      <p className="text-white/40 text-xs uppercase tracking-wider">
                        Theatre
                      </p>

                      <h3 className="font-medium text-white mt-2 break-words">
                        {show.theatreId?.name || "Unknown Theatre"}
                      </h3>

                      {show.theatreId?.location?.city && (
                        <p className="text-white/40 text-xs mt-2 flex items-center gap-1.5">
                          <FaMapMarkerAlt className="text-red-400 shrink-0" />
                          {show.theatreId.location.city}
                        </p>
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="text-white/40 text-xs uppercase tracking-wider">
                        Screen
                      </p>

                      <h3 className="font-medium text-white mt-2 break-words">
                        {show.screenId?.name || "Unknown Screen"}
                      </h3>
                    </div>

                    <div className="min-w-0">
                      <p className="text-white/40 text-xs uppercase tracking-wider">
                        Date
                      </p>

                      <h3 className="font-medium text-white mt-2 flex items-center gap-2">
                        <FaCalendarAlt className="text-red-400 shrink-0" />
                        {show.showDate
                          ? new Date(show.showDate).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                timeZone: "UTC",
                              }
                            )
                          : "N/A"}
                      </h3>
                    </div>

                    <div className="min-w-0">
                      <p className="text-white/40 text-xs uppercase tracking-wider">
                        Timing
                      </p>

                      <h3 className="font-medium text-white mt-2 flex items-center gap-2">
                        <FaClock className="text-red-400 shrink-0" />
                        <span className="break-words">
                          {show.startTime || "N/A"}
                          {" - "}
                          {show.endTime || "N/A"}
                        </span>
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() =>
                setCurrentPage((prev) => Math.max(1, prev - 1))
              }
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#111] border border-white/10 text-white/70 hover:border-red-500/50 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <FaChevronLeft className="text-xs" />
              Previous
            </button>

            <span className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-semibold text-sm">
              {currentPage} / {totalPages}
            </span>

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(totalPages, prev + 1)
                )
              }
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#111] border border-white/10 text-white/70 hover:border-red-500/50 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next
              <FaChevronRight className="text-xs" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Shows;