import React, {
  useEffect,
  useState,
} from "react";

import {
  FaClock,
  FaFilm,
  FaTv,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { getShowsByOwner } from "../../services/showApi";

const ShowListPage = () => {

  const [loading,
    setLoading] =
    useState(true);

  const [shows,
    setShows] =
    useState([]);

  const [activeFilter,
    setActiveFilter] =
    useState("running");

  useEffect(() => {

    fetchShows(
      activeFilter
    );

  }, [activeFilter]);

  const fetchShows =
    async (type) => {

      try {

        setLoading(true);

        const res =
          await getShowsByOwner(
            `?type=${type}`
          );

        setShows(
          res.shows || []
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);
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
      "
    >

      <div
        className="
          max-w-7xl
          mx-auto
        "
      >


        <div
          className="
            flex
            flex-col
            md:flex-row

            md:items-center
            md:justify-between

            gap-4

            mb-8
          "
        >

          <div>

            <h1
              className="
                text-3xl
                md:text-4xl

                font-bold
              "
            >

              Shows 🎬

            </h1>

            <p
              className="
                text-white/50

                mt-2
              "
            >

              Manage your movie shows

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

          {
            [
              "running",

              "upcoming",

              "ended",
            ].map((item) => (

              <button
                key={item}

                onClick={() =>
                  setActiveFilter(
                    item
                  )
                }

                className={`
                  px-5
                  py-3

                  rounded-2xl

                  border

                  capitalize

                  transition

                  ${
                    activeFilter ===
                    item

                      ? `
                        bg-pink-500
                        border-pink-500
                      `

                      : `
                        bg-[#111]

                        border-white/10

                        hover:border-pink-500
                      `
                  }
                `}
              >

                {item}

              </button>
            ))
          }

        </div>


        {
          shows.length === 0 ? (

            <div
              className="
                bg-[#111]

                border
                border-white/10

                rounded-3xl

                p-10

                text-center
              "
            >

              <h2
                className="
                  text-2xl
                  font-semibold
                "
              >

                No Shows Found

              </h2>

              <p
                className="
                  text-white/50

                  mt-2
                "
              >

                No movie shows available

              </p>

            </div>

          ) : (

            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                xl:grid-cols-3

                gap-6
              "
            >

              {
                shows.map(
                  (show) => (

                    <div
                      key={show._id}

                      className="
                        bg-[#111]

                        border
                        border-white/10

                        rounded-3xl

                        overflow-hidden

                        flex
                        flex-col
                        justify-between
                      "
                    >


                      <div
                        className="
                          relative
                        "
                      >

                        <img
                          src={
                            show
                              .movieId
                              ?.poster
                              ?.card
                          }

                          alt=""

                          className="
                            w-full
                            h-[280px]

                            object-cover
                          "
                        />

                        <div
                          className={`
                            absolute
                            top-4
                            right-4

                            px-3
                            py-1

                            rounded-full

                            text-sm
                            font-medium

                            ${
                              activeFilter ===
                              "running"

                                ? `
                                  bg-green-500/20
                                  text-green-400
                                `

                                : activeFilter ===
                                  "upcoming"

                                  ? `
                                    bg-yellow-500/20
                                    text-yellow-400
                                  `

                                  : `
                                    bg-red-500/20
                                    text-red-400
                                  `
                            }
                          `}
                        >

                          {
                            activeFilter
                          }

                        </div>

                      </div>


                      <div
                        className="
                          p-6
                        "
                      >


                        <h2
                          className="
                            text-2xl
                            font-bold
                          "
                        >

                          {
                            show
                              .movieId
                              ?.title
                          }

                        </h2>


                        <div
                          className="
                            mt-6

                            space-y-4
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

                                text-white/50
                              "
                            >

                              <FaFilm />

                              Theatre

                            </div>

                            <p
                              className="
                                font-medium
                              "
                            >

                              {
                                show
                                  .theatreId
                                  ?.name
                              }

                            </p>

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

                                text-white/50
                              "
                            >

                              <FaTv />

                              Screen

                            </div>

                            <p
                              className="
                                font-medium
                              "
                            >

                              {
                                show
                                  .screenId
                                  ?.name
                              }

                            </p>

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

                                text-white/50
                              "
                            >

                              <FaMapMarkerAlt />

                              City

                            </div>

                            <p
                              className="
                                font-medium
                              "
                            >

                              {
                                show
                                  .theatreId
                                  ?.location
                                  ?.city
                              }

                            </p>

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

                                text-white/50
                              "
                            >

                              📅

                              Date

                            </div>

                            <p
                              className="
                                font-medium
                              "
                            >

                              {
                                new Date(
                                  show.showDate
                                ).toLocaleDateString(
                                  "en-IN",

                                  {
                                    day:
                                      "numeric",

                                    month:
                                      "short",

                                    year:
                                      "numeric",
                                  }
                                )
                              }

                            </p>

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

                                text-white/50
                              "
                            >

                              <FaClock />

                              Time

                            </div>

                            <p
                              className="
                                font-medium
                              "
                            >

                              {
                                new Date(
                                  `1970-01-01T${show.startTime}`
                                ).toLocaleTimeString(
                                  "en-IN",

                                  {
                                    hour:
                                      "numeric",

                                    minute:
                                      "2-digit",

                                    hour12:
                                      true,
                                  }
                                )
                              }

                              {" - "}

                              {
                                new Date(
                                  `1970-01-01T${show.endTime}`
                                ).toLocaleTimeString(
                                  "en-IN",

                                  {
                                    hour:
                                      "numeric",

                                    minute:
                                      "2-digit",

                                    hour12:
                                      true,
                                  }
                                )
                              }

                            </p>

                          </div>

                        </div>

                      </div>

                    </div>
                  )
                )
              }

            </div>
          )
        }

      </div>

    </div>
  );
};

export default ShowListPage;