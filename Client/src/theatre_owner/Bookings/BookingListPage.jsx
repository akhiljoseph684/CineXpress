import React, { useEffect, useState } from "react";

import {
  FaTicketAlt,
  FaUser,
  FaMoneyBillWave,
  FaClock,
  FaFilm,
} from "react-icons/fa";

import { getBookingsByOwner } from "../../services/bookingApi";

const BookingListPage = () => {
  const [loading, setLoading] = useState(true);

  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await getBookingsByOwner();

      setBookings(res.bookings || []);
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
            mb-8
          "
        >
          <h1
            className="
              text-3xl
              md:text-4xl

              font-bold
            "
          >
            Bookings 🎟️
          </h1>

          <p
            className="
              text-white/50

              mt-2
            "
          >
            Manage your theatre bookings
          </p>
        </div>


        {bookings.length === 0 ? (
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
              No Bookings Found
            </h2>

            <p
              className="
                  text-white/50

                  mt-2
                "
            >
              No users booked tickets yet
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
            {bookings.map((booking) => (
              <div
                key={booking._id}
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
                    src={booking.movie?.poster?.card}
                    alt=""
                    className="
                            w-full
                            h-[260px]

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
                              booking.bookingStatus === "CONFIRMED"
                                ? `
                                  bg-green-500/20
                                  text-green-400
                                `
                                : booking.bookingStatus === "PENDING"
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
                    {booking.bookingStatus}
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
                    {booking.movie?.title}
                  </h2>


                  <div
                    className="
                            mt-5

                            flex
                            items-center

                            gap-3
                          "
                  >
                    <img
                      src={
                        booking.user?.avatar ||
                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThZwd0Ar5WsR1Z-ylhArKLTDqEhKPlMqWvZw&s"
                      }
                      alt=""
                      className="
                              w-12
                              h-12

                              rounded-full

                              object-cover
                            "
                    />

                    <div>
                      <h3
                        className="
                                font-semibold
                              "
                      >
                        {booking.user?.name}
                      </h3>

                      <p
                        className="
                                text-sm
                                text-white/50
                              "
                      >
                        {booking.user?.email}
                      </p>
                    </div>
                  </div>


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
                        {booking.theatre?.name}
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
                        📅 Date
                      </div>

                      <p
                        className="
      font-medium
    "
                      >
                        {new Date(booking.show?.showDate).toLocaleDateString(
                          "en-IN",

                          {
                            day: "numeric",

                            month: "short",

                            year: "numeric",
                          },
                        )}
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
                        Show Time
                      </div>

                      <p
                        className="
                                font-medium
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
                        <FaTicketAlt />
                        Seats
                      </div>

                      <p
                        className="
                                font-medium
                              "
                      >
                        {booking.totalSeats}
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
                        <FaMoneyBillWave />
                        Amount
                      </div>

                      <p
                        className="
                                font-semibold

                                text-green-400
                              "
                      >
                        ₹{booking.totalAmount}
                      </p>
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

export default BookingListPage;
