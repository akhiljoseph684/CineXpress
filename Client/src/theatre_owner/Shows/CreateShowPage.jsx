import React, { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { getScreenById } from "../../services/screensApi";

import { getAllMovies } from "../../services/moviesApi";

import { createShow } from "../../services/showApi";

const CreateShowPage = () => {
  const { screenId } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [screen, setScreen] = useState(null);

  const [error, setError] = useState("");

  const [movieSearch, setMovieSearch] = useState("");

  const [movies, setMovies] = useState([]);

  const [selectedMovie, setSelectedMovie] = useState(null);

  const [formData, setFormData] = useState({
    movieId: "",

    theatreId: "",

    screenId: "",

    showDate: "",

    startTime: "",

    endTime: "",
  });

  useEffect(() => {
    fetchScreen();
  }, [screenId]);

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
    } finally {
      setLoading(false);
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

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setError("");

      await createShow(formData);

      navigate("/theatre-owner/shows");
    } catch (error) {
      setError(error.message || "Something went wrong");
      setTimeout(() => {
        document.querySelector("form")?.scrollIntoView({
          behavior: "smooth",

          block: "start",
        });
      }, 100);
    }
  };

  if (loading) {
    return (
      <div
        className="
          min-h-screen

          bg-black

          text-white

          flex
          items-center
          justify-center
        "
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      className="
        min-h-screen

        bg-black

        text-white

        px-4
        py-6

        sm:p-8
      "
    >
      <form
        onSubmit={submitHandler}
        className="
          max-w-7xl
          mx-auto

          space-y-10
        "
      >
        <div>
          <h1
            className="
              text-3xl
              sm:text-5xl

              font-black
            "
          >
            Create Show
          </h1>

          <p
            className="
              text-white/50

              mt-3
            "
          >
            Add movie show for selected screen
          </p>
        </div>

        {error && (
          <div
            className="
              bg-red-500/10
        
              border
              border-red-500/20
        
              text-red-400
        
              rounded-2xl
        
              px-5
              py-4
        
              font-medium
            "
          >
            {error}
          </div>
        )}

        <div
          className="
            bg-[#111]

            border
            border-white/10

            rounded-3xl

            p-6

            grid
            grid-cols-1
            md:grid-cols-3

            gap-6
          "
        >
          <div>
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

                mt-1
              "
            >
              {screen?.theatre?.name}
            </h2>
          </div>

          <div>
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

                mt-1
              "
            >
              {screen?.name}
            </h2>
          </div>

          <div>
            <p
              className="
                text-white/40
                text-sm
              "
            >
              Screen Type
            </p>

            <h2
              className="
                text-2xl
                font-bold

                mt-1
              "
            >
              {screen?.screenType}
            </h2>
          </div>
        </div>

        <div className="space-y-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search movies..."
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

                text-lg
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

                  shadow-2xl
                "
              >
                {movies.map((movie) => (
                  <button
                    key={movie._id}
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        movieId: movie._id,
                      });

                      setSelectedMovie(movie);

                      setMovieSearch("");
                    }}
                    className="
                        w-full

                        flex
                        items-center

                        gap-4

                        px-5
                        py-4

                        hover:bg-white/5

                        transition
                      "
                  >
                    <img
                      src={movie.poster?.card}
                      alt={movie.title}
                      className="
                          h-24
                          w-20

                          rounded-2xl

                          object-cover
                        "
                    />

                    <div className="text-left">
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

                            mt-1

                            line-clamp-1
                          "
                      >
                        {movie.genre?.map((item) => item.name).join(", ")}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedMovie && (
            <div
              className="
                bg-[#111]

                border
                border-pink-500/20

                rounded-3xl

                p-5

                flex
                flex-col
                md:flex-row

                items-start
                md:items-center

                justify-between

                gap-5
              "
            >
              <div
                className="
                  flex
                  items-center

                  gap-4
                "
              >
                <img
                  src={selectedMovie?.poster?.card}
                  alt={selectedMovie?.title}
                  className="
                    h-12
                    w-14

                    rounded-xl

                    object-cover
                  "
                />

                <div>
                  <p
                    className="
                      text-pink-400
                      text-sm

                      mb-1
                    "
                  >
                    Selected Movie
                  </p>

                  <h2
                    className="
                      text-2xl
                      font-bold
                    "
                  >
                    {selectedMovie?.title}
                  </h2>

                  <p
                    className="
                      text-white/50

                      mt-2
                    "
                  >
                    {selectedMovie?.genre?.map((item) => item.name).join(", ")}
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
                  px-5
                  py-3

                  rounded-2xl

                  bg-red-600
                  hover:bg-red-700

                  font-semibold

                  transition
                "
              >
                Remove Movie
              </button>
            </div>
          )}
        </div>

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-3

            gap-6
          "
        >
          <input
            type="date"
            value={formData.showDate}
            onChange={(e) =>
              setFormData({
                ...formData,

                showDate: e.target.value,
              })
            }
            className="
              bg-[#111]

              border
              border-white/10

              rounded-3xl

              px-5
              py-4

              outline-none
            "
          />

          <input
            type="time"
            value={formData.startTime}
            onChange={(e) =>
              setFormData({
                ...formData,

                startTime: e.target.value,
              })
            }
            className="
              bg-[#111]

              border
              border-white/10

              rounded-3xl

              px-5
              py-4

              outline-none
            "
          />

          <input
            type="time"
            value={formData.endTime}
            onChange={(e) =>
              setFormData({
                ...formData,

                endTime: e.target.value,
              })
            }
            className="
              bg-[#111]

              border
              border-white/10

              rounded-3xl

              px-5
              py-4

              outline-none
            "
          />
        </div>

        <button
          type="submit"
          disabled={
            !formData.movieId ||
            !formData.showDate ||
            !formData.startTime ||
            !formData.endTime
          }
          className="
            w-full
            sm:w-auto

            px-10
            py-4

            rounded-3xl

            bg-pink-600
            hover:bg-pink-700

            disabled:opacity-40

            font-semibold

            transition-all
          "
        >
          Create Show
        </button>
      </form>
    </div>
  );
};

export default CreateShowPage;
