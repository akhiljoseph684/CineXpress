import React, {
  useEffect,
  useState,
} from "react";

import {
  FaClock,
  FaCalendarAlt,
  FaUserTie,
  FaFilm,
  FaPlay,
  FaStar,
  FaArrowLeft,
} from "react-icons/fa";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getMovieById,
} from "../../../services/moviesApi";

function MovieDetails() {

  const navigate =
    useNavigate();

  const { id } =
    useParams();

  const [movie, setMovie] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {

    if (id) {

      fetchMovieDetails();
    }

  }, [id]);

  const fetchMovieDetails =
    async () => {

      try {

        setLoading(true);

        setError("");

        const res =
          await getMovieById(id);

        if (!res.success) {

          setError(
            res.message
          );

          return;
        }

        setMovie(
          res.movie
        );

      } catch (error) {

        setError(
          error?.message ||
          "Failed to fetch movie details"
        );

      } finally {

        setLoading(false);
      }
    };

  if (loading) {

    return (
      <div
        className="
          w-full
          min-h-screen
          flex
          items-center
          justify-center
          text-gray-400
        "
      >

        Loading Movie...

      </div>
    );
  }

  if (error) {

    return (
      <div
        className="
          w-full
          min-h-screen
          flex
          items-center
          justify-center
        "
      >

        <div
          className="
            bg-[#1a1a1a]
            border border-red-500/30
            rounded-2xl
            p-10
            text-center
          "
        >

          <div className="text-5xl mb-4">
            ⚠️
          </div>

          <h2
            className="
              text-2xl
              font-bold
              text-red-400
            "
          >
            {error}
          </h2>

        </div>

      </div>
    );
  }

  if (!movie) return null;

  return (
    <div className="w-full">

      <button
        onClick={() =>
          navigate(-1)
        }
        className="
          flex items-center
          gap-2
          mb-6
          text-gray-400
          hover:text-white
          transition
        "
      >

        <FaArrowLeft />

        Back

      </button>

      <div
        className="
          relative
          w-full
          h-[400px]
          rounded-3xl
          overflow-hidden
          border border-gray-800
        "
      >

        <img
          src={
            movie.poster?.banner
          }
          alt={movie.title}
          className="
            w-full
            h-full
            object-cover
          "
        />

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black
            via-black/40
            to-transparent
          "
        />

        <div
          className="
            absolute
            bottom-0
            left-0
            p-8
            flex items-end
            gap-6
          "
        >

          <img
            src={
              movie.poster?.thumbnail
            }
            alt={movie.title}
            className="
              w-40 h-56
              rounded-2xl
              object-cover
              border-4
              border-white/10
              shadow-2xl
            "
          />

          <div>

            <h1
              className="
                text-4xl
                font-bold
              "
            >
              {movie.title}
            </h1>

            <div
              className="
                flex flex-wrap
                gap-3
                mt-4
              "
            >

              {movie.genre?.map(
                (item) => (

                  <span
                    key={item._id}
                    className="
                      px-4 py-2
                      rounded-full
                      bg-[#8b5c76]/30
                      text-sm
                    "
                  >

                    {item.name}

                  </span>
                )
              )}

            </div>

          </div>

        </div>

      </div>

      <div
        className="
          grid
          grid-cols-1
          lg:grid-cols-3
          gap-8
          mt-10
        "
      >

        <div
          className="
            lg:col-span-2
            space-y-8
          "
        >

          <div
            className="
              bg-[#1a1a1a]
              border border-gray-800
              rounded-3xl
              p-6
            "
          >

            <h2
              className="
                text-2xl
                font-bold
                mb-4
              "
            >
              Description
            </h2>

            <p
              className="
                text-gray-400
                leading-8
              "
            >
              {movie.description || "-"}
            </p>

          </div>

          <div
            className="
              bg-[#1a1a1a]
              border border-gray-800
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
              Cast 🎭
            </h2>

            <div
              className="
                grid
                grid-cols-2
                md:grid-cols-3
                lg:grid-cols-4
                gap-5
              "
            >

              {movie.cast?.map(
                (actor, index) => {

                  const actorData =
                    actor.actorId;

                  return (

                    <div
                      key={index}
                      className="
                        bg-[#252525]
                        rounded-2xl
                        p-4
                        text-center
                      "
                    >

                      <img
                        src={
                          actorData
                            ?.profileImage ||
                          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThZwd0Ar5WsR1Z-ylhArKLTDqEhKPlMqWvZw&s"
                        }
                        alt={
                          actorData?.name ||
                          actor.name
                        }
                        className="
                          w-24 h-24
                          rounded-full
                          object-cover
                          mx-auto
                          border-4
                          border-[#8b5c76]/30
                        "
                      />

                      <h3
                        className="
                          mt-4
                          font-semibold
                        "
                      >

                        {
                          actorData?.name ||
                          actor.name
                        }

                      </h3>

                    </div>
                  );
                }
              )}

            </div>

          </div>

        </div>

        <div
          className="
            space-y-6
          "
        >

          <div
            className="
              bg-[#1a1a1a]
              border border-gray-800
              rounded-3xl
              p-6
              space-y-5
            "
          >

            <div
              className="
                flex items-center
                justify-between
              "
            >

              <div
                className="
                  flex items-center
                  gap-2
                "
              >

                <FaClock />

                Duration

              </div>

              <span>
                {movie.duration} min
              </span>

            </div>

            <div
              className="
                flex items-center
                justify-between
              "
            >

              <div
                className="
                  flex items-center
                  gap-2
                "
              >

                <FaCalendarAlt />

                Release

              </div>

              <span>
                {
                  new Date(
                    movie.releaseDate
                  ).toLocaleDateString()
                }
              </span>

            </div>

            <div
              className="
                flex items-center
                justify-between
              "
            >

              <div
                className="
                  flex items-center
                  gap-2
                "
              >

                <FaUserTie />

                Director

              </div>

              <span>
                {movie.director || "-"}
              </span>

            </div>

            <div
              className="
                flex items-center
                justify-between
              "
            >

              <div
                className="
                  flex items-center
                  gap-2
                "
              >

                <FaFilm />

                Producer

              </div>

              <span>
                {movie.producer || "-"}
              </span>

            </div>

            <div
              className="
                flex items-center
                justify-between
              "
            >

              <div
                className="
                  flex items-center
                  gap-2
                "
              >

                <FaStar />

                Rating

              </div>

              <span>
                {movie.avgRating?.toFixed(1) || "0.0"}
              </span>

            </div>

            <div>

              <h3
                className="
                  mb-3
                  text-gray-400
                "
              >
                Languages
              </h3>

              <div
                className="
                  flex flex-wrap
                  gap-2
                "
              >

                {movie.language?.map(
                  (item) => (

                    <span
                      key={item._id}
                      className="
                        px-3 py-2
                        rounded-full
                        bg-[#252525]
                        text-sm
                      "
                    >

                      {item.name}

                    </span>
                  )
                )}

              </div>

            </div>

          </div>

          {
            movie.trailer && (

              <a
                href={movie.trailer}
                target="_blank"
                rel="noreferrer"
                className="
                  flex items-center
                  justify-center
                  gap-3
                  w-full
                  py-4
                  rounded-2xl
                  bg-gradient-to-r
                  from-[#8b5c76]
                  to-[#6f4660]
                  font-semibold
                  hover:opacity-90
                  transition
                "
              >

                <FaPlay />

                Watch Trailer

              </a>
            )
          }

        </div>

      </div>

    </div>
  );
}

export default MovieDetails;
