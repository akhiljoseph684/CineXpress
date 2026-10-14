import React, { useEffect, useState } from "react";
import {
  FaSearch,
  FaStar,
  FaClock,
  FaChevronLeft,
  FaChevronRight,
  FaArrowLeft,
  FaFilm,
  FaTimes,
  FaSlidersH,
  FaExclamationCircle,
} from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getAllMovies } from "../services/moviesApi";
import { getGenres, getLanguages } from "../services/categories";

function MoviesPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState(searchParams.get("title") || "");
  const [selectedGenre, setSelectedGenre] = useState(
    searchParams.get("genre") || ""
  );
  const [selectedLanguage, setSelectedLanguage] = useState(
    searchParams.get("language") || ""
  );
  const [page, setPage] = useState(
    Math.max(1, Number(searchParams.get("page")) || 1)
  );
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [page]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [genreRes, languageRes] = await Promise.all([
          getGenres(),
          getLanguages(),
        ]);

        setGenres(genreRes.genres || []);
        setLanguages(languageRes.languages || []);
      } catch (err) {
        console.error("Failed to fetch movie filters:", err);
      }
    };

    fetchFilters();
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams({
          page: String(page),
          limit: "24",
        });

        if (search.trim()) {
          params.set("title", search.trim());
        }

        if (selectedGenre) {
          params.set("genre", selectedGenre);
        }

        if (selectedLanguage) {
          params.set("language", selectedLanguage);
        }

        const nextParams = {};

        nextParams.page = String(page);

        if (search.trim()) {
          nextParams.title = search.trim();
        }

        if (selectedGenre) {
          nextParams.genre = selectedGenre;
        }

        if (selectedLanguage) {
          nextParams.language = selectedLanguage;
        }

        setSearchParams(nextParams, { replace: true });

        const res = await getAllMovies(`?${params.toString()}`);

        setMovies(res.movies || []);
        setTotalPages(Math.max(1, Number(res.totalPages) || 1));
      } catch (err) {
        setMovies([]);
        setTotalPages(1);
        setError(
          err?.response?.data?.message ||
            "Unable to load movies. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search, selectedGenre, selectedLanguage, page, setSearchParams]);

  const clearFilters = () => {
    setSearch("");
    setSelectedGenre("");
    setSelectedLanguage("");
    setPage(1);
  };

  const formatDuration = (duration) => {
    const minutes = Number(duration);

    if (!Number.isFinite(minutes) || minutes <= 0) {
      return "Duration unavailable";
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours === 0) {
      return `${remainingMinutes}m`;
    }

    return remainingMinutes
      ? `${hours}h ${remainingMinutes}m`
      : `${hours}h`;
  };

  const hasFilters = Boolean(
    search.trim() || selectedGenre || selectedLanguage
  );

  return (
    <div className="min-h-screen bg-[#080808] px-4 py-6 text-white sm:px-6 md:px-8 md:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 border-b border-white/[0.08] pb-7">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="mb-7 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[#111111] px-4 py-2.5 text-sm font-medium text-white/65 transition hover:border-red-500/40 hover:bg-red-500/[0.06] hover:text-white"
          >
            <FaArrowLeft className="text-xs" />
            Back to Home
          </button>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-red-500">
                <FaFilm />
                CineXpress Cinema
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
                Explore Movies
                <span className="text-red-500">.</span>
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-white/45 sm:text-base">
                Discover your next favourite movie and find a screening
                that fits your schedule.
              </p>
            </div>

            <div className="relative w-full lg:max-w-sm">
              <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-white/35" />

              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search movies..."
                aria-label="Search movies"
                className="w-full rounded-xl border border-white/10 bg-[#111111] py-4 pl-11 pr-11 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setPage(1);
                  }}
                  aria-label="Clear search"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/35 transition hover:text-red-400"
                >
                  <FaTimes />
                </button>
              )}
            </div>
          </div>
        </header>

        <section className="mb-8 rounded-2xl border border-white/[0.08] bg-[#111111] p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <FaSlidersH className="text-red-400" />
              <h2 className="text-sm font-bold">Filter Movies</h2>
            </div>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-2 text-xs font-semibold text-red-400 transition hover:text-red-300"
              >
                <FaTimes />
                Clear filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label
                htmlFor="genreFilter"
                className="mb-2 block text-xs font-medium text-white/45"
              >
                Genre
              </label>

              <select
                id="genreFilter"
                value={selectedGenre}
                onChange={(e) => {
                  setSelectedGenre(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl border border-white/10 bg-[#080808] px-4 py-3.5 text-sm text-white outline-none transition focus:border-red-500"
              >
                <option value="">All Genres</option>
                {genres.map((genre) => (
                  <option key={genre._id} value={genre._id}>
                    {genre.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="languageFilter"
                className="mb-2 block text-xs font-medium text-white/45"
              >
                Language
              </label>

              <select
                id="languageFilter"
                value={selectedLanguage}
                onChange={(e) => {
                  setSelectedLanguage(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl border border-white/10 bg-[#080808] px-4 py-3.5 text-sm text-white outline-none transition focus:border-red-500"
              >
                <option value="">All Languages</option>
                {languages.map((language) => (
                  <option key={language._id} value={language._id}>
                    {language.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold">
              {hasFilters ? "Search Results" : "Now Discovering"}
            </h2>
            <p className="mt-1 text-xs text-white/40">
              {loading
                ? "Finding movies for you..."
                : `${movies.length} ${movies.length === 1 ? "movie" : "movies"} on this page`}
            </p>
          </div>

          {totalPages > 1 && (
            <span className="rounded-full border border-white/10 bg-[#111111] px-3 py-1.5 text-xs text-white/50">
              Page {page} of {totalPages}
            </span>
          )}
        </div>

        {error && !loading && (
          <div className="mb-6 flex flex-col gap-3 rounded-xl border border-red-500/20 bg-red-500/[0.07] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3 text-sm text-red-300">
              <FaExclamationCircle className="mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>

            <button
              type="button"
              onClick={() => {
                setPage((prev) => prev);
                setSearch((prev) => `${prev}`);
              }}
              className="self-start text-sm font-semibold text-white underline underline-offset-4 hover:text-red-300 sm:self-center"
            >
              Try again
            </button>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-4">
            {Array.from({ length: 12 }, (_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#111111]"
              >
                <div className="aspect-[3/4] animate-pulse bg-white/[0.05]" />

                <div className="space-y-3 p-3 sm:p-4">
                  <div className="h-4 w-4/5 animate-pulse rounded bg-white/[0.06]" />
                  <div className="h-3 w-2/3 animate-pulse rounded bg-white/[0.04]" />
                  <div className="mt-4 h-9 animate-pulse rounded-lg bg-white/[0.05]" />
                </div>
              </div>
            ))}
          </div>
        ) : movies.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
            {movies.map((movie) => (
              <article
                key={movie._id}
                className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111111] transition duration-300 hover:-translate-y-1 hover:border-red-500/40 hover:shadow-xl hover:shadow-red-950/10"
              >
                <button
                  type="button"
                  onClick={() => navigate(`/movies/${movie._id}`)}
                  aria-label={`View details for ${movie.title}`}
                  className="relative block aspect-[3/4] w-full overflow-hidden bg-black text-left"
                >
                  {movie.poster?.card ? (
                    <img
                      src={movie.poster.card}
                      alt={movie.title || "Movie poster"}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-4xl text-white/20">
                      <FaFilm />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent opacity-90" />

                  <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/65 px-2.5 py-1.5 text-xs font-semibold backdrop-blur-md">
                    <FaStar className="text-yellow-400" />
                    <span>
                      {Number.isFinite(Number(movie.avgRating))
                        ? Number(movie.avgRating).toFixed(1)
                        : "0.0"}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-red-400">
                      Movie
                    </p>
                    <h3 className="mt-1 line-clamp-2 text-base font-bold leading-snug text-white sm:text-lg">
                      {movie.title}
                    </h3>
                  </div>
                </button>

                <div className="flex flex-1 flex-col p-3 sm:p-4">
                  <p className="line-clamp-1 min-h-5 text-xs text-white/45">
                    {movie.genre?.map((genre) => genre.name).join(", ") ||
                      "Genre unavailable"}
                  </p>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-1.5 text-xs text-white/55 sm:text-sm">
                      <FaClock className="shrink-0 text-red-400" />
                      <span className="truncate">
                        {formatDuration(movie.duration)}
                      </span>
                    </div>

                    <span className="shrink-0 text-[10px] font-medium uppercase tracking-wide text-white/35">
                      Details
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate(`/shows/movie/${movie._id}`)}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-3 py-2.5 text-xs font-bold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/40 sm:text-sm"
                  >
                    <FaTicketAlt />
                    Book Tickets
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/[0.08] bg-[#111111] px-5 py-16 text-center sm:px-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/15 bg-red-500/[0.07] text-2xl text-red-400">
              <FaFilm />
            </div>

            <h2 className="mt-5 text-xl font-bold sm:text-2xl">
              No Movies Found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/40">
              We couldn't find any movies matching your search. Try changing
              your keywords or removing some filters.
            </p>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                <FaTimes />
                Clear All Filters
              </button>
            )}
          </div>
        )}

        {!loading && !error && totalPages > 1 && (
          <nav
            aria-label="Movie pagination"
            className="mt-10 flex flex-wrap items-center justify-center gap-3 border-t border-white/[0.08] pt-7"
          >
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-[#111111] px-4 text-sm font-semibold text-white/65 transition hover:border-red-500/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            >
              <FaChevronLeft className="text-xs" />
              Previous
            </button>

            <div className="rounded-xl border border-white/10 bg-[#111111] px-4 py-2.5 text-sm text-white/65">
              <span className="font-bold text-white">{page}</span>
              <span className="mx-2 text-white/25">/</span>
              {totalPages}
            </div>

            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() =>
                setPage((prev) => Math.min(totalPages, prev + 1))
              }
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-[#111111] px-4 text-sm font-semibold text-white/65 transition hover:border-red-500/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            >
              Next
              <FaChevronRight className="text-xs" />
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}

export default MoviesPage;