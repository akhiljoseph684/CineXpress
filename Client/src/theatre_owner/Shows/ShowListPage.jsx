import React, { useEffect, useState } from "react";
import {
  FaClock,
  FaFilm,
  FaTv,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaTimes,
  FaExclamationCircle,
  FaChevronLeft,
  FaChevronRight,
  FaBan,
  FaCheckCircle,
  FaTicketAlt,
  FaExclamationTriangle,
} from "react-icons/fa";
import { cancelShow, getShowsByOwner } from "../../services/showApi";

const ShowListPage = () => {
  const [loading, setLoading] = useState(true);
  const [shows, setShows] = useState([]);
  const [activeFilter, setActiveFilter] = useState("running");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedShowId, setSelectedShowId] = useState(null);
  const [error, setError] = useState("");
  const [cancelError, setCancelError] = useState("");

  useEffect(() => {
    fetchShows(activeFilter, page);
  }, [activeFilter, page]);

  const fetchShows = async (type, pageNo = 1) => {
    try {
      setLoading(true);
      setError("");

      const res = await getShowsByOwner(
        `?type=${type}&page=${pageNo}&limit=12`
      );

      setShows(res.shows || []);
      setTotalPages(Math.max(1, Number(res.totalPages) || 1));
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Unable to load shows. Please try again."
      );
      setShows([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setPage(1);
  };

  const openCancelModal = (showId) => {
    setSelectedShowId(showId);
    setCancelError("");
    setShowCancelModal(true);
  };

  const closeCancelModal = () => {
    if (cancelLoading) return;

    setShowCancelModal(false);
    setSelectedShowId(null);
    setCancelError("");
  };

  const handleCancelShow = async () => {
    if (!selectedShowId) return;

    try {
      setCancelLoading(true);
      setCancelError("");

      const res = await cancelShow(selectedShowId);

      if (!res.success) {
        setCancelError(res.message || "Unable to cancel this show.");
        return;
      }

      setShowCancelModal(false);
      setSelectedShowId(null);

      await fetchShows(activeFilter, page);
    } catch (err) {
      setCancelError(
        err?.response?.data?.message ||
          "Something went wrong while cancelling the show."
      );
    } finally {
      setCancelLoading(false);
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

  const statusStyles = {
    running: "border-green-500/20 bg-green-500/10 text-green-400",
    upcoming: "border-yellow-500/20 bg-yellow-500/10 text-yellow-400",
    ended: "border-white/10 bg-white/5 text-white/50",
  };

  const filters = [
    { value: "running", label: "Running", icon: FaCheckCircle },
    { value: "upcoming", label: "Upcoming", icon: FaCalendarAlt },
    { value: "ended", label: "Ended", icon: FaClock },
  ];

  const selectedShow = shows.find((show) => show._id === selectedShowId);

  return (
    <div className="min-h-screen bg-[#080808] px-4 py-6 text-white sm:px-6 sm:py-8">
      <div className="mx-auto max-w-7xl space-y-7">
        <header className="flex flex-col gap-5 border-b border-white/[0.08] pb-7 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-red-500">
              <FaFilm />
              Theatre Management
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Manage Shows<span className="text-red-500">.</span>
            </h1>

            <p className="mt-2 text-sm leading-6 text-white/45">
              Manage your screenings, review schedules, and control show
              availability.
            </p>
          </div>

          <div className="flex w-fit items-center gap-3 rounded-xl border border-white/[0.08] bg-[#111111] px-4 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
              <FaTicketAlt />
            </div>
            <div>
              <p className="text-xs text-white/40">Current page</p>
              <p className="mt-1 text-sm font-bold">
                {page} <span className="text-white/30">/</span> {totalPages}
              </p>
            </div>
          </div>
        </header>

        <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold">Show Schedule</h2>
            <p className="mt-1 text-xs text-white/40">
              Filter shows by their current status.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => {
              const Icon = filter.icon;
              const isActive = activeFilter === filter.value;

              return (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => handleFilterChange(filter.value)}
                  className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                    isActive
                      ? "border-red-500 bg-red-600 text-white shadow-lg shadow-red-950/20"
                      : "border-white/10 bg-[#111111] text-white/55 hover:border-red-500/40 hover:text-white"
                  }`}
                >
                  <Icon className="text-xs" />
                  {filter.label}
                </button>
              );
            })}
          </div>
        </section>

        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/[0.07] p-4 text-sm text-red-300">
            <FaExclamationCircle className="mt-0.5 shrink-0" />
            <div className="flex-1">{error}</div>
            <button
              type="button"
              onClick={() => fetchShows(activeFilter, page)}
              className="shrink-0 font-semibold text-white underline underline-offset-4 hover:text-red-300"
            >
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-white/[0.07] bg-[#111111] p-4 sm:p-5"
              >
                <div className="flex flex-col gap-5 sm:flex-row">
                  <div className="h-40 w-full rounded-xl bg-white/[0.05] sm:h-32 sm:w-24" />
                  <div className="flex-1 space-y-4 py-1">
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
        ) : shows.length === 0 ? (
          <div className="rounded-2xl border border-white/[0.08] bg-[#111111] px-5 py-16 text-center sm:px-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/15 bg-red-500/[0.07] text-2xl text-red-400">
              <FaFilm />
            </div>

            <h2 className="mt-5 text-xl font-bold">
              No {activeFilter} shows found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/40">
              There are currently no shows available in this category. Try
              selecting another filter or check again later.
            </p>

            <button
              type="button"
              onClick={() => fetchShows(activeFilter, page)}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              <FaClock />
              Refresh Shows
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {shows.map((show) => (
              <article
                key={show._id}
                className="group rounded-2xl border border-white/[0.08] bg-[#111111] p-4 transition duration-200 hover:border-red-500/30 sm:p-5"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
                  <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-xl bg-black sm:h-40 lg:h-32 lg:w-24">
                    {show.movieId?.poster?.card ? (
                      <img
                        src={show.movieId.poster.card}
                        alt={show.movieId?.title || "Movie poster"}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-3xl text-white/20">
                        <FaFilm />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent lg:hidden" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-red-400">
                          Movie Screening
                        </p>
                        <h3 className="mt-1 break-words text-lg font-bold sm:text-xl">
                          {show.movieId?.title || "Movie unavailable"}
                        </h3>
                      </div>

                      <span
                        className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold capitalize ${
                          statusStyles[activeFilter] || statusStyles.ended
                        }`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {activeFilter}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2 xl:grid-cols-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-red-400">
                          <FaTv className="text-xs" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-white/35">Theatre</p>
                          <p className="mt-1 break-words text-sm font-medium text-white/85">
                            {show.theatreId?.name || "Not available"}
                          </p>
                        </div>
                      </div>

                      <div className="flex min-w-0 items-start gap-3">
                        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-red-400">
                          <FaFilm className="text-xs" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-white/35">Screen</p>
                          <p className="mt-1 break-words text-sm font-medium text-white/85">
                            {show.screen?.name || "Not available"}
                          </p>
                        </div>
                      </div>

                      <div className="flex min-w-0 items-start gap-3">
                        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-red-400">
                          <FaMapMarkerAlt className="text-xs" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-white/35">City</p>
                          <p className="mt-1 break-words text-sm font-medium text-white/85">
                            {show.theatreId?.city || "Not available"}
                          </p>
                        </div>
                      </div>

                      <div className="flex min-w-0 items-start gap-3">
                        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-red-400">
                          <FaCalendarAlt className="text-xs" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-white/35">Show Date</p>
                          <p className="mt-1 text-sm font-medium text-white/85">
                            {formatDate(show.showDate)}
                          </p>
                        </div>
                      </div>

                      <div className="flex min-w-0 items-start gap-3">
                        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-red-400">
                          <FaClock className="text-xs" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-white/35">Show Time</p>
                          <p className="mt-1 break-words text-sm font-medium text-white/85">
                            {show.startTime || "--:--"}
                            {" – "}
                            {show.endTime || "--:--"}
                          </p>
                        </div>
                      </div>

                      <div className="flex min-w-0 items-start gap-3">
                        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-red-400">
                          <FaTicketAlt className="text-xs" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-white/35">Show ID</p>
                          <p className="mt-1 break-all font-mono text-xs text-white/60">
                            {show._id}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col gap-3 border-t border-white/[0.07] pt-4 lg:w-40 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
                    <span className="text-xs text-white/35 lg:text-center">
                      Show Actions
                    </span>

                    {activeFilter !== "ended" ? (
                      <button
                        type="button"
                        onClick={() => openCancelModal(show._id)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/[0.07] px-4 py-3 text-sm font-semibold text-red-400 transition hover:border-red-500 hover:bg-red-600 hover:text-white"
                      >
                        <FaBan />
                        Cancel Show
                      </button>
                    ) : (
                      <div className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 text-sm text-white/35">
                        <FaCheckCircle />
                        Show Ended
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {!loading && shows.length > 0 && totalPages > 1 && (
          <div className="flex flex-col items-center justify-between gap-4 border-t border-white/[0.08] pt-6 sm:flex-row">
            <p className="text-xs text-white/40">
              Page <span className="font-semibold text-white">{page}</span> of{" "}
              <span className="font-semibold text-white">{totalPages}</span>
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                className="flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-[#111111] px-4 text-sm font-medium text-white/65 transition hover:border-red-500/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              >
                <FaChevronLeft className="text-xs" />
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1)
                .filter(
                  (pageNumber) =>
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    Math.abs(pageNumber - page) <= 1
                )
                .reduce((result, pageNumber, index, pages) => {
                  if (index > 0 && pageNumber - pages[index - 1] > 1) {
                    result.push("ellipsis-" + pageNumber);
                  }

                  result.push(pageNumber);
                  return result;
                }, [])
                .map((pageNumber) =>
                  typeof pageNumber === "string" ? (
                    <span
                      key={pageNumber}
                      className="px-1 text-white/30"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => setPage(pageNumber)}
                      aria-current={page === pageNumber ? "page" : undefined}
                      className={`h-10 min-w-10 rounded-xl border px-3 text-sm font-semibold transition ${
                        page === pageNumber
                          ? "border-red-500 bg-red-600 text-white"
                          : "border-white/10 bg-[#111111] text-white/55 hover:border-red-500/40 hover:text-white"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  )
                )}

              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() =>
                  setPage((prev) => Math.min(totalPages, prev + 1))
                }
                className="flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-[#111111] px-4 text-sm font-medium text-white/65 transition hover:border-red-500/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              >
                Next
                <FaChevronRight className="text-xs" />
              </button>
            </div>
          </div>
        )}
      </div>

      {showCancelModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closeCancelModal();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-show-title"
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#121212] p-6 shadow-2xl shadow-black/50 sm:p-8"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-xl text-red-400">
              <FaExclamationTriangle />
            </div>

            <h2
              id="cancel-show-title"
              className="mt-5 text-center text-2xl font-black"
            >
              Cancel This Show?
            </h2>

            <p className="mt-3 text-center text-sm leading-6 text-white/45">
              Are you sure you want to cancel this screening? This action may
              affect customers who have booked tickets.
            </p>

            {selectedShow && (
              <div className="mt-5 rounded-xl border border-white/[0.07] bg-black/30 p-4">
                <p className="text-xs text-white/40">Selected screening</p>
                <p className="mt-1 break-words text-sm font-semibold">
                  {selectedShow.movieId?.title || "Movie"}
                </p>
                <p className="mt-2 text-xs text-white/45">
                  {formatDate(selectedShow.showDate)}
                  {" · "}
                  {selectedShow.startTime || "--:--"}
                </p>
              </div>
            )}

            {cancelError && (
              <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/[0.07] p-3 text-sm text-red-300">
                <FaExclamationCircle className="mt-0.5 shrink-0" />
                <p>{cancelError}</p>
              </div>
            )}

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row">
              <button
                type="button"
                onClick={closeCancelModal}
                disabled={cancelLoading}
                className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/[0.07] hover:text-white disabled:opacity-50"
              >
                Keep Show
              </button>

              <button
                type="button"
                onClick={handleCancelShow}
                disabled={cancelLoading}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {cancelLoading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Cancelling...
                  </>
                ) : (
                  <>
                    <FaBan />
                    Confirm Cancel
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowListPage;