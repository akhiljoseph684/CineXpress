import React, { useEffect, useState } from "react";

import { FaFilm, FaMapMarkerAlt, FaClock, FaTv } from "react-icons/fa";

import { getAllShows } from "../../../services/showApi";

function Shows() {
  const [shows, setShows] = useState([]);

  const [loading, setLoading] = useState(false);

  const [activeFilter, setActiveFilter] = useState("running");

  useEffect(() => {
    fetchShows(activeFilter);
  }, [activeFilter]);

  const fetchShows = async (type) => {
    try {
      setLoading(true);

      const res = await getAllShows(`?type=${type}`);

      setShows(res.shows || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        w-full
      "
    >

      <div
        className="
          flex
          flex-col
          md:flex-row

          md:items-center
          md:justify-between

          gap-5

          mb-8
        "
      >
        <div>
          <h1
            className="
              text-3xl
              font-bold
            "
          >
            Shows 🎬
          </h1>

          <p
            className="
              text-gray-400
              mt-2
            "
          >
            Manage all movie shows
          </p>
        </div>
      </div>


      <div
        className="
          flex
          items-center

          gap-3

          flex-wrap

          mb-8
        "
      >
        {[
          {
            label: "Running",

            value: "running",
          },

          {
            label: "Upcoming",

            value: "upcoming",
          },

          {
            label: "Ended",

            value: "ended",
          },
        ].map((item) => (
          <button
            key={item.value}
            onClick={() => setActiveFilter(item.value)}
            className={`
                px-5 py-3

                rounded-xl

                border

                transition

                ${
                  activeFilter === item.value
                    ? `
                      bg-gradient-to-r
                      from-[#8b5c76]
                      to-[#6f4660]

                      border-[#8b5c76]
                    `
                    : `
                      bg-[#1a1a1a]

                      border-white/10

                      hover:border-[#8b5c76]
                    `
                }
              `}
          >
            {item.label}
          </button>
        ))}
      </div>


      {loading ? (
        <div
          className="
              flex
              items-center
              justify-center

              py-20
            "
        >
          Loading...
        </div>
      ) : (
        <div
          className="
              grid
              grid-cols-1
              md:grid-cols-2
              xl:grid-cols-3

              gap-6
            "
        >
          {shows.length ? (
            shows.map((show) => (
              <div
                key={show._id}
                className="
                        bg-[#1a1a1a]

                        rounded-2xl

                        overflow-hidden

                        border
                        border-white/10

                        hover:border-[#8b5c76]

                        transition
                      "
              >

                <div
                  className="
                          relative
                        "
                >
                  <img
                    src={show.movieId?.poster?.card}
                    alt=""
                    className="
                            w-full
                            h-[320px]

                            object-cover
                          "
                  />

                  <div
                    className={`
                            absolute
                            top-4
                            left-4

                            px-3
                            py-2

                            rounded-xl

                            text-xs
                            font-semibold

                            ${
                              activeFilter === "running"
                                ? `
                                  bg-green-500
                                  text-black
                                `
                                : activeFilter === "upcoming"
                                  ? `
                                    bg-yellow-500
                                    text-black
                                  `
                                  : `
                                    bg-red-500
                                    text-white
                                  `
                            }
                          `}
                  >
                    {activeFilter}
                  </div>
                </div>


                <div
                  className="
                          p-5
                        "
                >
                  <h2
                    className="
                            text-xl
                            font-bold

                            line-clamp-1
                          "
                  >
                    {show.movieId?.title}
                  </h2>

                  <div
                    className="
                            mt-5

                            space-y-4

                            text-sm
                            text-gray-400
                          "
                  >

                    <div
                      className="
                              flex
                              items-center
                              justify-between
                            "
                    >
                      <div
                        className="
                                flex
                                items-center
                                gap-2
                              "
                      >
                        <FaFilm />
                        Theatre
                      </div>

                      <span
                        className="
                                text-white
                              "
                      >
                        {show.theatreId?.name}
                      </span>
                    </div>


                    <div
                      className="
                              flex
                              items-center
                              justify-between
                            "
                    >
                      <div
                        className="
                                flex
                                items-center
                                gap-2
                              "
                      >
                        <FaTv />
                        Screen
                      </div>

                      <span
                        className="
                                text-white
                              "
                      >
                        {show.screenId?.name}
                      </span>
                    </div>


                    <div
                      className="
                              flex
                              items-center
                              justify-between
                            "
                    >
                      <div
                        className="
                                flex
                                items-center
                                gap-2
                              "
                      >
                        <FaMapMarkerAlt />
                        City
                      </div>

                      <span
                        className="
                                text-white
                              "
                      >
                        {show.theatreId?.city}
                      </span>
                    </div>


                    <div
                      className="
                              flex
                              items-center
                              justify-between
                            "
                    >
                      <div
                        className="
                                flex
                                items-center
                                gap-2
                              "
                      >
                        <FaClock />
                        Timing
                      </div>

                      <span
                        className="
                                text-white
                              "
                      >
                        {new Date(
                          `1970-01-01T${show.startTime}`,
                        ).toLocaleTimeString(
                          "en-IN",

                          {
                            hour: "numeric",

                            minute: "2-digit",

                            hour12: true,
                          },
                        )}

                        {" - "}

                        {new Date(
                          `1970-01-01T${show.endTime}`,
                        ).toLocaleTimeString(
                          "en-IN",

                          {
                            hour: "numeric",

                            minute: "2-digit",

                            hour12: true,
                          },
                        )}
                      </span>
                    </div>


                    <div
                      className="
                              flex
                              items-center
                              justify-between
                            "
                    >
                      <span>Date</span>

                      <span
                        className="
                                text-white
                              "
                      >
                        {show.showDate}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div
              className="
                    col-span-full

                    flex
                    flex-col

                    items-center
                    justify-center

                    py-20
                  "
            >
              <div
                className="
                      text-7xl
                    "
              >
                🎬
              </div>

              <h2
                className="
                      text-2xl
                      font-bold

                      mt-5
                    "
              >
                No Shows Found
              </h2>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Shows;
