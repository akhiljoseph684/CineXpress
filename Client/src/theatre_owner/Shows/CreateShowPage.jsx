import React, { useEffect, useMemo, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { createShow, editShow, getShowById } from "../../services/showApi";

import { getAllMovies } from "../../services/moviesApi";

import { getScreenById } from "../../services/screensApi";

import { FaFilm, FaTimes, FaClock, FaPlus } from "react-icons/fa";
import { useRef } from "react";

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

  useEffect(() => {
    fetchScreen();
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

      setScreen(res.screen);

      setFormData((prev) => ({
        ...prev,

        screenId: res.screen._id,

        theatreId: res.screen.theatre?._id,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMovies = async () => {
    try {
      const res = await getAllMovies(`?title=${movieSearch}&page=1&limit=5`);

      setMovies(res.movies || []);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchShow = async () => {
    try {
      const res = await getShowById(id);

      const show = res.show;

      setSelectedMovie(show.movieId);

      setFormData({
        movieId: show.movieId?._id,

        theatreId: show.theatreId?._id,

        screenId: show.screenId?._id,

        startDate: show.showDate,

        endDate: show.showDate,

        showTimes: [show.startTime],

        timeInput: "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  // GENERATED PREVIEW

  const generatedShows = useMemo(() => {
    if (!selectedMovie) {
      return [];
    }

    return formData.showTimes.sort().map((time) => {
      const start = new Date(`2025-01-01T${time}`);

      const end = new Date(
        start.getTime() + (selectedMovie.duration + 15) * 60000,
      );

      return {
        start: time,
        end: end.toTimeString().slice(0, 5),
      };
    });
  }, [selectedMovie, formData.showTimes]);

  const addShowTime = () => {
    if (!formData.timeInput) {
      setError("First enter time");
      setTimeout(() => {
        errorRef.current?.scrollIntoView({
          behavior: "smooth",

          block: "center",
        });
      }, 100);
      return;
    }

    if (!selectedMovie) {
      setError("First add Movies");
      setTimeout(() => {
        errorRef.current?.scrollIntoView({
          behavior: "smooth",

          block: "center",
        });
      }, 100);
      return;
    }

    // already exists
    if (formData.showTimes.includes(formData.timeInput)) {
      setTimeout(() => {
        errorRef.current?.scrollIntoView({
          behavior: "smooth",

          block: "center",
        });
      }, 100);
      return setError("Show time already added");
    }

    const duration = selectedMovie.duration;
    const breakTime = 15;

    // helper
    const toMinutes = (time) => {
      const [h, m] = time.split(":").map(Number);

      return h * 60 + m;
    };

    const newStart = toMinutes(formData.timeInput);

    const newEnd = newStart + duration;

    const hasConflict = formData.showTimes.some((time) => {
      const existingStart = toMinutes(time);

      const existingEnd = existingStart + duration + breakTime;

      return newStart < existingEnd && newEnd + breakTime > existingStart;
    });

    if (hasConflict) {
      setTimeout(() => {
        errorRef.current?.scrollIntoView({
          behavior: "smooth",

          block: "center",
        });
      }, 100);
      return setError("Time conflict detected with another show");
    }

    setError("");

    setFormData({
      ...formData,

      showTimes: [...formData.showTimes, formData.timeInput].sort(),

      timeInput: "",
    });
  };

  const removeTime = (index) => {
    setFormData({
      ...formData,

      showTimes: formData.showTimes.filter((_, i) => i !== index),
    });
  };

  // SUBMIT

  const submitHandler = async (e) => {
    e.preventDefault();

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
        setError(res.message);

        return;
      }

      navigate("/theatre-owner/shows");
    } catch (error) {
      setError(error?.response?.data?.message || error.message);
      setTimeout(() => {
        errorRef.current?.scrollIntoView({
          behavior: "smooth",

          block: "center",
        });
      }, 100);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        min-h-screen

        bg-black

        text-white

        px-4
        py-8
      "
    >
      <form
        onSubmit={submitHandler}
        className="
          max-w-7xl
          mx-auto

          space-y-8
        "
      >
        {/* HEADER */}

        <div>
          <h1
            className="
              text-4xl
              font-black
            "
          >
            {isEdit ? "Edit Show 🎬" : "Create Shows 🎬"}
          </h1>

          <p
            className="
              text-white/50

              mt-3
            "
          >
            Multiplex smart scheduling system
          </p>
        </div>

        {/* ERROR */}

        {error && (
          <div
            ref={errorRef}
            className="
                bg-red-500/10

                border
                border-red-500/20

                rounded-3xl

                p-5

                text-red-400
              "
          >
            {error}
          </div>
        )}

        {/* SCREEN */}

        {screen && (
          <div
            className="
                grid
                grid-cols-1
                md:grid-cols-3

                gap-5
              "
          >
            <div
              className="
                  bg-[#111]

                  border
                  border-white/10

                  rounded-3xl

                  p-6
                "
            >
              <p
                className="
                    text-white/40
                    text-sm
                  "
              >
                Theatre
              </p>

              <h2
                className="
                    text-2xl
                    font-bold

                    mt-2
                  "
              >
                {screen.theatre?.name}
              </h2>
            </div>

            <div
              className="
                  bg-[#111]

                  border
                  border-white/10

                  rounded-3xl

                  p-6
                "
            >
              <p
                className="
                    text-white/40
                    text-sm
                  "
              >
                Screen
              </p>

              <h2
                className="
                    text-2xl
                    font-bold

                    mt-2
                  "
              >
                {screen.name}
              </h2>
            </div>

            <div
              className="
                  bg-[#111]

                  border
                  border-white/10

                  rounded-3xl

                  p-6
                "
            >
              <p
                className="
                    text-white/40
                    text-sm
                  "
              >
                Type
              </p>

              <h2
                className="
                    text-2xl
                    font-bold

                    mt-2
                  "
              >
                {screen.screenType}
              </h2>
            </div>
          </div>
        )}

        {/* MOVIE SEARCH */}

        <div
          className="
            relative
          "
        >
          <div
            className="
              flex
              items-center

              gap-3

              mb-4
            "
          >
            <FaFilm />

            <h2
              className="
                text-2xl
                font-bold
              "
            >
              Select Movie
            </h2>
          </div>

          <input
            type="text"
            placeholder="
              Search movies...
            "
            value={movieSearch}
            onChange={(e) => setMovieSearch(e.target.value)}
            className="
              w-full

              bg-[#111]

              border
              border-white/10

              rounded-3xl

              px-6
              py-5

              outline-none
            "
          />

          {movieSearch && movies.length > 0 && (
            <div
              className="
                  absolute
                  top-full
                  left-0
                  right-0

                  z-50

                  mt-3

                  bg-[#0d0d0d]

                  border
                  border-white/10

                  rounded-3xl

                  overflow-hidden
                "
            >
              {movies.map((movie) => (
                <button
                  key={movie._id}
                  type="button"
                  onClick={() => {
                    setSelectedMovie(movie);

                    setMovieSearch("");

                    setFormData({
                      ...formData,

                      movieId: movie._id,
                    });
                  }}
                  className="
                          w-full

                          flex
                          items-center

                          gap-4

                          p-5

                          hover:bg-white/5
                        "
                >
                  <img
                    src={movie.poster?.card}
                    alt=""
                    className="
                            h-24
                            w-20

                            rounded-2xl

                            object-cover
                          "
                  />

                  <div
                    className="
                            text-left
                          "
                  >
                    <h2
                      className="
                              text-2xl
                              font-bold
                            "
                    >
                      {movie.title}
                    </h2>

                    <p
                      className="
                              text-white/50

                              mt-2
                            "
                    >
                      {movie.duration} mins
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* SELECTED MOVIE */}

        {selectedMovie && (
          <div
            className="
                bg-[#111]

                border
                border-pink-500/20

                rounded-3xl

                p-6

                flex
                items-center
                justify-between

                gap-5
              "
          >
            <div
              className="
                  flex
                  items-center

                  gap-5
                "
            >
              <img
                src={selectedMovie?.poster?.card}
                alt=""
                className="
                    h-28
                    w-24

                    rounded-2xl

                    object-cover
                  "
              />

              <div>
                <p
                  className="
                      text-pink-400
                      text-sm
                    "
                >
                  Selected Movie
                </p>

                <h2
                  className="
                      text-3xl
                      font-black

                      mt-2
                    "
                >
                  {selectedMovie?.title}
                </h2>

                <p
                  className="
                      text-white/50

                      mt-3
                    "
                >
                  Duration: {selectedMovie?.duration}
                  mins
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedMovie(null);

                setFormData({
                  ...formData,

                  movieId: "",
                });
              }}
              className="
                  h-14
                  w-14

                  rounded-2xl

                  bg-red-500

                  flex
                  items-center
                  justify-center
                "
            >
              <FaTimes />
            </button>
          </div>
        )}

        {/* DATE */}

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2

            gap-5
          "
        >
          <div>
            <label
              className="
                text-white/50
                text-sm
              "
            >
              Start Date
            </label>

            <input
              type="date"
              value={formData.startDate}
              onChange={(e) =>
                setFormData({
                  ...formData,

                  startDate: e.target.value,
                })
              }
              className="
                w-full

                mt-2

                bg-[#111]

                border
                border-white/10

                rounded-3xl

                px-5
                py-4
              "
            />
          </div>

          <div>
            <label
              className="
                text-white/50
                text-sm
              "
            >
              End Date
            </label>

            <input
              type="date"
              value={formData.endDate}
              onChange={(e) =>
                setFormData({
                  ...formData,

                  endDate: e.target.value,
                })
              }
              className="
                w-full

                mt-2

                bg-[#111]

                border
                border-white/10

                rounded-3xl

                px-5
                py-4
              "
            />
          </div>
        </div>

        {/* ADD TIMES */}

        <div
          className="
            bg-[#111]

            border
            border-white/10

            rounded-3xl

            p-6
          "
        >
          <div
            className="
              flex
              items-center

              gap-3

              mb-6
            "
          >
            <FaClock />

            <h2
              className="
                text-2xl
                font-bold
              "
            >
              Show Timings
            </h2>
          </div>

          {/* INPUT */}

          <div
            className="
              flex
              items-center

              gap-3
            "
          >
            <input
              type="time"
              value={formData.timeInput}
              onChange={(e) =>
                setFormData({
                  ...formData,

                  timeInput: e.target.value,
                })
              }
              className="
                flex-1

                bg-black

                border
                border-white/10

                rounded-3xl

                px-5
                py-4
              "
            />

            <button
              type="button"
              onClick={addShowTime}
              className="
                h-14
                w-14

                rounded-2xl

                bg-pink-600

                flex
                items-center
                justify-center
              "
            >
              <FaPlus />
            </button>
          </div>

          {/* TIMES */}

          <div
            className="
              flex
              flex-wrap

              gap-4

              mt-6
            "
          >
            {formData.showTimes.sort().map((time, index) => (
              <div
                key={index}
                className="
                        flex
                        items-center

                        gap-3

                        bg-black

                        border
                        border-white/10

                        rounded-2xl

                        px-5
                        py-3
                      "
              >
                <span
                  className="
                          font-medium
                        "
                >
                  {time}
                </span>

                <button
                  type="button"
                  onClick={() => removeTime(index)}
                  className="
                          text-red-400
                        "
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* GENERATED */}

        {generatedShows.length > 0 && (
          <div
            className="
                bg-[#111]

                border
                border-white/10

                rounded-3xl

                p-6
              "
          >
            <h2
              className="
                  text-2xl
                  font-bold

                  mb-6
                "
            >
              Generated Shows 🎬
            </h2>

            <div
              className="
                  grid
                  grid-cols-2
                  md:grid-cols-4

                  gap-4
                "
            >
              {generatedShows.map((item, index) => (
                <div
                  key={index}
                  className="
                          bg-black

                          border
                          border-white/10

                          rounded-2xl

                          p-5
                        "
                >
                  <p
                    className="
                            text-white/40
                            text-sm
                          "
                  >
                    Start
                  </p>

                  <h2
                    className="
                            text-2xl
                            font-bold

                            mt-2
                          "
                  >
                    {item.start}
                  </h2>

                  <p
                    className="
                            text-pink-400

                            mt-3
                          "
                  >
                    Ends {item.end}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BUTTON */}

        <button
          type="submit"
          disabled={loading}
          className="
            w-full

            bg-pink-600
            hover:bg-pink-700

            rounded-3xl

            py-5

            font-bold
            text-xl

            transition
          "
        >
          {loading
            ? "Please wait..."
            : isEdit
              ? "Update Shows"
              : "Create Shows"}
        </button>
      </form>
    </div>
  );
}

export default CreateShowPage;
