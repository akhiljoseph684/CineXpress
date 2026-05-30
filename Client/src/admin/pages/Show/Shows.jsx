import React, { useEffect, useState } from "react";

import { FaFilm, FaMapMarkerAlt, FaClock, FaTv } from "react-icons/fa";

import { getAllShows } from "../../../services/showApi";

function Shows() {
  const [shows, setShows] = useState([]);

  const [loading, setLoading] = useState(false);

  const [activeFilter, setActiveFilter] = useState("running");

  const [currentPage, setCurrentPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchShows(activeFilter, currentPage);
  }, [activeFilter, currentPage]);

  const fetchShows = async (type, page = 1) => {
    try {
      setLoading(true);

      const res = await getAllShows(`?type=${type}&page=${page}&limit=12`);

      setShows(res.shows || []);

      setCurrentPage(res.currentPage);

      setTotalPages(res.totalPages);
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
            onClick={() => {
              setActiveFilter(item.value);

              setCurrentPage(1);
            }}
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
    flex
    flex-col

    gap-4
  "
        >
          {shows.map((show) => (
            <div
              key={show._id}
              className="
        bg-[#1a1a1a]

        border
        border-white/10

        hover:border-[#8b5c76]

        rounded-2xl

        p-4

        transition
      "
            >
              <div
                className="
          flex

          flex-col
          xl:flex-row

          items-start
          xl:items-center

          gap-5
        "
              >
                <img
                  src={show.movieId?.poster?.card}
                  alt=""
                  className="
            w-full
            xl:w-28

            h-40
            xl:h-28

            rounded-xl

            object-cover
          "
                />

                <div
                  className="
            flex-1

            grid

            md:grid-cols-2
            xl:grid-cols-5

            gap-4
          "
                >
                  <div>
                    <p
                      className="
                text-gray-500
                text-xs
              "
                    >
                      Movie
                    </p>

                    <h3
                      className="
                font-bold

                mt-1
              "
                    >
                      {show.movieId?.title}
                    </h3>
                  </div>

                  <div>
                    <p
                      className="
                text-gray-500
                text-xs
              "
                    >
                      Theatre
                    </p>

                    <h3
                      className="
                mt-1
              "
                    >
                      {show.theatreId?.name}
                    </h3>
                  </div>

                  <div>
                    <p
                      className="
                text-gray-500
                text-xs
              "
                    >
                      Screen
                    </p>

                    <h3
                      className="
                mt-1
              "
                    >
                      {show.screenId?.name}
                    </h3>
                  </div>

                  <div>
                    <p
                      className="
                text-gray-500
                text-xs
              "
                    >
                      Date
                    </p>

                    <h3
                      className="
                mt-1
              "
                    >
                      {show.showDate}
                    </h3>
                  </div>

                  <div>
                    <p
                      className="
                text-gray-500
                text-xs
              "
                    >
                      Timing
                    </p>

                    <h3
                      className="
                mt-1
              "
                    >
                      {show.startTime}
                      {" - "}
                      {show.endTime}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading && totalPages > 1 && (
        <div
          className="
        flex

        items-center
        justify-center

        gap-3

        mt-10
      "
        >
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="
          px-4
          py-2

          rounded-xl

          bg-[#1a1a1a]

          border
          border-white/10

          disabled:opacity-40
        "
          >
            Previous
          </button>

          <span
            className="
          px-5
          py-2

          rounded-xl

          bg-[#8b5c76]
        "
          >
            {currentPage}
            {" / "}
            {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="
          px-4
          py-2

          rounded-xl

          bg-[#1a1a1a]

          border
          border-white/10

          disabled:opacity-40
        "
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Shows;
