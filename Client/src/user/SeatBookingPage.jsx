import React, { useEffect, useMemo, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { getShowById } from "../services/showApi";
import { reserveSeats } from "../services/bookingApi";
import Legend from "../Components/Legend";
import {
  createPaymentOrder,
  paymentFailed,
  verifyPayment,
} from "../services/paymentApi";

const SeatBookingPage = () => {
  const { showId } = useParams();
  
  const [toast, setToast] = useState(null);

  const [show, setShow] = useState(null);

  const [seatLayout, setSeatLayout] = useState([]);

  const [bookedSeats, setBookedSeats] = useState([]);

  const [selectedSeats, setSelectedSeats] = useState([]);

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const showToast = (
  message,
  type = "success"
) => {

  setToast({
    message,
    type,
  });

  setTimeout(() => {
    setToast(null);
  }, 3000);
};

  useEffect(() => {
    window.scrollTo({
      top: 0,

      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    fetchShow();
  }, [showId]);

  const fetchShow = async () => {
    try {
      setLoading(true);

      const res = await getShowById(showId);

      setShow(res.show);

      setSeatLayout(res.show.screenId?.seatLayout);

      setBookedSeats(res.bookedSeats || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const isBooked = (rowIndex, colIndex) => {
    return bookedSeats.some(
      (seat) => seat.row === rowIndex && seat.col === colIndex,
    );
  };

  const isSelected = (rowIndex, colIndex) => {
    return selectedSeats.some(
      (seat) => seat.row === rowIndex && seat.col === colIndex,
    );
  };

  const handleSeatClick = (seat, rowIndex, colIndex) => {
    if (isBooked(rowIndex, colIndex)) return;

    const exists = isSelected(rowIndex, colIndex);

    if (exists) {
      setSelectedSeats((prev) =>
        prev.filter(
          (item) => !(item.row === rowIndex && item.col === colIndex),
        ),
      );

      return;
    }

    setSelectedSeats((prev) => [
      ...prev,

      {
        seatNumber: seat.seatNumber,

        row: rowIndex,

        col: colIndex,

        type: seat.type,

        price: show.screenId.prices[seat.type],
      },
    ]);
  };

  const totalAmount = useMemo(() => {
    return selectedSeats.reduce((acc, seat) => acc + seat.price, 0);
  }, [selectedSeats]);

  const handleReserveSeats = async () => {
    try {
      // RESERVE SEATS
      const res = await reserveSeats({
        showId,

        seats: selectedSeats,

        totalAmount,
      });

      const booking = res.booking;

      // CREATE PAYMENT ORDER
      const orderRes = await createPaymentOrder({
        bookingId: booking._id,
      });

      const order = orderRes.order;

      // OPEN RAZORPAY
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,

        amount: order.amount,

        currency: order.currency,

        name: "CineXpress",

        description: "Movie Ticket Booking",

        order_id: order.id,

        theme: {
          color: "#ed64a6",
        },

        handler: async function (response) {
          // VERIFY PAYMENT
          await verifyPayment({
            bookingId: booking._id,

            razorpay_order_id: response.razorpay_order_id,

            razorpay_payment_id: response.razorpay_payment_id,

            razorpay_signature: response.razorpay_signature,
          });

          showToast(
            "Payment Successful 🎉"
          );

          navigate(`/booking-success/${booking._id}`);
        },

        modal: {
          ondismiss: async function () {
            await paymentFailed({
              bookingId: booking._id,
            });

            showToast("Payment Cancelled");
            navigate(`/shows/movie/${show.movieId._id}`);
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.open();
    } catch (error) {
      showToast(error?.message);
    }
  };

  const getSeatStyles = (seat, rowIndex, colIndex) => {
    if (isBooked(rowIndex, colIndex)) {
      return `
        bg-gray-400
        border-gray-400
        text-white
        opacity-20
        cursor-not-allowed
      `;
    }

    if (isSelected(rowIndex, colIndex)) {
      switch (seat.type?.toLowerCase()) {
        case "recliner":
          return `
          bg-yellow-500
          border-yellow-500
          text-white
        `;

        case "vip":
          return `
          bg-green-500
          border-green-500
          text-white
        `;
        case "couple":
          return `
          bg-cyan-500
          border-cyan-500
          text-white
        `;

        default:
          return `
          bg-pink-500
          border-pink-500
          text-white
        `;
      }
    }

    switch (seat.type?.toLowerCase()) {
      case "recliner":
        return `
          border-yellow-500
          text-yellow-400
          hover:bg-yellow-500/10
        `;

      case "vip":
        return `
          border-green-500
          text-green-400
          hover:bg-green-500/10
        `;
      case "couple":
        return `
          border-cyan-500
          text-cyan-400
          hover:bg-cyan-500/10
        `;

      default:
        return `
          border-pink-500
          text-pink-400
          hover:bg-pink-500/10
        `;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-48">
        <div className="h-12 w-12 rounded-full border-4 border-pink-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div
      className="
        min-h-screen
        bg-black
        text-white
      "
    >
      {/* HEADER */}

      <div
        className="
          border-b
          border-white/10
          bg-[#0f0f0f]
        "
      >
        <div
          className="
            max-w-7xl
            mx-auto
            px-4
            py-6
          "
        >
          <h1
            className="
              text-3xl
              font-black
            "
          >
            Select Your Seats
          </h1>

          <p
            className="
              text-white/50
              mt-2
            "
          >
            {show?.movie?.title}
          </p>
        </div>
      </div>

      {/* SEATS */}

      <div
        className="
          max-w-7xl
          mx-auto
          px-4
          py-10
        "
      >
        <div
          className="
    flex
    flex-wrap
    items-center
    justify-center
    gap-6

    mt-10
    mb-14
  "
        >
          {/* REGULAR */}

          <Legend
            border="border-pink-500"
            text="Regular"
            textColor="text-pink-400"
          />

          {/* VIP */}

          <Legend
            border="border-green-500"
            text="VIP"
            textColor="text-green-400"
          />

          {/* RECLINER */}

          <Legend
            border="border-yellow-500"
            text="Recliner"
            textColor="text-yellow-400"
          />

          {/* COUPLE */}

          <Legend
            border="border-cyan-500"
            text="Couple"
            textColor="text-cyan-400"
          />

          {/* BOOKED */}

          <Legend
            bg="bg-gray-400 opacity-30"
            text="Booked"
            textColor="text-gray-500"
          />

          {/* SELECTED */}

          <Legend bg="bg-pink-600" text="Selected" textColor="text-pink-300" />
        </div>
        {/* SCREEN */}

        <div
          className="
            mb-16
          "
        >
          <div
            className="
              w-full
              h-3

              rounded-full

              bg-gradient-to-r
              from-pink-500
              to-pink-300

              shadow-[0_0_80px_rgba(236,72,153,0.6)]
            "
          />

          <p
            className="
              text-center
              text-white/40
              mt-4
              tracking-[8px]
              text-sm
            "
          >
            SCREEN
          </p>
        </div>

        {/* SEAT LAYOUT */}

        <div
          className="
            overflow-x-auto
            scrollbar-hide
            pb-4
          "
        >
          <div
            className="
              flex
              flex-col
              gap-1.5

              min-w-max
              mx-auto
              w-fit
            "
          >
            {seatLayout.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="
                  flex
                  items-center
                  gap-1.5
                "
              >
                {row.map((seat, colIndex) => {
                  // GAP
                  if (seat === null) {
                    return (
                      <div
                        key={colIndex}
                        className="
                          w-7
                          h-7
                    
                          sm:w-8
                          sm:h-8
                        "
                      />
                    );
                  }

                  return (
                    <button
                      key={colIndex}
                      onClick={() => handleSeatClick(seat, rowIndex, colIndex)}
                      className={`
                        w-7
                        h-7
                    
                        sm:w-8
                        sm:h-8
                    
                        rounded-md
                    
                        border
                    
                        flex
                        items-center
                        justify-center
                    
                        text-[7px]
                        sm:text-[9px]
                    
                        font-semibold
                    
                        transition-all
                        duration-200
                    
                        ${getSeatStyles(seat, rowIndex, colIndex)}
                      `}
                    >
                      {seat.seatNumber}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div
          className="
            mt-14

            bg-[#111]

            border
            border-white/10

            rounded-3xl

            p-6
          "
        >
          <div
            className="
              flex
              flex-col
              md:flex-row

              md:items-center
              md:justify-between

              gap-6
            "
          >
            <div>
              <h2
                className="
                  text-2xl
                  font-bold
                "
              >
                Selected Seats
              </h2>

              <div
                className="
                  flex
                  flex-wrap
                  gap-2
                  mt-4
                "
              >
                {selectedSeats.length === 0 ? (
                  <p className="text-white/40">No seats selected</p>
                ) : (
                  selectedSeats.map((seat) => (
                    <div
                      key={seat.seatNumber}
                      className="
                        px-4
                        py-2

                        rounded-full

                        bg-pink-500/10

                        border
                        border-pink-500/30

                        text-pink-400
                      "
                    >
                      {seat.seatNumber}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div
              className="
                flex
                flex-col
                items-start
                md:items-end
              "
            >
              <h2
                className="
                  text-4xl
                  font-black
                  text-pink-400
                "
              >
                ₹{totalAmount}
              </h2>

              <button
                onClick={handleReserveSeats}
                disabled={selectedSeats.length === 0}
                className="
                  mt-4

                  bg-pink-600

                  hover:bg-pink-500

                  disabled:opacity-50
                  disabled:cursor-not-allowed

                  px-8
                  py-4

                  rounded-2xl

                  font-bold

                  transition-all
                "
              >
                Pay Now
              </button>
            </div>
          </div>
        </div>
      </div>
      {toast && (
        <div
          className={`
            fixed
            top-6
            right-6
          
            z-[9999]
          
            px-6
            py-4
          
            rounded-2xl
          
            shadow-2xl
            backdrop-blur-xl
          
            border
          
            text-white
            font-semibold
          
            animate-[slideIn_.3s_ease]
          
            ${
              toast.type === "error"
                ? `
                  bg-red-500/20
                  border-red-500/40
                  text-red-300
                `
                : `
                  bg-pink-500/20
                  border-pink-500/40
                  text-pink-200
                `
            }
          `}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default SeatBookingPage;
