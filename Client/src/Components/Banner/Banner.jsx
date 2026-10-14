import React, { useEffect, useState } from "react";
import { FaPlay, FaClock, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { bannerFetch } from "../../services/moviesApi";

function Banner() {
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await bannerFetch();
        setMovies(res.movies || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanner();
  }, []);

  useEffect(() => {
    if (!movies.length) return;

    const interval = setInterval(() => {
      setCurrent((prev) =>
        prev === movies.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [movies]);

  if (loading) {
    return (
      <div className="h-[70vh] animate-pulse bg-black sm:h-[80vh] md:h-screen" />
    );
  }

  if (!movies.length) {
    return (
      <section className="flex h-[70vh] items-center justify-center bg-black text-white sm:h-[80vh] md:h-screen">
        <p className="text-lg font-semibold">
          No movies available
        </p>
      </section>
    );
  }

  return (
    <section className="relative h-[70vh] w-full overflow-hidden bg-black sm:h-[80vh] md:h-screen">
      {movies.map((movie, index) => (
        <div
          key={movie._id}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            current === index
              ? "pointer-events-auto scale-100 opacity-100"
              : "pointer-events-none scale-105 opacity-0"
          }`}
        >
          <img
            src={movie.poster?.banner}
            alt={movie.title}
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/20 md:bg-gradient-to-r md:from-black md:via-black/70 md:to-transparent" />

          <div className="relative z-10 flex h-full items-end px-4 pb-16 sm:px-6 md:items-center md:px-16 md:pb-0">
            <div className="w-full max-w-3xl">
              <div className="mb-4 inline-flex items-center rounded-full border border-red-500/40 bg-red-600/20 px-3 py-1.5 text-xs text-red-400 sm:text-sm md:mb-5 md:px-4 md:py-2">
                Now Showing
              </div>

              <h1 className="text-3xl font-black leading-tight text-white sm:text-5xl md:text-7xl">
                {movie.title}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-300 sm:gap-5 sm:text-base md:mt-6">
                <div className="flex items-center gap-2">
                  <FaClock className="text-red-500" />
                  {Math.floor(movie.duration / 60)}h{" "}
                  {movie.duration % 60
                    ? `${movie.duration % 60}m`
                    : ""}
                </div>

                <div className="flex items-center gap-2">
                  <FaStar className="text-red-500" />
                  {movie.ratings?.toFixed(1) || "3.5"}
                </div>

                <div className="truncate">
                  {movie.language
                    ?.map((lang) => lang.name)
                    .join(", ")}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 sm:gap-3 md:mt-5">
                {movie.genre?.map((genre) => (
                  <span
                    key={genre._id}
                    className="rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-xs text-white backdrop-blur-md sm:px-4 sm:py-2 sm:text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              <p className="mt-4 line-clamp-2 max-w-2xl text-sm leading-relaxed text-gray-300 sm:text-base md:mt-6 md:line-clamp-3 md:text-lg">
                {movie.description}
              </p>

              <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4 md:mt-8">
                <button
                  onClick={() =>
                    navigate(`/shows/movie/${movie._id}`)
                  }
                  className="w-full rounded-2xl bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700 sm:w-auto sm:text-base md:px-8 md:py-4"
                >
                  Book Tickets
                </button>

                <button
                  onClick={() =>
                    navigate(`/trailer/${movie._id}`)
                  }
                  className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/30 bg-white/5 px-6 py-3 text-sm text-white backdrop-blur-md transition hover:border-red-600 hover:bg-red-600 sm:w-auto sm:text-base md:px-8 md:py-4"
                >
                  <FaPlay className="text-red-500" />
                  Watch Trailer
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 sm:gap-3 md:bottom-10">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            aria-label={`Go to movie ${index + 1}`}
            className={`h-2.5 rounded-full transition-all duration-300 md:h-3 ${
              current === index
                ? "w-8 bg-red-600 md:w-10"
                : "w-2.5 bg-white/40 md:w-3"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

export default Banner;