import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  FaTicketAlt,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { getMyBookings } from "../services/bookingApi";

function MyBookingsPage() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await getMyBookings();

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

          flex
          items-center
          justify-center

          text-white
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
        py-8
      "
    >
      <div
        className="
          max-w-7xl

          mx-auto
        "
      >
        <h1
          className="
            text-4xl

            font-bold

            mb-8
          "
        >
          My Bookings 🎟️
        </h1>

        {!bookings.length ? (
          <div
            className="
              text-center

              py-20

              text-gray-400
            "
          >
            No bookings found
          </div>
        ) : (
          <div
            className="
              flex
              flex-col

              gap-5
            "
          >
            {bookings.map((booking) => (
              <div
                key={booking._id}
                onClick={() => navigate(`/booking-success/${booking._id}`)}
                className="
                    bg-[#111]

                    border
                    border-white/10

                    hover:border-pink-500

                    rounded-3xl

                    p-5

                    cursor-pointer

                    transition-all
                  "
              >
                <div
                  className="
                      flex

                      flex-col
                      lg:flex-row

                      gap-6
                    "
                >
                  <img
                    src={booking.show?.movieId?.poster?.card}
                    alt=""
                    className="
                        w-full
                        lg:w-48

                        h-64
                        lg:h-64

                        rounded-2xl

                        object-cover
                      "
                  />

                  <div
                    className="
                        flex-1
                      "
                  >
                    <h2
                      className="
                          text-2xl

                          font-bold
                        "
                    >
                      {booking.show?.movieId?.title}
                    </h2>

                    <div
                      className="
                          grid

                          md:grid-cols-2

                          gap-4

                          mt-6
                        "
                    >
                      <div
                        className="
                            flex
                            items-center

                            gap-3
                          "
                      >
                        <FaTicketAlt />

                        <span>{booking.ticketId}</span>
                      </div>

                      <div
                        className="
                            flex
                            items-center

                            gap-3
                          "
                      >
                        <FaMapMarkerAlt />

                        <span>{booking.show?.theatreId?.name}</span>
                      </div>

                      <div
                        className="
                            flex
                            items-center

                            gap-3
                          "
                      >
                        <FaCalendarAlt />

                        <span>{booking.show?.showDate}</span>
                      </div>

                      <div
                        className="
                            flex
                            items-center

                            gap-3
                          "
                      >
                        <FaClock />

                        <span>{booking.show?.startTime}</span>
                      </div>

                      <div>Screen : {booking.show?.screenId?.name}</div>

                      <div>
                        Seats :{" "}
                        {booking.seats
                          ?.map((seat) => seat.seatNumber)
                          .join(", ")}
                      </div>

                      <div>Amount : ₹{booking.totalAmount}</div>

                      <div>
                        Status :{" "}
                        <span
                          className="
                              text-green-400
                            "
                        >
                          {booking.bookingStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    className="
                        flex

                        justify-center
                        items-center
                      "
                  >
                    {booking.qrCode && (
                      <img
                        src={booking.qrCode}
                        alt="QR"
                        className="
                            w-32
                            h-32

                            rounded-xl

                            bg-white

                            p-2
                          "
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyBookingsPage;
