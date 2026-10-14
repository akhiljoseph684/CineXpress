import React, { useEffect, useState } from "react";
import {
  FaTicketAlt,
  FaUser,
  FaFilm,
  FaMoneyBillWave,
  FaClock,
  FaSpinner,
  FaCalendarAlt,
  FaExclamationCircle,
  FaRedo,
} from "react-icons/fa";
import { getAllBookings } from "../../services/bookingApi";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    fetchBookings(activeFilter);
  }, [activeFilter]);

  const fetchBookings = async (status) => {
    try {
      setLoading(true);
      setError("");

      const query =
        status !== "all"
          ? `?status=${encodeURIComponent(status)}`
          : "";

      const res = await getAllBookings(query);

      setBookings(res.bookings || []);
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load bookings."
      );
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const filters = [
    { label: "All Bookings", value: "all" },
    { label: "Pending", value: "PENDING" },
    { label: "Confirmed", value: "CONFIRMED" },
    { label: "Cancelled", value: "CANCELLED" },
    { label: "Expired", value: "EXPIRED" },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "PENDING":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "CANCELLED":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      case "EXPIRED":
        return "bg-white/5 text-white/50 border-white/10";
      default:
        return "bg-white/5 text-white/60 border-white/10";
    }
  };

  const formatShowTime = (time) => {
    if (!time) return "N/A";

    const match = time.match(/^(\d{1,2}):(\d{2})/);

    if (!match) return time;

    const hours = Number(match[1]);
    const minutes = Number(match[2]);

    if (hours > 23 || minutes > 59) return time;

    const date = new Date(2000, 0, 1, hours, minutes);

    return date.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="min-h-screen w-full bg-[#080808] text-white px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-11 h-11 rounded-xl bg-red-600/10 border border-red-500/20 flex items-center justify-center">
                <FaTicketAlt className="text-red-500 text-xl" />
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Bookings
              </h1>
            </div>

            <p className="text-white/50 text-sm sm:text-base">
              Manage and monitor all movie ticket bookings.
            </p>
          </div>

          <div className="w-fit flex items-center gap-2 px-4 py-3 rounded-xl bg-red-600/10 border border-red-500/20">
            <FaTicketAlt className="text-red-400" />
            <span className="text-red-400 font-semibold">
              {bookings.length} Bookings
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap mb-8">
          {filters.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setActiveFilter(item.value)}
              className={`px-4 sm:px-5 py-3 rounded-xl border text-sm font-medium transition-colors ${
                activeFilter === item.value
                  ? "bg-red-600 border-red-600 text-white"
                  : "bg-[#111] border-white/10 text-white/60 hover:text-white hover:border-red-500/50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl border border-red-500/20 bg-red-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <FaExclamationCircle className="text-red-400 shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>

            <button
              type="button"
              onClick={() => fetchBookings(activeFilter)}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors"
            >
              <FaRedo />
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <FaSpinner className="text-red-500 text-4xl animate-spin" />
            <p className="text-white/50 text-sm">Loading bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-[#111] border border-white/10 rounded-2xl py-16 px-6 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-600/10 border border-red-500/10 flex items-center justify-center mb-5">
              <FaTicketAlt className="text-red-500 text-3xl" />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold">
              No Bookings Found
            </h2>

            <p className="text-white/50 text-sm mt-2">
              {activeFilter === "all"
                ? "There are no bookings available yet."
                : `There are no ${activeFilter.toLowerCase()} bookings.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-[#111] rounded-2xl overflow-hidden border border-white/10 hover:border-red-500/30 transition-colors duration-200"
              >
                <div className="relative h-56 sm:h-64 bg-black">
                  {booking.show?.movieId?.poster?.card ? (
                    <img
                      src={booking.show.movieId.poster.card}
                      alt={booking.show?.movieId?.title || "Movie poster"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FaFilm className="text-white/20 text-5xl" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                  <span
                    className={`absolute top-4 left-4 px-3 py-2 rounded-lg border text-xs font-semibold ${getStatusStyle(
                      booking.bookingStatus
                    )}`}
                  >
                    {booking.bookingStatus || "UNKNOWN"}
                  </span>

                  <div className="absolute bottom-4 left-4 right-4">
                    <h2 className="text-xl font-bold text-white line-clamp-2">
                      {booking.show?.movieId?.title || "Unknown Movie"}
                    </h2>

                    <p className="text-white/60 text-sm mt-1">
                      {booking.show?.theatreId?.name || "Unknown Theatre"}
                    </p>
                  </div>
                </div>

                <div className="p-5">
                  <div className="space-y-4 text-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-2 text-white/40 shrink-0">
                        <FaUser className="text-red-400" />
                        User
                      </div>

                      <span className="text-white text-right break-words">
                        {booking.user?.name || "N/A"}
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-2 text-white/40 shrink-0">
                        <FaFilm className="text-red-400" />
                        Theatre
                      </div>

                      <span className="text-white text-right break-words">
                        {booking.show?.theatreId?.name || "N/A"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2 text-white/40">
                        <FaTicketAlt className="text-red-400" />
                        Seats
                      </div>

                      <span className="text-white font-medium">
                        {booking.totalSeats ?? 0}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2 text-white/40">
                        <FaMoneyBillWave className="text-red-400" />
                        Amount
                      </div>

                      <span className="text-white font-semibold">
                        ₹{Number(booking.totalAmount || 0).toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2 text-white/40">
                        <FaClock className="text-red-400" />
                        Show Time
                      </div>

                      <span className="text-white">
                        {formatShowTime(booking.show?.startTime)}
                      </span>
                    </div>

                    {booking.show?.showDate && (
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-white/40">
                          <FaCalendarAlt className="text-red-400" />
                          Show Date
                        </div>

                        <span className="text-white">
                          {booking.show.showDate}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                    <span className="text-white/30 text-xs">Booking ID</span>
                    <span className="text-white/50 text-xs font-mono break-all text-right">
                      {booking._id}
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
}

export default Bookings;