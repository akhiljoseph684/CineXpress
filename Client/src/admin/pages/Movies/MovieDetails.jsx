import React, { useEffect, useState } from "react";
import {
  FaClock,
  FaCalendarAlt,
  FaUserTie,
  FaFilm,
  FaPlay,
  FaStar,
  FaArrowLeft,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { getMovieById } from "../../../services/moviesApi";

function MovieDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await getMovieById(id);

        if (cancelled) return;

        if (!res.success) {
          setError(res.message || "Failed to fetch movie details");
          return;
        }

        setMovie(res.movie);
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || "Failed to fetch movie details");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    if (id) {
      fetchMovieDetails();
    } else {
      setError("Movie ID is missing");
      setLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center bg-[#080808] text-gray-400">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-800 border-t-red-600" />
          <p className="text-sm font-medium">Loading Movie...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center bg-[#080808] px-4">
        <div className="w-full max-w-lg rounded-2xl border border-red-600/30 bg-[#111111] p-8 text-center sm:p-10">
          <div className="mb-4 text-5xl">⚠️</div>
          <h2 className="break-words text-xl font-bold text-red-500 sm:text-2xl">
            {error}
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="mt-6 rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!movie) return null;

  const bannerImage = movie.poster?.banner || movie.poster?.thumbnail;
  const thumbnailImage = movie.poster?.thumbnail || movie.poster?.banner;

  return (
    <div className="w-full min-w-0 max-w-full overflow-x-clip bg-[#080808] px-3 py-6 text-white sm:px-5 lg:px-6">
      <div className="mx-auto w-full min-w-0 max-w-7xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-gray-400 transition hover:text-red-500"
        >
          <FaArrowLeft />
          Back
        </button>

        <div className="relative h-[360px] w-full min-w-0 max-w-full overflow-hidden rounded-2xl border border-white/10 bg-[#111111] sm:h-[400px] lg:h-[440px]">
          {bannerImage && (
            <img
              src={bannerImage}
              alt={movie.title}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10" />

          <div className="absolute inset-x-0 bottom-0 flex w-full min-w-0 items-end gap-4 p-4 sm:gap-6 sm:p-6 lg:p-8">
            {thumbnailImage && (
              <img
                src={thumbnailImage}
                alt={movie.title}
                className="hidden h-44 w-32 shrink-0 rounded-xl border border-red-600/40 object-cover shadow-xl sm:block lg:h-56 lg:w-40"
              />
            )}

            <div className="min-w-0 flex-1 overflow-hidden">
              <h1 className="break-words text-2xl font-bold leading-tight sm:text-3xl lg:text-5xl">
                {movie.title}
              </h1>

              <div className="mt-4 flex flex-wrap gap-2">
                {movie.genre?.map((item, index) => (
                  <span
                    key={item._id || `${item.name}-${index}`}
                    className="rounded-full border border-red-600/30 bg-red-600/15 px-3 py-1.5 text-xs text-red-400 sm:px-4 sm:py-2 sm:text-sm"
                  >
                    {item.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          <div className="min-w-0 space-y-6 lg:col-span-2 lg:space-y-8">
            <div className="min-w-0 rounded-2xl border border-white/[0.07] bg-[#111111] p-5 sm:p-6">
              <h2 className="mb-4 text-xl font-bold sm:text-2xl">
                Description
              </h2>
              <p className="break-words leading-7 text-gray-400 sm:leading-8">
                {movie.description || "-"}
              </p>
            </div>

            <div className="min-w-0 rounded-2xl border border-white/[0.07] bg-[#111111] p-5 sm:p-6">
              <h2 className="mb-6 text-xl font-bold sm:text-2xl">
                Cast <span className="text-red-500">🎭</span>
              </h2>

              {movie.cast?.length ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
                  {movie.cast.map((actor, index) => {
                    const actorData = actor.actorId;
                    const actorName = actorData?.name || actor.name || "Actor";

                    return (
                      <div
                        key={actorData?._id || index}
                        className="group min-w-0 rounded-xl border border-white/[0.07] bg-[#181818] p-3 text-center transition duration-300 hover:-translate-y-1 hover:border-red-600/50 sm:rounded-2xl sm:p-4"
                      >
                        <img
                          src={
                            actorData?.profileImage ||
                            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThZwd0Ar5WsR1Z-ylhArKLTDqEhKPlMqWvZw&s"
                          }
                          alt={actorName}
                          className="mx-auto h-16 w-16 rounded-full border-2 border-red-600/30 object-cover transition group-hover:border-red-600 sm:h-24 sm:w-24 sm:border-4"
                        />

                        <h3 className="mt-3 break-words text-sm font-semibold transition group-hover:text-red-400 sm:mt-4 sm:text-base">
                          {actorName}
                        </h3>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No cast information available.</p>
              )}
            </div>
          </div>

          <div className="min-w-0 space-y-6">
            <div className="min-w-0 space-y-5 rounded-2xl border border-white/[0.07] bg-[#111111] p-5 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <FaClock className="shrink-0 text-red-500" />
                  Duration
                </div>
                <span className="text-right text-sm font-semibold">
                  {movie.duration || 0} min
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <FaCalendarAlt className="shrink-0 text-red-500" />
                  Release
                </div>
                <span className="text-right text-sm font-semibold">
                  {movie.releaseDate
                    ? new Date(movie.releaseDate).toLocaleDateString()
                    : "-"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <FaUserTie className="shrink-0 text-red-500" />
                  Director
                </div>
                <span className="max-w-[60%] break-words text-right text-sm font-semibold">
                  {movie.director || "-"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <FaFilm className="shrink-0 text-red-500" />
                  Producer
                </div>
                <span className="max-w-[60%] break-words text-right text-sm font-semibold">
                  {movie.producer || "-"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <FaStar className="shrink-0 text-red-500" />
                  Rating
                </div>
                <span className="flex items-center gap-1 text-sm font-semibold text-red-400">
                  <FaStar />
                  {Number(movie.avgRating || 0).toFixed(1)}
                </span>
              </div>

              <div className="border-t border-white/[0.07] pt-5">
                <h3 className="mb-3 font-medium text-gray-400">
                  Languages
                </h3>

                <div className="flex flex-wrap gap-2">
                  {movie.language?.length ? (
                    movie.language.map((item, index) => (
                      <span
                        key={item._id || `${item.name}-${index}`}
                        className="rounded-full border border-white/[0.07] bg-[#1b1b1b] px-3 py-2 text-sm text-gray-300"
                      >
                        {item.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">-</span>
                  )}
                </div>
              </div>
            </div>

            {movie.trailer && (
              <a
                href={`/trailer/${movie._id}`}
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-red-600 py-4 font-semibold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700"
              >
                <FaPlay />
                Watch Trailer
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;