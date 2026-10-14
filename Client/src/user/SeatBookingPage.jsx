import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaCreditCard,
  FaTicketAlt,
} from "react-icons/fa";
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
  const navigate = useNavigate();

  const [toast, setToast] = useState(null);
  const [show, setShow] = useState(null);
  const [seatLayout, setSeatLayout] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (showId) {
      fetchShow();
    }
  }, [showId]);

  useEffect(() => {
    if (!toast) return undefined;

    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const fetchShow = async () => {
    try {
      setLoading(true);

      const res = await getShowById(showId);
      const currentShow = res.show;

      setShow(currentShow);
      setSeatLayout(currentShow?.screenId?.seatLayout || []);
      setBookedSeats(res.bookedSeats || []);
      setSelectedSeats([]);
    } catch (error) {
      console.error(error);
      showToast(
        error?.response?.data?.message || "Failed to load show details.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const isBooked = (rowIndex, colIndex) => {
    return bookedSeats.some(
      (seat) => seat.row === rowIndex && seat.col === colIndex
    );
  };

  const isSelected = (rowIndex, colIndex) => {
    return selectedSeats.some(
      (seat) => seat.row === rowIndex && seat.col === colIndex
    );
  };

  const handleSeatClick = (seat, rowIndex, colIndex) => {
    if (isBooked(rowIndex, colIndex) || paymentLoading) return;

    if (isSelected(rowIndex, colIndex)) {
      setSelectedSeats((prev) =>
        prev.filter(
          (item) => !(item.row === rowIndex && item.col === colIndex)
        )
      );
      return;
    }

    const price = show?.screenId?.prices?.[seat.type];

    if (price == null) {
      showToast("Price is unavailable for this seat type.", "error");
      return;
    }

    setSelectedSeats((prev) => [
      ...prev,
      {
        seatNumber: seat.seatNumber,
        row: rowIndex,
        col: colIndex,
        type: seat.type,
        price,
      },
    ]);
  };

  const totalAmount = useMemo(() => {
    return selectedSeats.reduce((acc, seat) => acc + seat.price, 0);
  }, [selectedSeats]);

  const handleReserveSeats = async () => {
    if (selectedSeats.length === 0 || paymentLoading) return;

    if (!window.Razorpay) {
      showToast("Payment service is unavailable. Please try again.", "error");
      return;
    }

    let bookingId = null;
    let paymentWindowOpened = false;

    try {
      setPaymentLoading(true);

      const bookingRes = await reserveSeats({
        showId,
        seats: selectedSeats,
        totalAmount,
      });

      const booking = bookingRes.booking;

      if (!booking?._id) {
        throw new Error("Unable to create booking.");
      }

      bookingId = booking._id;

      const orderRes = await createPaymentOrder({ bookingId });
      const order = orderRes.order;

      if (!order?.id) {
        throw new Error("Unable to create payment order.");
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "CineXpress",
        description: "Movie Ticket Booking",
        order_id: order.id,
        theme: {
          color: "#dc2626",
        },
        handler: async (response) => {
          try {
            await verifyPayment({
              bookingId: booking._id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            showToast("Payment successful!");
            navigate(`/booking-success/${booking._id}`);
          } catch (error) {
            console.error(error);
            showToast(
              error?.response?.data?.message ||
                "Payment verification failed. Please contact support.",
              "error"
            );
          } finally {
            setPaymentLoading(false);
          }
        },
        modal: {
          ondismiss: async () => {
            try {
              await paymentFailed({ bookingId: booking._id });
            } catch (error) {
              console.error(error);
            } finally {
              setPaymentLoading(false);
              showToast("Payment cancelled.", "error");
              navigate(`/shows/movie/${show?.movieId?._id}`);
            }
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", async (response) => {
        try {
          await paymentFailed({ bookingId: booking._id });
        } catch (error) {
          console.error(error);
        }

        setPaymentLoading(false);
        showToast(
          response?.error?.description || "Payment failed.",
          "error"
        );
      });

      razorpay.open();
      paymentWindowOpened = true;
    } catch (error) {
      console.error(error);

      showToast(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to start payment.",
        "error"
      );

      setPaymentLoading(false);
    } finally {
      if (!paymentWindowOpened) {
        setPaymentLoading(false);
      }
    }
  };

  const getSeatStyles = (seat, rowIndex, colIndex) => {
    if (isBooked(rowIndex, colIndex)) {
      return "cursor-not-allowed border-gray-400 bg-gray-400/40 text-gray-500 opacity-30";
    }

    const type = seat.type?.toLowerCase();
    const selected = isSelected(rowIndex, colIndex);

    if (selected) {
      switch (type) {
        case "recliner":
          return "border-yellow-500 bg-yellow-500 text-black";
        case "vip":
          return "border-green-500 bg-green-500 text-black";
        case "couple":
          return "border-cyan-500 bg-cyan-500 text-black";
        default:
          return "border-red-500 bg-red-600 text-white shadow-lg shadow-red-600/30";
      }
    }

    switch (type) {
      case "recliner":
        return "border-yellow-500/70 text-yellow-400 hover:bg-yellow-500/15";
      case "vip":
        return "border-green-500/70 text-green-400 hover:bg-green-500/15";
      case "couple":
        return "border-cyan-500/70 text-cyan-400 hover:bg-cyan-500/15";
      default:
        return "border-red-500/60 text-red-400 hover:bg-red-600/15 hover:border-red-500";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-800 border-t-red-600" />
          <p className="text-sm text-gray-400">Loading seat layout...</p>
        </div>
      </div>
    );
  }

  if (!show) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-black px-4 text-center text-white">
        <FaTicketAlt className="text-5xl text-red-500" />
        <h2 className="text-2xl font-bold">Show not found</h2>
        <button
          onClick={() => navigate(-1)}
          className="rounded-xl bg-red-600 px-6 py-3 font-semibold transition hover:bg-red-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="border-b border-gray-800 bg-[#0f0f0f]">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(-1)}
            className="mb-5 flex items-center gap-2 text-sm text-gray-400 transition hover:text-red-500"
          >
            <FaArrowLeft />
            Back
          </button>

          <p className="mb-2 text-xs font-semibold uppercase tracking-[3px] text-red-500">
            CineXpress Booking
          </p>

          <h1 className="text-3xl font-black sm:text-4xl">
            Select Your <span className="text-red-500">Seats</span>
          </h1>

          <p className="mt-2 text-gray-400">
            {show.movie?.title || show.movieId?.title || "Movie"}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-10 flex flex-wrap items-center justify-center gap-5 sm:gap-6">
          <Legend
            border="border-red-500"
            text="Regular"
            textColor="text-red-400"
          />
          <Legend
            border="border-green-500"
            text="VIP"
            textColor="text-green-400"
          />
          <Legend
            border="border-yellow-500"
            text="Recliner"
            textColor="text-yellow-400"
          />
          <Legend
            border="border-cyan-500"
            text="Couple"
            textColor="text-cyan-400"
          />
          <Legend
            bg="bg-gray-400 opacity-50"
            text="Booked"
            textColor="text-gray-500"
          />
          <Legend
            bg="bg-red-600"
            text="Selected"
            textColor="text-red-300"
          />
        </div>

        <div className="mb-14">
          <div className="h-2 w-full rounded-full bg-gradient-to-r from-red-700 via-red-500 to-red-700 shadow-[0_0_45px_rgba(220,38,38,0.25)]" />
          <p className="mt-4 text-center text-xs tracking-[8px] text-gray-500 sm:text-sm">
            SCREEN
          </p>
        </div>

        <div className="scrollbar-hide overflow-x-auto pb-5">
          <div className="mx-auto flex w-fit min-w-max flex-col gap-2">
            {seatLayout.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="flex items-center justify-center gap-1.5 sm:gap-2"
              >
                {row.map((seat, colIndex) => {
                  if (seat === null) {
                    return (
                      <div
                        key={colIndex}
                        className="h-7 w-7 sm:h-8 sm:w-8"
                      />
                    );
                  }

                  return (
                    <button
                      key={colIndex}
                      type="button"
                      disabled={isBooked(rowIndex, colIndex) || paymentLoading}
                      aria-label={`Seat ${seat.seatNumber}${
                        isBooked(rowIndex, colIndex)
                          ? ", booked"
                          : isSelected(rowIndex, colIndex)
                            ? ", selected"
                            : ""
                      }`}
                      aria-pressed={isSelected(rowIndex, colIndex)}
                      onClick={() =>
                        handleSeatClick(seat, rowIndex, colIndex)
                      }
                      className={`flex h-7 w-7 items-center justify-center rounded-md border text-[7px] font-semibold transition duration-200 sm:h-8 sm:w-8 sm:text-[9px] ${getSeatStyles(
                        seat,
                        rowIndex,
                        colIndex
                      )}`}
                    >
                      {seat.seatNumber}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 rounded-3xl border border-gray-800 bg-[#111111] p-5 sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold">Selected Seats</h2>

              <div className="mt-4 flex flex-wrap gap-2">
                {selectedSeats.length === 0 ? (
                  <p className="text-gray-500">No seats selected</p>
                ) : (
                  selectedSeats.map((seat) => (
                    <span
                      key={seat.seatNumber}
                      className="rounded-full border border-red-500/30 bg-red-600/10 px-4 py-2 text-sm font-medium text-red-400"
                    >
                      {seat.seatNumber}
                    </span>
                  ))
                )}
              </div>

              {selectedSeats.length > 0 && (
                <p className="mt-4 text-sm text-gray-500">
                  {selectedSeats.length} seat
                  {selectedSeats.length !== 1 ? "s" : ""} selected
                </p>
              )}
            </div>

            <div className="flex flex-col items-start md:items-end">
              <p className="text-sm text-gray-400">Total Amount</p>
              <h2 className="mt-1 text-4xl font-black text-red-500">
                ₹{totalAmount.toLocaleString("en-IN")}
              </h2>

              <button
                onClick={handleReserveSeats}
                disabled={selectedSeats.length === 0 || paymentLoading}
                className="mt-4 flex items-center justify-center gap-3 rounded-2xl bg-red-600 px-8 py-4 font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FaCreditCard />
                {paymentLoading ? "Processing..." : "Pay Now"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <div
          role="status"
          className={`fixed right-4 top-5 z-[9999] flex max-w-[calc(100%-2rem)] items-center gap-3 rounded-2xl border px-5 py-4 font-semibold shadow-2xl sm:right-6 sm:top-6 ${
            toast.type === "error"
              ? "border-red-500/40 bg-[#260b0b] text-red-300"
              : "border-green-500/30 bg-[#0b2115] text-green-300"
          }`}
        >
          {toast.type === "error" ? (
            <FaTicketAlt className="shrink-0" />
          ) : (
            <FaCheckCircle className="shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default SeatBookingPage;