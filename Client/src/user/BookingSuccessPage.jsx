import React, {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  FaCheckCircle,
  FaTicketAlt,
  FaDownload,
  FaExclamationTriangle,
} from "react-icons/fa";

import {
  getBookingById,
} from "../services/bookingApi";

const BookingSuccessPage = () => {

  const navigate =
    useNavigate();

  const { bookingId } =
    useParams();

  const [booking,
    setBooking] =
    useState(null);

  const [loading,
    setLoading] =
    useState(true);

  useEffect(() => {

    fetchBooking();

  }, []);

  const fetchBooking =
    async () => {

      try {

        const res =
          await getBookingById(
            bookingId
          );

        setBooking(
          res.booking
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
        flex
        items-center
        justify-center
        px-4
        py-10
      "
    >

      <div
        className="
          w-full
          max-w-2xl

          bg-[#111]

          border
          border-white/10

          rounded-[40px]

          p-8

          text-center
        "
      >

        <div
          className="
            flex
            justify-center
          "
        >

          <FaCheckCircle
            className="
              text-green-400
              text-7xl
            "
          />

        </div>

        <h1
          className="
            text-5xl
            font-black
            mt-6
          "
        >

          Payment Successful 🎉

        </h1>

        <p
          className="
            text-white/60
            mt-4
          "
        >

          Your movie ticket has
          been booked successfully.

        </p>

        <div
          className="
            mt-8

            bg-pink-500/10

            border
            border-pink-500/20

            rounded-3xl

            p-5
          "
        >

          <p
            className="
              text-white/40
            "
          >

            Booking Reference

          </p>

          <h2
            className="
              text-pink-400
              text-2xl
              font-black
              mt-2
            "
          >

            {bookingId}

          </h2>

        </div>

        {booking?.qrCode && (

          <div
            className="
              mt-10
            "
          >

            <h2
              className="
                text-2xl
                font-bold
                mb-4
              "
            >

              Entry QR Code 🎟️

            </h2>

            <div
              className="
                bg-white
                p-5
                rounded-3xl
                inline-block
              "
            >

              <img
                src={
                  booking.qrCode
                }

                alt="QR"

                className="
                  w-64
                  h-64
                "
              />

            </div>

          </div>

        )}

        <div
          className="
            mt-8

            bg-yellow-500/10

            border
            border-yellow-500/20

            rounded-3xl

            p-5

            flex
            items-start
            gap-3

            text-left
          "
        >

          <FaExclamationTriangle
            className="
              text-yellow-400
              text-xl
              mt-1
            "
          />

          <div>

            <h3
              className="
                text-yellow-400
                font-bold
              "
            >

              Important Notice

            </h3>

            <ul
              className="
                mt-2
                text-sm
                text-white/70
                space-y-2
                list-disc
                pl-5
              "
            >

              <li>
                Take a screenshot
                of this QR code.
              </li>

              <li>
                Do not scan this
                QR before theatre
                entry.
              </li>

              <li>
                Theatre staff will
                scan this QR code.
              </li>

              <li>
                Once scanned, the
                ticket may become
                invalid.
              </li>

            </ul>

          </div>

        </div>

        <div
          className="
            flex
            gap-4
            mt-10
          "
        >

        </div>

      </div>

    </div>
  );
};

export default BookingSuccessPage;