import React, {
  useEffect,
  useState,
} from "react";

import {
  FaSearch,
  FaStar,
  FaClock,
  FaChevronLeft,
  FaChevronRight,
  FaArrowLeft,
} from "react-icons/fa";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { getAllMovies } from "../services/moviesApi";

import { getGenres, getLanguages } from "../services/categories";

function MoviesPage() {

  const navigate =
    useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const [movies, setMovies] = useState([]);

  const [genres, setGenres] = useState([]);

  const [languages, setLanguages] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(searchParams.get("title") || "");

  const [selectedGenre, setSelectedGenre] = useState(searchParams.get("genre") || "");

  const [selectedLanguage, setSelectedLanguage] = useState(searchParams.get("language") || "");

  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    
      window.scrollTo({
    
        top: 0,
    
        behavior: "smooth"
    
      });
  
    }, [page]);

  useEffect(() => {

    const fetchFilters = async () => {

        try {

          const [genreRes, languageRes] = await Promise.all([
            getGenres(),
            getLanguages(),
          ]);

          setGenres(
            genreRes.genres || []
          );

          setLanguages(
            languageRes.languages || []
          );

        } catch (error) {

          console.log(error);

        }
      };

    fetchFilters();

  }, []);

  useEffect(() => {

    const timer =
      setTimeout(async () => {

        try {

          setLoading(true);

          let query =
            `?page=${page}&limit=24`;

          if (search) {
            query += `&title=${search}`;
          }

          if (selectedGenre) {
            query +=
              `&genre=${selectedGenre}`;
          }

          if (selectedLanguage) {
            query +=
              `&language=${selectedLanguage}`;
          }

          setSearchParams({

            page,

            ...(search && {
              title: search
            }),

            ...(selectedGenre && {
              genre:
                selectedGenre
            }),

            ...(selectedLanguage && {
              language:
                selectedLanguage
            }),

          });

          const res =
            await getAllMovies(
              query
            );

          setMovies(
            res.movies || []
          );

          setTotalPages(
            res.totalPages || 1
          );

        } catch (error) {

          console.log(error);

        } finally {

          setLoading(false);

        }

      }, 500);

    return () =>
      clearTimeout(timer);

  }, [
    search,
    selectedGenre,
    selectedLanguage,
    page,
  ]);

  return (
    <div
      className="
        min-h-screen
        bg-black
        text-white

        px-4 md:px-8
        py-8
      "
    >

      <div
        className="
          flex flex-col
          lg:flex-row
          lg:items-center
          lg:justify-between
          gap-5
          mb-10
        "
      >
        <button
          onClick={() =>
            navigate("/")
          }
          className="
            flex items-center
            gap-2
        
            bg-white/5
            hover:bg-white/10
        
            border border-white/10
        
            px-5 py-3
        
            rounded-2xl
        
            transition
        
            text-sm
            text-white
        
            w-fit
        
            mb-6
          "
        >
        
          <FaArrowLeft />
        
        </button>

        <div>

          <h1
            className="
              text-3xl
              md:text-5xl
              font-black
            "
          >

            Explore Movies

          </h1>

          <p
            className="
              text-gray-400
              mt-3
            "
          >

            Discover trending and
            latest movies 🎬

          </p>

        </div>

        <div
          className="
            relative
            w-full
            lg:w-[400px]
          "
        >

          <FaSearch
            className="
              absolute
              left-4 top-1/2
              -translate-y-1/2
              text-gray-500
            "
          />

          <input
            type="text"
            value={search}
            onChange={(e) => {

              setPage(1);

              setSearch(
                e.target.value
              );

            }}
            placeholder="Search movies..."
            className="
              w-full

              bg-[#111]
              border border-white/10

              rounded-2xl

              py-4
              pl-12
              pr-4

              outline-none

              text-white
            "
          />

        </div>

      </div>

      <div
        className="
          flex flex-col
          md:flex-row

          gap-4

          mb-10
        "
      >

        <select
          value={selectedGenre}
          onChange={(e) => {

            setPage(1);

            setSelectedGenre(
              e.target.value
            );

          }}
          className="
            bg-[#111]
            border border-white/10

            rounded-xl

            px-5 py-3

            outline-none

            text-white
          "
        >

          <option value="">
            All Genres
          </option>

          {
            genres.map(
              (genre) => (
                <option
                  key={genre._id}
                  value={genre._id}
                >
                  {genre.name}

                </option>
              )
            )
          }

        </select>

        <select
          value={selectedLanguage}
          onChange={(e) => {

            setPage(1);

            setSelectedLanguage(
              e.target.value
            );

          }}
          className="
            bg-[#111]
            border border-white/10

            rounded-xl

            px-5 py-3

            outline-none

            text-white
          "
        >

          <option value="">
            All Languages
          </option>

          {
            languages.map(
              (language) => (

                <option
                  key={language._id}
                  value={language._id}
                >

                  {language.name}

                </option>
              )
            )
          }

        </select>

      </div>

      {
        loading ? (

          <div
            className="
              grid
              grid-cols-2
              md:grid-cols-3
              lg:grid-cols-4
              xl:grid-cols-6

              gap-6
            "
          >

            {
              [...Array(12)].map(
                (_, index) => (

                  <div
                    key={index}
                    className="
                      h-[360px]
                      rounded-3xl
                      bg-white/5
                      animate-pulse
                    "
                  />
                )
              )
            }

          </div>

        ) : movies.length ? (

          <div
            className="
              grid

              grid-cols-2
              md:grid-cols-3
              lg:grid-cols-4
              xl:grid-cols-4

              gap-5 md:gap-6
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
                      bg-[#111]

                      rounded-3xl
                      overflow-hidden

                      cursor-pointer

                      border border-white/5

                      hover:border-pink-500/30

                      transition-all
                      duration-300

                      hover:-translate-y-2

                      group
                    "
                  >

                    <div
                      className="
                        relative
                        h-[280px]
                        md:h-[340px]
                        overflow-hidden
                      "
                    >

                      <img
                        src={
                          movie.poster
                            ?.card
                        }
                        alt=""
                        className="
                          w-full
                          h-full
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
                          absolute top-3 right-3

                          flex items-center
                          gap-1

                          px-3 py-1

                          rounded-full

                          bg-black/50

                          backdrop-blur-md

                          text-white
                          text-sm
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
                        p-4
                      "
                    >

                      <h2
                        className="
                          text-lg
                          md:text-xl

                          font-bold

                          line-clamp-1
                        "
                      >

                        {movie.title}

                      </h2>

                      <p
                        className="
                          text-gray-400
                          text-sm

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

                          mt-4
                        "
                      >

                        <div
                          className="
                            flex items-center
                            gap-2

                            text-gray-300
                            text-sm
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
                              `/shows/movie/${movie._id}`
                            );

                          }}
                          className="
                            px-4 py-2

                            rounded-xl

                            bg-pink-600

                            hover:bg-pink-700

                            transition

                            text-white
                            text-sm
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

          </div>

        ) : (

          <div
            className="
              h-[400px]

              flex flex-col
              items-center
              justify-center
            "
          >

            <h2
              className="
                text-3xl
                font-bold
              "
            >

              No Movies Found

            </h2>

            <p
              className="
                text-gray-400
                mt-3
              "
            >

              Try different filters 🎬

            </p>

          </div>

        )
      }

      {
        totalPages > 1 &&
        (
          <div
            className="
              flex items-center
              justify-center

              gap-4

              mt-14
            "
          >

            <button
              disabled={page === 1}
              onClick={() =>
                setPage(
                  (prev) =>
                    prev - 1
                )
              }
              className="
                w-12 h-12

                rounded-full

                bg-white/5

                hover:bg-white/10

                disabled:opacity-50

                flex items-center
                justify-center

                transition
              "
            >

              <FaChevronLeft />

            </button>

            <div
              className="
                px-6 py-3

                rounded-2xl

                bg-[#111]
                border border-white/10
              "
            >

              Page {page} of {totalPages}

            </div>

            <button
              disabled={
                page === totalPages
              }
              onClick={() =>
                setPage(
                  (prev) =>
                    prev + 1
                )
              }
              className="
                w-12 h-12

                rounded-full

                bg-white/5

                hover:bg-white/10

                disabled:opacity-50

                flex items-center
                justify-center

                transition
              "
            >

              <FaChevronRight />

            </button>

          </div>
        )
      }

    </div>
  );
}

export default MoviesPage;