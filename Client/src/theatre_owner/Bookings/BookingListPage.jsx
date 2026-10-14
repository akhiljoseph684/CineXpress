import React, { useEffect, useState } from "react";
import {
  FaTicketAlt,
  FaUser,
  FaMoneyBillWave,
  FaClock,
  FaFilm,
  FaTv,
  FaCalendarAlt,
  FaCheckCircle,
  FaExclamationCircle,
  FaQrcode,
  FaSyncAlt,
} from "react-icons/fa";
import { getBookingsByOwner } from "../../services/bookingApi";

const BookingListPage = () => {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getBookingsByOwner();
      setBookings(res.bookings || []);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Unable to load bookings. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Not available";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not available";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getBookingStatus = (booking) => {
    if (booking.bookingStatus === "CONFIRMED" && booking.isScanned) {
      return {
        label: "USED",
        classes: "border-blue-500/20 bg-blue-500/10 text-blue-400",
        icon: FaQrcode,
      };
    }

    if (booking.bookingStatus === "CONFIRMED") {
      return {
        label: "CONFIRMED",
        classes: "border-green-500/20 bg-green-500/10 text-green-400",
        icon: FaCheckCircle,
      };
    }

    return {
      label: booking.bookingStatus || "UNKNOWN",
      classes: "border-red-500/20 bg-red-500/10 text-red-400",
      icon: FaExclamationCircle,
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080808] px-4 py-8 text-white sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 animate-pulse">
            <div className="h-3 w-48 rounded bg-white/[0.06]" />
            <div className="mt-4 h-9 w-64 rounded bg-white/[0.07]" />
            <div className="mt-3 h-4 w-72 max-w-full rounded bg-white/[0.05]" />
          </div>

          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-white/[0.08] bg-[#111111] p-5"
              >
                <div className="flex flex-col gap-5 sm:flex-row">
                  <div className="h-40 w-full rounded-xl bg-white/[0.05] sm:h-32 sm:w-24" />
                  <div className="flex-1 space-y-4">
                    <div className="h-4 w-1/3 rounded bg-white/[0.06]" />
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                      {[1, 2, 3, 4, 5, 6].map((field) => (
                        <div
                          key={field}
                          className="h-10 rounded-lg bg-white/[0.04]"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] px-4 py-6 text-white sm:px-6 sm:py-8">
      <div className="mx-auto max-w-7xl space-y-7">
        <header className="flex flex-col gap-5 border-b border-white/[0.08] pb-7 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-red-500">
              <FaTicketAlt />
              Theatre Management
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Bookings<span className="text-red-500">.</span>
            </h1>

            <p className="mt-2 text-sm leading-6 text-white/45">
              Monitor customer reservations, ticket usage, and booking
              payments.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchBookings}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-sm font-semibold text-white/70 transition hover:border-red-500/40 hover:text-white sm:self-center"
          >
            <FaSyncAlt />
            Refresh Bookings
          </button>
        </header>

        {error && (
          <div className="flex flex-col gap-3 rounded-xl border border-red-500/20 bg-red-500/[0.07] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3 text-sm text-red-300">
              <FaExclamationCircle className="mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>

            <button
              type="button"
              onClick={fetchBookings}
              className="self-start text-sm font-semibold text-white underline underline-offset-4 hover:text-red-300 sm:self-center"
            >
              Try again
            </button>
          </div>
        )}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-2xl border border-white/[0.08] bg-[#111111] p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-white/45">Total Bookings</p>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                <FaTicketAlt />
              </div>
            </div>
            <h2 className="mt-4 text-3xl font-black tabular-nums">
              {bookings.length}
            </h2>
            <p className="mt-2 text-xs text-white/35">
              Bookings returned by your API
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#111111] p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-white/45">Confirmed</p>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 text-green-400">
                <FaCheckCircle />
              </div>
            </div>
            <h2 className="mt-4 text-3xl font-black tabular-nums">
              {
                bookings.filter(
                  (booking) => booking.bookingStatus === "CONFIRMED"
                ).length
              }
            </h2>
            <p className="mt-2 text-xs text-white/35">
              Successfully confirmed bookings
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#111111] p-5 sm:col-span-2 xl:col-span-1">
            <div className="flex items-center justify-between">
              <p className="text-sm text-white/45">Ticket Revenue</p>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                <FaMoneyBillWave />
              </div>
            </div>
            <h2 className="mt-4 break-words text-3xl font-black tabular-nums">
              ₹
              {bookings
                .filter(
                  (booking) => booking.bookingStatus === "CONFIRMED"
                )
                .reduce(
                  (total, booking) =>
                    total + (Number(booking.totalAmount) || 0),
                  0
                )
                .toLocaleString("en-IN")}
            </h2>
            <p className="mt-2 text-xs text-white/35">
              Total amount from confirmed bookings
            </p>
          </div>
        </section>

        <section>
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-bold">All Bookings</h2>
              <p className="mt-1 text-xs text-white/40">
                Customer and screening details for each reservation.
              </p>
            </div>

            <span className="w-fit rounded-full border border-white/10 bg-[#111111] px-3 py-1.5 text-xs font-medium text-white/55">
              {bookings.length}{" "}
              {bookings.length === 1 ? "booking" : "bookings"}
            </span>
          </div>

          {bookings.length === 0 ? (
            <div className="rounded-2xl border border-white/[0.08] bg-[#111111] px-5 py-16 text-center sm:px-10">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/15 bg-red-500/[0.07] text-2xl text-red-400">
                <FaTicketAlt />
              </div>

              <h3 className="mt-5 text-xl font-bold">No Bookings Found</h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/40">
                No customer bookings are available yet. New reservations will
                appear here when customers book tickets.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => {
                const status = getBookingStatus(booking);
                const StatusIcon = status.icon;

                return (
                  <article
                    key={booking._id}
                    className="group rounded-2xl border border-white/[0.08] bg-[#111111] p-4 transition duration-200 hover:border-red-500/30 sm:p-5"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
                      <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-xl bg-black sm:h-40 lg:h-32 lg:w-24">
                        {booking.movie?.poster?.card ? (
                          <img
                            src={booking.movie.poster.card}
                            alt={booking.movie?.title || "Movie poster"}
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-3xl text-white/20">
                            <FaFilm />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-red-400">
                              Movie Booking
                            </p>
                            <h3 className="mt-1 break-words text-lg font-bold sm:text-xl">
                              {booking.movie?.title || "Movie unavailable"}
                            </h3>
                            <p className="mt-1 break-all font-mono text-[11px] text-white/30">
                              Booking ID: {booking._id}
                            </p>
                          </div>

                          <span
                            className={`inline-flex w-fit shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-bold tracking-wide ${status.classes}`}
                          >
                            <StatusIcon className="text-xs" />
                            {status.label}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2 xl:grid-cols-3">
                          <div className="flex min-w-0 items-start gap-3">
                            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-red-400">
                              <FaUser className="text-xs" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs text-white/35">
                                Customer
                              </p>
                              <p className="mt-1 break-words text-sm font-medium text-white/85">
                                {booking.user?.name || "Not available"}
                              </p>
                            </div>
                          </div>

                          <div className="flex min-w-0 items-start gap-3">
                            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-red-400">
                              <FaTv className="text-xs" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs text-white/35">Screen</p>
                              <p className="mt-1 break-words text-sm font-medium text-white/85">
                                {booking.screen?.name || "Not available"}
                              </p>
                            </div>
                          </div>

                          <div className="flex min-w-0 items-start gap-3">
                            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-red-400">
                              <FaCalendarAlt className="text-xs" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs text-white/35">Date</p>
                              <p className="mt-1 text-sm font-medium text-white/85">
                                {formatDate(booking.show?.showDate)}
                              </p>
                            </div>
                          </div>

                          <div className="flex min-w-0 items-start gap-3">
                            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-red-400">
                              <FaClock className="text-xs" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs text-white/35">Show Time</p>
                              <p className="mt-1 text-sm font-medium text-white/85">
                                {booking.show?.startTime || "Not available"}
                              </p>
                            </div>
                          </div>

                          <div className="flex min-w-0 items-start gap-3">
                            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-red-400">
                              <FaTicketAlt className="text-xs" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs text-white/35">
                                Total Seats
                              </p>
                              <p className="mt-1 text-sm font-medium text-white/85">
                                {booking.totalSeats ?? 0}
                              </p>
                            </div>
                          </div>

                          <div className="flex min-w-0 items-start gap-3">
                            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-500/[0.08] text-green-400">
                              <FaMoneyBillWave className="text-xs" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs text-white/35">
                                Booking Amount
                              </p>
                              <p className="mt-1 text-base font-bold text-green-400">
                                ₹
                                {(
                                  Number(booking.totalAmount) || 0
                                ).toLocaleString("en-IN")}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default BookingListPage;