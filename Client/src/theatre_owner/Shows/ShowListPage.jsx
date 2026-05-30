import React, { useEffect, useState } from "react";

import { FaClock, FaFilm, FaTv, FaMapMarkerAlt } from "react-icons/fa";
import { cancelShow, getShowsByOwner } from "../../services/showApi";

const ShowListPage = () => {
  const [loading, setLoading] = useState(true);

  const [shows, setShows] = useState([]);

  const [activeFilter, setActiveFilter] = useState("running");

  const [showCancelModal, setShowCancelModal] = useState(false);

  const [selectedShowId, setSelectedShowId] = useState(null);

  useEffect(() => {
    fetchShows(activeFilter);
  }, [activeFilter]);

  const fetchShows = async (type) => {
    try {
      setLoading(true);

      const res = await getShowsByOwner(`?type=${type}`);

      setShows(res.shows || []);
      console.log(res.shows);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelShow = async () => {
    try {
      const res = await cancelShow(selectedShowId);

      if (res.success) {
        setShowCancelModal(false);

        setSelectedShowId(null);

        fetchShows(activeFilter);
      }
    } catch (error) {
      console.log(error);
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
          {["running", "upcoming", "ended"].map((item) => (
            <button
              key={item}
              onClick={() => setActiveFilter(item)}
              className={`
                  px-5
                  py-3

                  rounded-2xl

                  border

                  capitalize

                  transition

                  ${
                    activeFilter === item
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
          ))}
        </div>

        {shows.length === 0 ? (
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
    flex
    flex-col

    gap-4
  "
          >
            {shows.map((show) => (
              <div
                key={show._id}
                className="
        bg-[#111]

        border
        border-white/10

        hover:border-pink-500/50

        rounded-2xl

        p-4

        transition-all
      "
              >
                <div
                  className="
          flex

          flex-col
          lg:flex-row

          items-start
          lg:items-center

          gap-5
        "
                >
                  <img
                    src={show.movieId?.poster?.card}
                    alt=""
                    className="
            w-full
            lg:w-28

            h-44
            lg:h-28

            rounded-xl

            object-cover
          "
                  />

                  <div
                    className="
            flex-1

            grid

            md:grid-cols-2
            xl:grid-cols-6

            gap-4
          "
                  >
                    <div>
                      <p className="text-xs text-white/40">Movie</p>

                      <h3 className="font-semibold mt-1">
                        {show.movieId?.title}
                      </h3>
                    </div>

                    <div>
                      <p className="text-xs text-white/40">Theatre</p>

                      <h3 className="mt-1">{show.theatreId?.name}</h3>
                    </div>

                    <div>
                      <p className="text-xs text-white/40">Screen</p>

                      <h3 className="mt-1">{show.screen?.name}</h3>
                    </div>

                    <div>
                      <p className="text-xs text-white/40">City</p>

                      <h3 className="mt-1">{show.theatreId?.city}</h3>
                    </div>

                    <div>
                      <p className="text-xs text-white/40">Date</p>

                      <h3 className="mt-1">
                        {new Date(show.showDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </h3>
                    </div>

                    <div>
                      <p className="text-xs text-white/40">Time</p>

                      <h3 className="mt-1">
                        {show.startTime}
                        {" - "}
                        {show.endTime}
                      </h3>
                    </div>
                  </div>

                  <div
                    className="
            flex

            flex-col

            gap-3

            min-w-[170px]
          "
                  >
                    <span
                      className={`
              text-center

              px-4
              py-2

              rounded-xl

              text-sm

              ${
                activeFilter === "running"
                  ? `
                    bg-green-500/20
                    text-green-400
                  `
                  : activeFilter === "upcoming"
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
                      {activeFilter}
                    </span>

                    <button
                      onClick={() => {
                        setSelectedShowId(show._id);

                        setShowCancelModal(true);
                      }}
                      className="
                        px-5
                        py-2

                        rounded-xl

                        bg-red-600

                        hover:bg-red-500

                        transition
                      "
                    >
                      Cancel Show
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {showCancelModal && (
        <div
          className="
        fixed
        inset-0

        bg-black/70

        backdrop-blur-sm

        flex
        items-center
        justify-center

        z-50

        p-4
      "
        >
          <div
            className="
          w-full
          max-w-md

          bg-[#111]

          border
          border-red-500/20

          rounded-3xl

          p-8

          text-center
        "
          >
            <div
              className="
            text-6xl
          "
            >
              🎬
            </div>

            <h2
              className="
            text-3xl

            font-bold

            mt-4
          "
            >
              Cancel Show?
            </h2>

            <p
              className="
            text-white/50

            mt-3
          "
            >
              This show will be cancelled and users will no longer be able to
              book tickets.
            </p>

            <div
              className="
            flex

            gap-4

            mt-8
          "
            >
              <button
                onClick={() => setShowCancelModal(false)}
                className="
              flex-1

              py-3

              rounded-2xl

              bg-white/10

              hover:bg-white/20
            "
              >
                Close
              </button>

              <button
                onClick={handleCancelShow}
                className="
              flex-1

              py-3

              rounded-2xl

              bg-red-600

              hover:bg-red-500
            "
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowListPage;
