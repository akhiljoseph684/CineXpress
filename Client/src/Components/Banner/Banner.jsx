import React, {
  useEffect,
  useState,
} from "react";

import {
  FaPlay,
  FaClock,
  FaStar,
} from "react-icons/fa";

import {
  useNavigate,
} from "react-router-dom";

import { bannerFetch } from "../../services/moviesApi";

function Banner() {

  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);

  const [loading, setLoading] = useState(true);

  const [current, setCurrent] = useState(0);

  useEffect(() => {

    const fetchBanner =
      async () => {

        try {

          const res =
            await bannerFetch();

          setMovies(
            res.movies || []
          );

        } catch (error) {

          console.log(error);

        } finally {

          setLoading(false);
        }
      };

    fetchBanner();

  }, []);

  useEffect(() => {

    if (!movies.length)
      return;

    const interval =
      setInterval(() => {

        setCurrent((prev) =>
          prev ===
          movies.length - 1
            ? 0
            : prev + 1
        );

      }, 5000);

    return () =>
      clearInterval(interval);

  }, [movies]);

  if (loading) {

    return (
      <div
        className="
          h-[70vh] md:h-screen
          bg-black
          animate-pulse
        "
      />
    );
  }

  return (
    <section
      className="
        relative
        w-full
        h-[70vh]
        sm:h-[80vh]
        md:h-screen
        overflow-hidden
      "
    >

      {
        movies.map(
          (movie, index) => (

            <div
              key={movie._id}
              className={`
                absolute inset-0
                transition-all duration-1000 ease-in-out
                ${
                  current === index
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-105"
                }
              `}
            >

              <img
                src={
                  movie.poster?.banner
                }
                alt=""
                className="
                  absolute inset-0
                  w-full h-full
                  object-cover
                "
              />

              <div
                className="
                  absolute inset-0

                  bg-gradient-to-t
                  from-black
                  via-black/70
                  to-black/20

                  md:bg-gradient-to-r
                  md:from-black
                  md:via-black/70
                  md:to-transparent
                "
              />

              <div
                className="
                  relative z-10
                  h-full
                  flex items-end md:items-center

                  px-4
                  sm:px-6
                  md:px-16

                  pb-16
                  md:pb-0
                "
              >

                <div
                  className="
                    w-full
                    max-w-3xl
                  "
                >

                  <div
                    className="
                      inline-flex items-center

                      px-3 py-1.5
                      md:px-4 md:py-2

                      rounded-full

                      bg-pink-500/20
                      border border-pink-500/40

                      text-pink-400

                      text-xs
                      sm:text-sm

                      mb-4 md:mb-5
                    "
                  >

                    Now Showing

                  </div>

                  <h1
                    className="
                      text-3xl
                      sm:text-5xl
                      md:text-7xl

                      font-black
                      leading-tight
                      text-white
                    "
                  >

                    {movie.title}

                  </h1>

                  <div
                    className="
                      flex flex-wrap
                      items-center

                      gap-3
                      sm:gap-5

                      mt-4 md:mt-6

                      text-gray-300

                      text-sm
                      sm:text-base
                    "
                  >

                    <div
                      className="
                        flex items-center gap-2
                      "
                    >

                      <FaClock />

                      {Math.floor(movie.duration / 60)}h{" "}
                          {movie.duration % 60 ? `${movie.duration % 60}m` : ""}


                    </div>

                    <div
                      className="
                        flex items-center gap-2
                      "
                    >

                      <FaStar
                        className="
                          text-yellow-400
                        "
                      />

                      {
                        movie.ratings ||
                        "8.5"
                      }

                    </div>

                    <div
                      className="
                        truncate
                      "
                    >

                      {
                        movie.language
                          ?.map(
                            (lang) =>
                              lang.name
                          )
                          .join(", ")
                      }

                    </div>

                  </div>

                  <div
                    className="
                      flex flex-wrap
                      gap-2 sm:gap-3
                      mt-4 md:mt-5
                    "
                  >

                    {
                      movie.genre?.map(
                        (genre) => (

                          <span
                            key={genre._id}
                            className="
                              px-3 py-1.5
                              sm:px-4 sm:py-2

                              rounded-full

                              bg-white/10
                              backdrop-blur-md

                              text-xs
                              sm:text-sm

                              text-white
                            "
                          >

                            {genre.name}

                          </span>
                        )
                      )
                    }

                  </div>

                  <p
                    className="
                      mt-4 md:mt-6

                      text-gray-300

                      text-sm
                      sm:text-base
                      md:text-lg

                      leading-relaxed

                      line-clamp-2
                      md:line-clamp-3

                      max-w-2xl
                    "
                  >

                    {
                      movie.description
                    }

                  </p>

                  <div
                    className="
                      flex flex-col
                      sm:flex-row

                      items-stretch
                      sm:items-center

                      gap-3 sm:gap-4

                      mt-6 md:mt-8
                    "
                  >

                    <button
                      onClick={() =>
                        navigate(
                          `/booking/${movie._id}`
                        )
                      }
                      className="
                        w-full sm:w-auto

                        px-6 py-3
                        md:px-8 md:py-4

                        rounded-2xl

                        bg-pink-600
                        hover:bg-pink-700

                        transition

                        text-white
                        font-semibold

                        shadow-lg

                        text-sm
                        sm:text-base
                      "
                    >

                      Book Tickets

                    </button>

                    <button
                      onClick={() =>
                        window.open(
                          movie.trailer,
                          "_blank"
                        )
                      }
                      className="
                        w-full sm:w-auto

                        flex items-center
                        justify-center
                        gap-3

                        px-6 py-3
                        md:px-8 md:py-4

                        rounded-2xl

                        bg-white/10
                        hover:bg-white/20

                        transition

                        text-white

                        backdrop-blur-md

                        text-sm
                        sm:text-base
                      "
                    >

                      <FaPlay />

                      Watch Trailer

                    </button>

                  </div>

                </div>

              </div>

            </div>
          )
        )
      }

      <div
        className="
          absolute

          bottom-6
          md:bottom-10

          left-1/2
          -translate-x-1/2

          flex items-center
          gap-2 sm:gap-3

          z-20
        "
      >

        {
          movies.map(
            (_, index) => (

              <button
                key={index}
                onClick={() =>
                  setCurrent(index)
                }
                className={`
                  h-2.5 md:h-3
                  rounded-full
                  transition-all duration-300

                  ${
                    current === index
                      ? "w-8 md:w-10 bg-pink-500"
                      : "w-2.5 md:w-3 bg-white/40"
                  }
                `}
              />
            )
          )
        }

      </div>

    </section>
  );
}

export default Banner;