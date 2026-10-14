import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt } from "react-icons/fa";
import { getMovieShows } from "../services/showApi";
import { getMovieById } from "../services/moviesApi";

const MovieShowsPage = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();

  const [shows, setShows] = useState([]);
  const [movie, setMovie] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toLocaleDateString("en-CA")
  );

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    if (movieId) {
      fetchShows();
    }
  }, [movieId, selectedDate]);

  useEffect(() => {
    if (movieId) {
      fetchMovie();
    }
  }, [movieId]);

  const fetchMovie = async () => {
    try {
      const res = await getMovieById(movieId);
      setMovie(res.movie || {});
    } catch (error) {
      console.error(error);
    }
  };

  const fetchShows = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getMovieShows(movieId, selectedDate);
      setShows(res.shows || []);
    } catch (error) {
      console.error(error);
      setError("Unable to load shows. Please try again.");
      setShows([]);
    } finally {
      setLoading(false);
    }
  };

  const generateDates = () => {
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() + index);
      return date;
    });
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatShowTime = (time) => {
    if (!time) return "--:--";

    const parsedDate = new Date(`2000-01-01T${time}`);

    if (Number.isNaN(parsedDate.getTime())) {
      return time;
    }

    return parsedDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="min-h-screen overflow-hidden bg-black text-white">
      <div className="relative border-b border-gray-800 bg-gradient-to-b from-[#171717] to-black">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
          <div className="max-w-3xl">
            <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[4px] text-red-500 sm:text-sm">
              <FaTicketAlt />
              Book Tickets
            </p>

            <h1 className="break-words text-3xl font-black leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
              {movie.title || "Movie Shows"}
            </h1>

            <div className="mt-5 flex flex-wrap gap-2">
              {movie.genre?.map((genre) => (
                <span
                  key={genre._id || genre.name}
                  className="rounded-full border border-red-600/30 bg-red-600/10 px-3 py-1.5 text-xs text-red-300 sm:px-4 sm:py-2 sm:text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="sticky top-0 z-40 border-b border-gray-800 bg-black/90 backdrop-blur-2xl">
        <div className="mx-auto grid max-w-7xl grid-cols-7 gap-2 px-3 py-3 sm:px-6 lg:px-8">
          {generateDates().map((date) => {
            const formattedDate = formatDate(date);
            const isSelected = selectedDate === formattedDate;

            return (
              <button
                key={formattedDate}
                onClick={() => setSelectedDate(formattedDate)}
                className={`flex min-w-0 flex-col items-center rounded-xl border px-1 py-2 transition-all duration-300 sm:px-3 sm:py-3 ${
                  isSelected
                    ? "border-red-500 bg-red-600 text-white shadow-lg shadow-red-600/20"
                    : "border-gray-800 bg-[#111111] text-gray-300 hover:border-red-600/60 hover:bg-red-600/10"
                }`}
              >
                <span className="text-[9px] uppercase text-white/70 sm:text-[10px]">
                  {date.toLocaleDateString("en-US", {
                    weekday: "short",
                  })}
                </span>

                <span className="mt-0.5 text-base font-black sm:text-lg">
                  {date.getDate()}
                </span>

                <span className="mt-0.5 text-[9px] text-white/70 sm:text-[10px]">
                  {date.toLocaleDateString("en-US", {
                    month: "short",
                  })}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-800 border-t-red-600" />
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-600/30 bg-[#111111] p-8 text-center sm:p-12">
            <p className="text-lg font-semibold text-red-400">{error}</p>
            <button
              onClick={fetchShows}
              className="mt-5 rounded-xl bg-red-600 px-6 py-3 font-semibold transition hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        ) : shows.length === 0 ? (
          <div className="rounded-3xl border border-gray-800 bg-[#111111] p-8 text-center sm:p-12">
            <FaCalendarAlt className="mx-auto mb-5 text-4xl text-red-500" />
            <h2 className="text-2xl font-bold sm:text-3xl">
              No Shows Found
            </h2>
            <p className="mt-3 text-sm text-gray-400 sm:text-base">
              No shows available for the selected date.
            </p>
          </div>
        ) : (
          <div className="space-y-5 sm:space-y-6">
            {shows.map((item) => (
              <div
                key={item._id}
                className="overflow-hidden rounded-3xl border border-gray-800 bg-[#111111] transition hover:border-red-600/30"
              >
                <div className="flex flex-col xl:flex-row">
                  <div className="w-full border-b border-gray-800 bg-[#151515] p-5 sm:p-6 xl:w-80 xl:border-b-0 xl:border-r lg:p-8">
                    <h2 className="break-words text-2xl font-bold leading-tight sm:text-3xl">
                      {item.theatre?.name || "Theatre"}
                    </h2>

                    <p className="mt-4 flex items-start gap-2 text-sm leading-relaxed text-gray-400 sm:text-base">
                      <FaMapMarkerAlt className="mt-1 shrink-0 text-red-500" />
                      {item.theatre?.address || "Address unavailable"}
                    </p>

                    <div className="mt-6 flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                      <p className="text-sm font-medium text-green-400">
                        Shows Available
                      </p>
                    </div>
                  </div>

                  <div className="flex-1 p-4 sm:p-6 lg:p-8">
                    {!item.shows?.length ? (
                      <p className="py-6 text-center text-gray-500">
                        No showtimes available at this theatre.
                      </p>
                    ) : (
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 xl:grid-cols-5">
                        {item.shows.map((show) => (
                          <button
                            key={show._id}
                            onClick={() =>
                              navigate(`/booking/movie/${show._id}`)
                            }
                            className="group w-full rounded-2xl border border-red-600/20 bg-black px-3 py-4 transition-all duration-300 hover:-translate-y-1 hover:border-red-500 hover:bg-red-600/10 sm:px-5 sm:py-5"
                          >
                            <h3 className="text-lg font-bold text-red-400 transition group-hover:text-red-300 sm:text-xl lg:text-2xl">
                              {formatShowTime(show.startTime)}
                            </h3>

                            <p className="mt-2 text-[11px] text-gray-500 sm:text-xs">
                              {show.screen || "Standard Screen"}
                            </p>

                            <span className="mt-3 inline-block text-xs font-medium text-gray-400 transition group-hover:text-red-400">
                              Select Show →
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieShowsPage;