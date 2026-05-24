import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getMovieShows } from "../services/showApi";
import { getMovieById } from "../services/moviesApi";

const MovieShowsPage = () => {
  const { movieId } = useParams();

  const navigate = useNavigate();

  const [shows, setShows] = useState([]);
  const [movie, setMovie] = useState({});
  const [loading, setLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  useEffect(() => {
    window.scrollTo({
      top: 0,

      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    fetchShows();
  }, [selectedDate]);

  useEffect(() => {
    fetchMovie();
  }, [movieId]);

  const fetchMovie = async () => {
    try {
      const res = await getMovieById(movieId);
      setMovie(res.movie || {});
    } catch (error) {
      console.log(error);
    }
  };

  const fetchShows = async () => {
    try {
      setLoading(true);

      const res = await getMovieShows(movieId, selectedDate);

      setShows(res.shows || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const generateDates = () => {
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() + index);
      return date;
    });
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <div className="relative border-b border-white/10 bg-gradient-to-b from-[#141414] to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-14">
          <div className="max-w-3xl">
            <p className="text-pink-500 uppercase tracking-[4px] text-xs sm:text-sm mb-3">
              Book Tickets
            </p>

            <h1
              className="
                text-3xl
                sm:text-4xl
                md:text-5xl
                lg:text-6xl
                font-black
                leading-tight
                break-words
              "
            >
              {movie.title}
            </h1>

            <div className="flex flex-wrap gap-2 mt-5">
              {movie.genre?.map((genre) => (
                <div
                  key={genre.name}
                  className="
                    px-3 py-1.5
                    sm:px-4 sm:py-2
                    rounded-full
                    bg-white/5
                    border border-white/10
                    text-xs sm:text-sm
                    text-white/70
                    backdrop-blur-md
                  "
                >
                  {genre.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        className="
          sticky top-0 z-40
          bg-black/90
          backdrop-blur-2xl
          border-b border-white/10
        "
      >
        <div
          className="
            max-w-7xl mx-auto
            px-3 sm:px-6 lg:px-8
            py-3

            grid
            grid-cols-7
            gap-2
          "
        >
          {generateDates().map((date) => {
            const formattedDate = date.toISOString().split("T")[0];

            const isSelected = selectedDate === formattedDate;

            return (
              <button
                key={formattedDate}
                onClick={() => setSelectedDate(formattedDate)}
                className={`
                    flex-1
                    min-w-0
                
                    rounded-xl
                
                    px-2 py-2
                    sm:px-3 sm:py-3
                
                    border
                    transition-all duration-300
                
                    ${
                      isSelected
                        ? `
                          bg-pink-600
                          border-pink-500
                        `
                        : `
                          bg-[#111]
                          border-white/10
                        `
                    }
                  `}
              >
                <p className="text-[9px] sm:text-[10px] uppercase text-white/60">
                  {date.toLocaleDateString("en-US", {
                    weekday: "short",
                  })}
                </p>

                <h2 className="text-base sm:text-lg font-black mt-0.5">
                  {date.getDate()}
                </h2>

                <p className="text-[9px] sm:text-[10px] mt-0.5 text-white/60">
                  {date.toLocaleDateString("en-US", {
                    month: "short",
                  })}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="h-12 w-12 rounded-full border-4 border-pink-500 border-t-transparent animate-spin" />
          </div>
        ) : shows.length === 0 ? (
          <div
            className="
              bg-[#111]
              border border-white/10
              rounded-3xl
              p-8 sm:p-12
              text-center
            "
          >
            <h2 className="text-2xl sm:text-3xl font-bold">No Shows Found</h2>

            <p className="text-white/50 mt-3 text-sm sm:text-base">
              No shows available for selected date
            </p>
          </div>
        ) : (
          <div className="space-y-5 sm:space-y-6">
            {shows.map((item) => (
              <div
                key={item._id}
                className="
                  bg-[#111]
                  border border-white/10
                  rounded-3xl
                  overflow-hidden
                "
              >
                <div
                  className="
                    flex flex-col
                    xl:flex-row
                  "
                >
                  <div
                    className="
                      xl:w-80
                      w-full
                      p-5 sm:p-6 lg:p-8
                      border-b xl:border-b-0 xl:border-r
                      border-white/10
                      bg-[#151515]
                    "
                  >
                    <h2
                      className="
                        text-2xl
                        sm:text-3xl
                        font-bold
                        leading-tight
                        break-words
                      "
                    >
                      {item.theatre?.name}
                    </h2>

                    <p className="text-white/50 mt-4 text-sm sm:text-base leading-relaxed">
                      {item.theatre?.address}
                    </p>

                    <div className="flex items-center gap-2 mt-6">
                      <div className="h-2.5 w-2.5 rounded-full bg-green-500" />

                      <p className="text-sm text-green-400 font-medium">
                        Shows Available
                      </p>
                    </div>
                  </div>

                  <div className="flex-1 p-4 sm:p-6 lg:p-8">
                    <div
                      className="
                        grid
                        grid-cols-2
                        sm:grid-cols-3
                        md:grid-cols-4
                        xl:grid-cols-5
                        gap-3 sm:gap-4
                      "
                    >
                      {item.shows.map((show) => (
                        <button
                          key={show._id}
                          onClick={() => navigate(`/booking/movie/${show._id}`)}
                          className="
                            group
                            w-full

                            bg-black
                            border border-pink-500/20

                            rounded-2xl

                            px-3 py-4
                            sm:px-5 sm:py-5

                            hover:bg-pink-500/10
                            hover:border-pink-500
                            hover:-translate-y-1

                            transition-all duration-300
                          "
                        >
                          <h2
                            className="
                              text-lg
                              sm:text-xl
                              lg:text-2xl
                              font-bold
                              text-pink-400
                              group-hover:text-pink-300
                            "
                          >
                            {new Date(
                              `2000-01-01T${show.startTime}`,
                            ).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </h2>

                          <p className="text-[11px] sm:text-xs text-white/50 mt-2">
                            {show.screen}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieShowsPage;
