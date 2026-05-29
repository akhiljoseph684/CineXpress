import React, { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { FaMapMarkerAlt, FaChair, FaClock } from "react-icons/fa";
import { scanTicket, verifyTicketEntry } from "../services/ticketApi";

const TicketPage = () => {
  const { ticketId } = useParams();

  const navigate = useNavigate()

  const [loading, setLoading] = useState(true);

  const [booking, setBooking] = useState(null);

  const [verifying, setVerifying] = useState(false);
  useEffect(() => {
    fetchTicket();
  }, []);

  const fetchTicket = async () => {
    try {
      const res = await scanTicket(ticketId);

      console.log(res);
      setBooking(res.booking);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyTicket = async () => {
    try {
      setVerifying(true);

      const res = await verifyTicketEntry(ticketId);

      if (res.success) {
        navigate("/theatre-owner")
        fetchTicket();
      }
    } catch (error) {
      console.log(error);

      alert(error?.message || "Failed to verify ticket");
    } finally {
      setVerifying(false);
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
        Loading Ticket...
      </div>
    );
  }

  if (!booking) {
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
        Ticket Not Found
      </div>
    );
  }

  if (booking.isScanned) {
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
        "
      >
        <div
          className="
            w-full
            max-w-xl

            bg-[#111]

            border
            border-red-500/20

            rounded-3xl

            p-10

            text-center
          "
        >
          <h1
            className="
              text-5xl
              font-black
              text-red-500
            "
          >
            Ticket Used
          </h1>

          <p
            className="
              mt-5
              text-white/60
            "
          >
            This ticket has already been scanned.
          </p>

          <p
            className="
              mt-6
              text-white/40
            "
          >
            Ticket ID: {booking.ticketId}
          </p>

          <p
            className="
              mt-2
              text-white/40
            "
          >
            Scanned At: {new Date(booking.scannedAt).toLocaleString()}
          </p>
        </div>
      </div>
    );
  }

  const movie = booking.show?.movieId;

  const theatre = booking.show?.theatreId;

  const screen = booking.show?.screenId;

  return (
    <div
      className="
        min-h-screen
        bg-black
        text-white
        px-4
        py-10
      "
    >
      <div
        className="
          max-w-4xl
          mx-auto
        "
      >
        <div
          className="
            bg-[#111]

            rounded-3xl

            overflow-hidden

            border
            border-white/10
          "
        >
          <img
            src={movie?.poster?.banner}
            alt=""
            className="
              w-full
              h-[320px]
              object-cover
            "
          />

          <div
            className="
              p-8
            "
          >
            <h1
              className="
                text-5xl
                font-black
              "
            >
              {movie?.title}
            </h1>

            <div
              className="
                mt-5

                inline-flex

                px-5
                py-3

                rounded-2xl

                bg-green-500/10

                border
                border-green-500/20

                text-green-400
              "
            >
              Entry Allowed 🎟️
            </div>

            <div
              className="
                grid
                md:grid-cols-2
                gap-6
                mt-10
              "
            >
              <div>
                <p
                  className="
                    text-white/40
                  "
                >
                  Theatre
                </p>

                <div
                  className="
                    flex
                    gap-2
                    mt-2
                  "
                >
                  <FaMapMarkerAlt />

                  {theatre?.name}
                </div>
              </div>

              <div>
                <p
                  className="
                    text-white/40
                  "
                >
                  Screen
                </p>

                <div
                  className="
                    mt-2
                  "
                >
                  {screen?.name}
                </div>
              </div>

              <div>
                <p
                  className="
                    text-white/40
                  "
                >
                  Date
                </p>

                <div
                  className="
                    mt-2
                  "
                >
                  {booking.show?.showDate}
                </div>
              </div>

              <div>
                <p
                  className="
                    text-white/40
                  "
                >
                  Time
                </p>

                <div
                  className="
                    mt-2
                  "
                >
                  <FaClock /> {booking.show?.startTime}
                </div>
              </div>
            </div>

            <div
              className="
                mt-10
              "
            >
              <p
                className="
                  text-white/40
                  mb-4
                "
              >
                Seats
              </p>

              <div
                className="
                  flex
                  flex-wrap
                  gap-3
                "
              >
                {booking.seats.map((seat, index) => (
                  <div
                    key={index}
                    className="
                        px-4
                        py-2

                        rounded-xl

                        bg-pink-500/10

                        border
                        border-pink-500/20

                        text-pink-400

                        flex
                        items-center
                        gap-2
                      "
                  >
                    <FaChair />

                    {seat.seatNumber}
                  </div>
                ))}
              </div>
              <div
                className="
    mt-10
  "
              >
                <button
                  onClick={handleVerifyTicket}
                  disabled={verifying}
                  className="
      w-full

      py-4

      rounded-2xl

      bg-green-600

      hover:bg-green-500

      disabled:opacity-50

      font-bold
      text-lg

      transition-all
    "
                >
                  {verifying ? "Verifying..." : "Verify Ticket & Allow Entry"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketPage;
