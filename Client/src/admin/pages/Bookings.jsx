import React, { useEffect, useState } from "react";

import {
  FaTicketAlt,
  FaUser,
  FaFilm,
  FaMoneyBillWave,
  FaClock,
} from "react-icons/fa";
import { getAllBookings } from "../../services/bookingApi";

function Bookings() {
  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(false);

  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    fetchBookings(activeFilter);
  }, [activeFilter]);

  const fetchBookings = async (status) => {
    try {
      setLoading(true);

      let query = "";

      if (status !== "all") {
        query = `?status=${status}`;
      }

      const res = await getAllBookings(query);

      setBookings(res.bookings || []);
      console.log(res.bookings)
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
          items-center
          justify-between

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
            Bookings 🎟️
          </h1>

          <p
            className="
              text-gray-400
              mt-2
            "
          >
            Manage all bookings
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
        {["all", "PENDING", "CONFIRMED", "CANCELLED", "EXPIRED"].map((item) => (
          <button
            key={item}
            onClick={() => setActiveFilter(item)}
            className={`
                px-5 py-3

                rounded-xl

                border

                transition

                ${
                  activeFilter === item
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
            {item}
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
          {bookings.length ? (
            bookings.map((booking) => (
              <div
                key={booking._id}
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
                    src={booking.show?.movieId?.poster?.card}
                    alt=""
                    className="
                            w-full
                            h-[300px]

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
                              booking.bookingStatus === "CONFIRMED"
                                ? `
                                  bg-green-500
                                  text-black
                                `
                                : booking.bookingStatus === "PENDING"
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
                    {booking.bookingStatus}
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
                    {booking.show?.movieId?.title}
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
                        <FaUser />
                        User
                      </div>

                      <span
                        className="
                                text-white
                              "
                      >
                        {booking.user?.name}
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
                        <FaFilm />
                        Theatre
                      </div>

                      <span
                        className="
                                text-white
                              "
                      >
                        {booking.show?.theatreId?.name}
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
                        <FaTicketAlt />
                        Seats
                      </div>

                      <span
                        className="
                                text-white
                              "
                      >
                        {booking.totalSeats}
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
                        <FaMoneyBillWave />
                        Amount
                      </div>

                      <span
                        className="
                                text-white
                              "
                      >
                        ₹{booking.totalAmount}
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
                        Show Time
                      </div>

                      <span
                        className="
                                text-white
                              "
                      >
                        {new Date(
                          `1970-01-01T${booking.show?.startTime}`,
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
                🎟️
              </div>

              <h2
                className="
                      text-2xl
                      font-bold

                      mt-5
                    "
              >
                No Bookings Found
              </h2>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Bookings;
