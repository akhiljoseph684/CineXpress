import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  FaChevronLeft,
  FaChevronRight,
  FaStar,
  FaClock,
} from "react-icons/fa";

import {
  useNavigate,
} from "react-router-dom";

import {
  getAllMovies,
} from "../../services/moviesApi";

function MovieListing({title = "Now Showing", query = ""}) {

  const navigate = useNavigate();

  const scrollRef = useRef();

  const [movies, setMovies] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchMovies =
      async () => {

        try {

          setLoading(true);

          const res = await getAllMovies(query ? `${query}&limit=12` : "?limit=12");

          setMovies(res.movies || []);

        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };

    fetchMovies();

  }, [query]);

  const scrollLeft =
    () => {

      scrollRef.current
        ?.scrollBy({

          left: -600,

          behavior: "smooth"

        });
    };

  const scrollRight =
    () => {

      scrollRef.current
        ?.scrollBy({

          left: 600,

          behavior: "smooth"

        });
    };

  return (
    <section
      className="
        py-8 sm:py-10 md:py-12
        px-4 sm:px-5 md:px-8
      "
    >

      <div
        className="
          flex flex-col
          sm:flex-row

          sm:items-center
          justify-between

          gap-5

          mb-6 md:mb-8
        "
      >

        <div>

          <h2
            className="
              text-2xl
              sm:text-3xl
              md:text-4xl

              font-black
              text-white
            "
          >

            {title}

          </h2>

          <p
            className="
              text-gray-400
              mt-2

              text-sm
              md:text-base
            "
          >

            Discover trending movies

          </p>

        </div>

        <div
          className="
            flex items-center
            justify-between
            sm:justify-end

            gap-3
          "
        >

          <button
            onClick={() =>
              navigate("/movies")
            }
            className="
              px-4 py-2.5
              md:px-5 md:py-3

              rounded-xl

              bg-pink-600
              hover:bg-pink-700

              transition

              text-white

              text-sm
              md:text-base

              font-medium
            "
          >

            See All

          </button>

          <div
            className="
              hidden md:flex
              items-center gap-3
            "
          >

            <button
              onClick={scrollLeft}
              className="
                w-11 h-11

                rounded-full

                bg-white/10
                hover:bg-white/20

                text-white

                flex items-center
                justify-center

                transition
              "
            >

              <FaChevronLeft />

            </button>

            <button
              onClick={scrollRight}
              className="
                w-11 h-11

                rounded-full

                bg-white/10
                hover:bg-white/20

                text-white

                flex items-center
                justify-center

                transition
              "
            >

              <FaChevronRight />

            </button>

          </div>

        </div>

      </div>

      {
        loading ? (

          <div
            className="
              flex gap-4
              overflow-hidden
            "
          >

            {
              [...Array(6)].map(
                (_, index) => (

                  <div
                    key={index}
                    className="
                      min-w-[160px]
                      h-[280px]

                      sm:min-w-[200px]
                      sm:h-[320px]

                      md:min-w-[240px]
                      md:h-[380px]

                      rounded-3xl

                      bg-white/5

                      animate-pulse
                    "
                  />
                )
              )
            }

          </div>

        ) : (

          <div
            ref={scrollRef}
            className="
              flex gap-4 md:gap-6

              overflow-x-auto

              scroll-smooth

              pb-3

              snap-x snap-mandatory

              [&::-webkit-scrollbar]:hidden
              [-ms-overflow-style:none]
              [scrollbar-width:none]
            "
          >

            {
              movies.map(
                (movie) => (

                  <div
                    key={movie._id}
                    onClick={() =>
                      navigate(
                        `/movies/${movie._id}`
                      )
                    }
                    className="
                      min-w-[160px]
                      max-w-[160px]

                      sm:min-w-[210px]
                      sm:max-w-[210px]

                      md:min-w-[250px]
                      md:max-w-[250px]

                      bg-[#111]

                      rounded-3xl

                      overflow-hidden

                      cursor-pointer

                      group

                      border border-white/5

                      hover:border-pink-500/30

                      transition-all duration-300

                      hover:-translate-y-2

                      snap-start

                      shrink-0
                    "
                  >

                    <div
                      className="
                        relative

                        h-[230px]
                        sm:h-[300px]
                        md:h-[340px]

                        overflow-hidden
                      "
                    >

                      <img
                        src={
                          movie.poster?.card
                        }
                        alt=""
                        className="
                          w-full h-full

                          object-cover

                          group-hover:scale-110

                          transition-transform
                          duration-500
                        "
                      />

                      <div
                        className="
                          absolute inset-0

                          bg-gradient-to-t
                          from-black/90
                          via-black/20
                          to-transparent
                        "
                      />

                      <div
                        className="
                          absolute top-3 left-3

                          px-2.5 py-1

                          rounded-full

                          bg-pink-500

                          text-[10px]
                          sm:text-xs

                          font-semibold

                          text-white
                        "
                      >

                        {title}

                      </div>

                      <div
                        className="
                          absolute top-3 right-3

                          flex items-center
                          gap-1

                          px-2 py-1

                          rounded-full

                          bg-black/50
                          backdrop-blur-md

                          text-white

                          text-[10px]
                          sm:text-xs
                        "
                      >

                        <FaStar
                          className="
                            text-yellow-400
                          "
                        />

                        {
                          movie.avgRating
                            ?.toFixed(1)
                          || "0"
                        }

                      </div>

                    </div>

                    <div
                      className="
                        p-3 sm:p-4 md:p-5
                      "
                    >

                      <h3
                        className="
                          text-sm
                          sm:text-lg
                          md:text-xl

                          font-bold

                          text-white

                          line-clamp-1
                        "
                      >

                        {movie.title}

                      </h3>

                      <p
                        className="
                          text-gray-400

                          text-xs
                          sm:text-sm

                          mt-2

                          line-clamp-1
                        "
                      >

                        {
                          movie.genre
                            ?.map(
                              (g) =>
                                g.name
                            )
                            .join(", ")
                        }

                      </p>

                      <div
                        className="
                          flex items-center
                          justify-between

                          gap-2

                          mt-4
                        "
                      >

                        <div
                          className="
                            flex items-center
                            gap-1.5

                            text-gray-300

                            text-[11px]
                            sm:text-sm
                          "
                        >

                          <FaClock />

                          {Math.floor(movie.duration / 60)}h{" "}
                          {movie.duration % 60 ? `${movie.duration % 60}m` : ""}

                        </div>

                        <button
                          onClick={(e) => {

                            e.stopPropagation();

                            navigate(
                              `/booking/${movie._id}`
                            );

                          }}
                          className="
                            px-3 py-2
                            md:px-4

                            rounded-xl

                            bg-pink-600
                            hover:bg-pink-700

                            transition

                            text-white

                            text-[11px]
                            sm:text-sm

                            font-medium

                            whitespace-nowrap
                          "
                        >

                          Book

                        </button>

                      </div>

                    </div>

                  </div>
                )
              )
            }

            <div
              onClick={() =>
                navigate("/movies")
              }
              className="
                min-w-[160px]
                h-[330px]

                sm:min-w-[210px]
                sm:h-[420px]

                md:min-w-[250px]
                md:h-[470px]

                rounded-3xl

                border-2 border-dashed
                border-pink-500/30

                flex flex-col
                items-center
                justify-center

                cursor-pointer

                hover:bg-pink-500/10

                transition

                shrink-0
                snap-start
              "
            >

              <h3
                className="
                  text-lg
                  sm:text-xl
                  md:text-2xl

                  font-bold

                  text-white
                  text-center
                "
              >

                Explore
                More

              </h3>

              <p
                className="
                  text-gray-400

                  mt-3

                  text-xs
                  sm:text-sm
                "
              >

                View all movies →

              </p>

            </div>

          </div>

        )
      }

    </section>
  );
}

export default MovieListing;