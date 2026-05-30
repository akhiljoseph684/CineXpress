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
      console.log(res.bookings)

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
    flex
    flex-col

    gap-4
  "
          >
            {bookings.map((booking) => (
              <div
                key={booking._id}
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
                    src={booking.movie?.poster?.card}
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
            xl:grid-cols-8

            gap-4
          "
                  >
                    <div>
                      <p className="text-xs text-white/40">Movie</p>

                      <h3
                        className="
                          font-semibold
                          mt-1

                          line-clamp-2

                          overflow-hidden
                        "
                      >
                        {booking.movie?.title}
                      </h3>
                    </div>

                    <div>
                      <p className="text-xs text-white/40">Customer</p>

                      <h3 className="mt-1">{booking.user?.name}</h3>
                    </div>

                    <div>
                      <p className="text-xs text-white/40">Screen</p>

                      <h3 className="mt-1">{booking.screen?.name}</h3>
                    </div>

                    <div>
                      <p className="text-xs text-white/40">Date</p>

                      <h3 className="mt-1">
                        {new Date(booking.show?.showDate).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </h3>
                    </div>

                    <div>
                      <p className="text-xs text-white/40">Time</p>

                      <h3 className="mt-1">{booking.show?.startTime}</h3>
                    </div>

                    <div>
                      <p className="text-xs text-white/40">Seats</p>

                      <h3 className="mt-1">{booking.totalSeats}</h3>
                    </div>

                    <div>
                      <p className="text-xs text-white/40">Amount</p>

                      <h3
                        className="
                mt-1

                text-green-400

                font-semibold
              "
                      >
                        ₹{booking.totalAmount}
                      </h3>
                    </div>
                  </div>

                  <div
                    className="
            min-w-[140px]
          "
                  >
                    <span
                      className={`
                        block
                      
                        text-center
                      
                        px-4
                        py-2
                      
                        rounded-xl
                      
                        text-sm
                      
                        ${
                          booking.bookingStatus === "CONFIRMED"
                            ? booking.isScanned
                              ? `
                                bg-blue-500/20
                                text-blue-400
                              `
                              : `
                                bg-green-500/20
                                text-green-400
                              `
                            : `
                              bg-red-500/20
                              text-red-400
                            `
                        }
                      `}
                    >
                      {booking.bookingStatus === "CONFIRMED"
                        ? booking.isScanned
                          ? "USED"
                          : "CONFIRMED"
                        : booking.bookingStatus}
                    </span>
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
