import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createShow,
  editShow,
  getShowById,
} from "../../services/showApi";
import { getAllMovies } from "../../services/moviesApi";
import { getScreenById } from "../../services/screensApi";
import {
  FaFilm,
  FaTimes,
  FaClock,
  FaPlus,
  FaTheaterMasks,
  FaCalendarAlt,
  FaTicketAlt,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";

function CreateShowPage() {
  const navigate = useNavigate();
  const errorRef = useRef(null);
  const { screenId, id } = useParams();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [screen, setScreen] = useState(null);
  const [movies, setMovies] = useState([]);
  const [movieSearch, setMovieSearch] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);

  const [formData, setFormData] = useState({
    movieId: "",
    theatreId: "",
    screenId: "",
    startDate: "",
    endDate: "",
    showTimes: [],
    timeInput: "",
  });

  const inputClasses =
    "w-full rounded-xl border border-white/10 bg-[#0b0b0b] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-red-500 focus:ring-2 focus:ring-red-500/10";

  const cardClasses =
    "rounded-2xl border border-white/[0.08] bg-[#111111]";

  const scrollToError = () => {
    setTimeout(() => {
      errorRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  };

  useEffect(() => {
    if (screenId) {
      fetchScreen();
    }
  }, [screenId]);

  useEffect(() => {
    if (isEdit) {
      fetchShow();
    }
  }, [id]);

  useEffect(() => {
    fetchMovies();
  }, [movieSearch]);

  const fetchScreen = async () => {
    try {
      const res = await getScreenById(screenId);
      const currentScreen = res.screen;

      setScreen(currentScreen);

      setFormData((prev) => ({
        ...prev,
        screenId: currentScreen._id,
        theatreId: currentScreen.theatre?._id,
      }));
    } catch (err) {
      setError(
        err?.response?.data?.message || "Unable to load screen details."
      );
    }
  };

  const fetchMovies = async () => {
    try {
      const res = await getAllMovies(
        `?title=${encodeURIComponent(movieSearch)}&page=1&limit=5`
      );

      setMovies(res.movies || []);
    } catch (err) {
      console.error("Failed to fetch movies:", err);
    }
  };

  const fetchShow = async () => {
    try {
      const res = await getShowById(id);
      const show = res.show;

      setSelectedMovie(show.movieId);

      const showDate = show.showDate
        ? new Date(show.showDate).toISOString().slice(0, 10)
        : "";

      setFormData((prev) => ({
        ...prev,
        movieId: show.movieId?._id || "",
        theatreId: show.theatreId?._id || "",
        screenId: show.screenId?._id || "",
        startDate: showDate,
        endDate: showDate,
        showTimes: show.startTime ? [show.startTime] : [],
        timeInput: "",
      }));

      if (show.screenId?._id) {
        try {
          const screenRes = await getScreenById(show.screenId._id);
          setScreen(screenRes.screen);
        } catch (err) {
          console.error("Failed to fetch screen details:", err);
        }
      }
    } catch (err) {
      setError(
        err?.response?.data?.message || "Unable to load show details."
      );
    }
  };

  const generatedShows = useMemo(() => {
    if (!selectedMovie) {
      return [];
    }

    return [...formData.showTimes].sort().map((time) => {
      const start = new Date(`2025-01-01T${time}`);
      const end = new Date(
        start.getTime() + (Number(selectedMovie.duration) + 15) * 60000
      );

      return {
        start: time,
        end: end.toTimeString().slice(0, 5),
      };
    });
  }, [selectedMovie, formData.showTimes]);

  const addShowTime = () => {
    if (!formData.timeInput) {
      setError("Please select a show time first.");
      scrollToError();
      return;
    }

    if (!selectedMovie) {
      setError("Please select a movie before adding show times.");
      scrollToError();
      return;
    }

    if (formData.showTimes.includes(formData.timeInput)) {
      setError("This show time has already been added.");
      scrollToError();
      return;
    }

    const duration = Number(selectedMovie.duration);
    const breakTime = 15;

    const toMinutes = (time) => {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    };

    const newStart = toMinutes(formData.timeInput);
    const newEnd = newStart + duration;

    const hasConflict = formData.showTimes.some((time) => {
      const existingStart = toMinutes(time);
      const existingEnd = existingStart + duration + breakTime;

      return (
        newStart < existingEnd &&
        newEnd + breakTime > existingStart
      );
    });

    if (hasConflict) {
      setError("Show time conflict detected. Allow a 15-minute break between shows.");
      scrollToError();
      return;
    }

    setError("");

    setFormData((prev) => ({
      ...prev,
      showTimes: [...prev.showTimes, prev.timeInput].sort(),
      timeInput: "",
    }));
  };

  const removeTime = (index) => {
    setFormData((prev) => ({
      ...prev,
      showTimes: prev.showTimes.filter((_, i) => i !== index),
    }));
  };

  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie);
    setMovieSearch("");

    setFormData((prev) => ({
      ...prev,
      movieId: movie._id,
    }));

    setError("");
  };

  const clearSelectedMovie = () => {
    setSelectedMovie(null);

    setFormData((prev) => ({
      ...prev,
      movieId: "",
      showTimes: [],
      timeInput: "",
    }));

    setError("");
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!formData.movieId) {
      setError("Please select a movie.");
      scrollToError();
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      setError("Please select both the start date and end date.");
      scrollToError();
      return;
    }

    if (formData.endDate < formData.startDate) {
      setError("End date cannot be earlier than start date.");
      scrollToError();
      return;
    }

    if (formData.showTimes.length === 0) {
      setError("Please add at least one show time.");
      scrollToError();
      return;
    }

    try {
      setLoading(true);
      setError("");

      const payload = {
        movieId: formData.movieId,
        theatreId: formData.theatreId,
        screenId: formData.screenId,
        startDate: formData.startDate,
        endDate: formData.endDate,
        showTimes: formData.showTimes,
      };

      const res = isEdit
        ? await editShow(id, payload)
        : await createShow(payload);

      if (!res.success) {
        setError(res.message || "Unable to save the show.");
        scrollToError();
        return;
      }

      navigate("/theatre-owner/shows");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Something went wrong. Please try again."
      );
      scrollToError();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] px-4 py-6 text-white sm:px-6 sm:py-10">
      <form
        onSubmit={submitHandler}
        className="mx-auto max-w-6xl space-y-8"
      >
        <div className="flex flex-col justify-between gap-5 border-b border-white/[0.08] pb-7 sm:flex-row sm:items-center">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-red-500">
              <FaFilm />
              CineXpress Theatre Management
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              {isEdit ? "Edit Show" : "Create Show"}
              <span className="ml-2 text-red-500">.</span>
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-white/45">
              Schedule movies, manage screening dates, and organize show
              timings for your theatre.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/theatre-owner/shows")}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium text-white/70 transition hover:border-red-500/40 hover:bg-red-500/5 hover:text-white sm:self-center"
          >
            <FaTimes />
            Cancel
          </button>
        </div>

        {error && (
          <div
            ref={errorRef}
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-red-500/25 bg-red-500/[0.08] p-4 text-sm text-red-300"
          >
            <FaExclamationCircle className="mt-0.5 shrink-0 text-red-400" />
            <p>{error}</p>
          </div>
        )}

        {screen && (
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className={`${cardClasses} p-5 transition hover:border-red-500/25`}>
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                <FaTheaterMasks />
              </div>
              <p className="text-xs font-medium uppercase tracking-wider text-white/40">
                Theatre
              </p>
              <h2 className="mt-2 break-words text-lg font-bold">
                {screen.theatre?.name || "Theatre"}
              </h2>
            </div>

            <div className={`${cardClasses} p-5 transition hover:border-red-500/25`}>
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                <FaFilm />
              </div>
              <p className="text-xs font-medium uppercase tracking-wider text-white/40">
                Screen
              </p>
              <h2 className="mt-2 break-words text-lg font-bold">
                {screen.name}
              </h2>
            </div>

            <div className={`${cardClasses} p-5 transition hover:border-red-500/25`}>
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                <FaTicketAlt />
              </div>
              <p className="text-xs font-medium uppercase tracking-wider text-white/40">
                Screen Type
              </p>
              <h2 className="mt-2 break-words text-lg font-bold">
                {screen.screenType || "Standard"}
              </h2>
            </div>
          </section>
        )}

        <section className={`${cardClasses} p-5 sm:p-6`}>
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
              <FaFilm />
            </div>
            <div>
              <h2 className="text-lg font-bold sm:text-xl">Select Movie</h2>
              <p className="mt-1 text-xs text-white/40">
                Search and select a movie for this screening.
              </p>
            </div>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search movies by title..."
              value={movieSearch}
              onChange={(e) => setMovieSearch(e.target.value)}
              className={inputClasses}
            />

            {movieSearch.trim() && movies.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-80 overflow-y-auto rounded-xl border border-white/10 bg-[#151515] shadow-2xl shadow-black/50">
                {movies.map((movie) => (
                  <button
                    key={movie._id}
                    type="button"
                    onClick={() => handleMovieSelect(movie)}
                    className="flex w-full items-center gap-4 border-b border-white/[0.06] p-3 text-left transition last:border-b-0 hover:bg-red-500/[0.07]"
                  >
                    {movie.poster?.card ? (
                      <img
                        src={movie.poster.card}
                        alt={movie.title}
                        className="h-16 w-12 shrink-0 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-12 shrink-0 items-center justify-center rounded-lg bg-white/5 text-white/30">
                        <FaFilm />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-semibold text-white">
                        {movie.title}
                      </h3>
                      <p className="mt-1 text-xs text-white/45">
                        {movie.duration} minutes
                      </p>
                    </div>

                    <FaPlus className="shrink-0 text-sm text-red-400" />
                  </button>
                ))}
              </div>
            )}

            {movieSearch.trim() && movies.length === 0 && (
              <div className="mt-2 rounded-xl border border-white/[0.08] bg-black/30 p-4 text-sm text-white/45">
                No movies found. Try another title.
              </div>
            )}
          </div>

          {selectedMovie && (
            <div className="mt-5 flex flex-col gap-4 rounded-xl border border-red-500/20 bg-red-500/[0.04] p-4 sm:flex-row sm:items-center">
              {selectedMovie.poster?.card ? (
                <img
                  src={selectedMovie.poster.card}
                  alt={selectedMovie.title}
                  className="h-28 w-20 shrink-0 rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-28 w-20 shrink-0 items-center justify-center rounded-lg bg-white/5 text-white/30">
                  <FaFilm className="text-2xl" />
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-red-400">
                  Selected Movie
                </p>
                <h3 className="mt-2 break-words text-xl font-bold sm:text-2xl">
                  {selectedMovie.title}
                </h3>
                <p className="mt-2 text-sm text-white/45">
                  Duration: {selectedMovie.duration} minutes
                </p>
              </div>

              <button
                type="button"
                onClick={clearSelectedMovie}
                aria-label="Remove selected movie"
                className="flex h-10 w-10 shrink-0 items-center justify-center self-end rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 transition hover:bg-red-500 hover:text-white sm:self-center"
              >
                <FaTimes />
              </button>
            </div>
          )}
        </section>

        <section className={`${cardClasses} p-5 sm:p-6`}>
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
              <FaCalendarAlt />
            </div>
            <div>
              <h2 className="text-lg font-bold sm:text-xl">Screening Dates</h2>
              <p className="mt-1 text-xs text-white/40">
                Choose the date range for this movie.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="startDate"
                className="mb-2 block text-sm font-medium text-white/65"
              >
                Start Date
              </label>
              <input
                id="startDate"
                type="date"
                required
                value={formData.startDate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                    endDate:
                      prev.endDate && prev.endDate < e.target.value
                        ? e.target.value
                        : prev.endDate,
                  }))
                }
                className={inputClasses}
              />
            </div>

            <div>
              <label
                htmlFor="endDate"
                className="mb-2 block text-sm font-medium text-white/65"
              >
                End Date
              </label>
              <input
                id="endDate"
                type="date"
                min={formData.startDate || undefined}
                required
                value={formData.endDate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    endDate: e.target.value,
                  }))
                }
                className={inputClasses}
              />
            </div>
          </div>
        </section>

        <section className={`${cardClasses} p-5 sm:p-6`}>
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
              <FaClock />
            </div>
            <div>
              <h2 className="text-lg font-bold sm:text-xl">Show Timings</h2>
              <p className="mt-1 text-xs text-white/40">
                Add each screening time. A 15-minute break is included in the
                schedule preview.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex-1">
              <label
                htmlFor="timeInput"
                className="mb-2 block text-sm font-medium text-white/65"
              >
                Start Time
              </label>
              <input
                id="timeInput"
                type="time"
                value={formData.timeInput}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    timeInput: e.target.value,
                  }))
                }
                className={inputClasses}
              />
            </div>

            <button
              type="button"
              onClick={addShowTime}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/40 sm:mt-7 sm:self-start"
            >
              <FaPlus />
              Add Time
            </button>
          </div>

          {formData.showTimes.length > 0 ? (
            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white/75">
                  Added Show Times
                </h3>
                <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-400">
                  {formData.showTimes.length}{" "}
                  {formData.showTimes.length === 1 ? "show" : "shows"}
                </span>
              </div>

              <div className="flex flex-wrap gap-3">
                {[...formData.showTimes].sort().map((time, index) => (
                  <div
                    key={time}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/40 px-4 py-3"
                  >
                    <FaClock className="text-sm text-red-400" />
                    <span className="text-sm font-semibold">{time}</span>
                    <button
                      type="button"
                      onClick={() => removeTime(formData.showTimes.indexOf(time))}
                      aria-label={`Remove show time ${time}`}
                      className="ml-1 text-white/35 transition hover:text-red-400"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-xl border border-dashed border-white/10 bg-black/20 px-4 py-8 text-center">
              <FaClock className="mx-auto text-2xl text-white/20" />
              <p className="mt-3 text-sm font-medium text-white/50">
                No show times added yet
              </p>
              <p className="mt-1 text-xs text-white/30">
                Select a time above and click Add Time.
              </p>
            </div>
          )}
        </section>

        {generatedShows.length > 0 && (
          <section className={`${cardClasses} p-5 sm:p-6`}>
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold sm:text-xl">
                  Schedule Preview
                </h2>
                <p className="mt-1 text-xs text-white/40">
                  Estimated ending times include the 15-minute interval.
                </p>
              </div>

              <span className="inline-flex items-center gap-2 self-start rounded-full border border-green-500/20 bg-green-500/[0.07] px-3 py-1.5 text-xs font-medium text-green-400">
                <FaCheckCircle />
                Preview Ready
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {generatedShows.map((item) => (
                <div
                  key={item.start}
                  className="rounded-xl border border-white/[0.08] bg-black/40 p-4 transition hover:border-red-500/25"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium uppercase tracking-wider text-white/40">
                      Start
                    </span>
                    <FaClock className="text-xs text-red-400" />
                  </div>

                  <p className="mt-2 text-2xl font-bold">{item.start}</p>

                  <div className="mt-4 border-t border-white/[0.07] pt-3">
                    <p className="text-xs text-white/40">Estimated end</p>
                    <p className="mt-1 text-sm font-semibold text-red-400">
                      {item.end}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="flex flex-col-reverse gap-3 border-t border-white/[0.08] pt-6 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => navigate("/theatre-owner/shows")}
            className="rounded-xl border border-white/10 px-6 py-3.5 text-sm font-semibold text-white/65 transition hover:bg-white/[0.04] hover:text-white"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-950/20 transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/40 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Please wait...
              </>
            ) : (
              <>
                <FaCheckCircle />
                {isEdit ? "Update Show" : "Create Show"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateShowPage;