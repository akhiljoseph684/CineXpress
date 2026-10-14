import React, { useEffect, useRef, useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaStar,
  FaClock,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getAllMovies } from "../../services/moviesApi";

function MovieListing({ title = "Now Showing", query = "" }) {
  const navigate = useNavigate();
  const scrollRef = useRef();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const res = await getAllMovies(
          query ? `${query}&limit=12` : "?limit=12"
        );
        setMovies(res.movies || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [query]);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({
      left: -600,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({
      left: 600,
      behavior: "smooth",
    });
  };

  return (
    <section className="bg-black px-4 py-8 sm:px-5 sm:py-10 md:px-8 md:py-12">
      <div className="mb-6 flex flex-col justify-between gap-5 sm:mb-8 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-black text-white sm:text-3xl md:text-4xl">
            {title}
          </h2>
          <p className="mt-2 text-sm text-gray-400 md:text-base">
            Discover trending movies
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 sm:justify-end">
          <button
            onClick={() => navigate("/movies")}
            className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 md:px-5 md:py-3 md:text-base"
          >
            See All
          </button>

          <div className="hidden items-center gap-3 md:flex">
            <button
              onClick={scrollLeft}
              aria-label="Scroll left"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:border-red-600 hover:bg-red-600"
            >
              <FaChevronLeft />
            </button>

            <button
              onClick={scrollRight}
              aria-label="Scroll right"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:border-red-600 hover:bg-red-600"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex gap-4 overflow-hidden">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="h-[280px] min-w-[160px] animate-pulse rounded-3xl bg-white/5 sm:h-[320px] sm:min-w-[200px] md:h-[380px] md:min-w-[240px]"
            />
          ))}
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-3 md:gap-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {movies.map((movie) => (
            <div
              key={movie._id}
              onClick={() => navigate(`/movies/${movie._id}`)}
              className="group min-w-[160px] max-w-[160px] shrink-0 cursor-pointer snap-start overflow-hidden rounded-3xl border border-white/10 bg-[#0A0A0A] transition-all duration-300 hover:-translate-y-2 hover:border-red-600/50 sm:min-w-[210px] sm:max-w-[210px] md:min-w-[250px] md:max-w-[250px]"
            >
              <div className="relative h-[230px] overflow-hidden sm:h-[300px] md:h-[340px]">
                <img
                  src={movie.poster?.card}
                  alt={movie.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                <div className="absolute left-3 top-3 rounded-full border border-red-500/30 bg-red-600 px-2.5 py-1 text-[10px] font-semibold text-white sm:text-xs">
                  {title}
                </div>

                <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-[10px] text-white backdrop-blur-md sm:text-xs">
                  <FaStar className="text-red-500" />
                  {movie.avgRating?.toFixed(1) || "0"}
                </div>
              </div>

              <div className="p-3 sm:p-4 md:p-5">
                <h3 className="line-clamp-1 text-sm font-bold text-white transition group-hover:text-red-500 sm:text-lg md:text-xl">
                  {movie.title}
                </h3>

                <p className="mt-2 line-clamp-1 text-xs text-gray-400 sm:text-sm">
                  {movie.genre?.map((g) => g.name).join(", ")}
                </p>

                <div className="mt-4 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-300 sm:text-sm">
                    <FaClock className="text-red-500" />
                    {Math.floor(movie.duration / 60)}h{" "}
                    {movie.duration % 60
                      ? `${movie.duration % 60}m`
                      : ""}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/shows/movie/${movie._id}`);
                    }}
                    className="whitespace-nowrap rounded-xl bg-red-600 px-3 py-2 text-[11px] font-medium text-white transition hover:bg-red-700 sm:text-sm md:px-4"
                  >
                    Book
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div
            onClick={() => navigate("/movies")}
            className="flex h-[330px] min-w-[160px] shrink-0 cursor-pointer snap-start flex-col items-center justify-center rounded-3xl border-2 border-dashed border-red-600/40 transition hover:bg-red-600/10 sm:h-[420px] sm:min-w-[210px] md:h-[470px] md:min-w-[250px]"
          >
            <h3 className="text-center text-lg font-bold text-white transition hover:text-red-500 sm:text-xl md:text-2xl">
              Explore More
            </h3>
            <p className="mt-3 text-xs text-gray-400 sm:text-sm">
              View all movies →
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

export default MovieListing;