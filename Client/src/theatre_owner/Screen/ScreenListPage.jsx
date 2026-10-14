import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBuilding,
  FaDesktop,
  FaFilm,
  FaTicketAlt,
  FaMapMarkerAlt,
  FaTrash,
  FaEdit,
  FaPlus,
  FaTimes,
  FaExclamationTriangle,
  FaSpinner,
  FaChair,
} from "react-icons/fa";
import { FaIndianRupeeSign } from "react-icons/fa6";
import {
  deleteScreen,
  getScreensByOwner,
} from "../../services/screensApi";

const ScreenListPage = () => {
  const [loading, setLoading] = useState(true);
  const [screens, setScreens] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedScreenId, setSelectedScreenId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const fetchScreens = async () => {
    try {
      setError("");
      const res = await getScreensByOwner();
      setScreens(res.screens || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load screens. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScreens();
  }, []);

  const deleteHandler = async () => {
    if (!selectedScreenId || deleting) return;

    try {
      setDeleting(true);
      await deleteScreen(selectedScreenId);

      setScreens((prev) =>
        prev.filter((screen) => screen._id !== selectedScreenId)
      );

      setShowDeleteModal(false);
      setSelectedScreenId(null);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "Unable to delete this screen. Please try again."
      );
    } finally {
      setDeleting(false);
    }
  };

  const selectedScreen = screens.find(
    (screen) => screen._id === selectedScreenId
  );

  if (loading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-white">
        <FaSpinner className="animate-spin text-3xl text-red-500" />
        <p className="text-sm text-gray-400">Loading theatre screens...</p>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#080808] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-red-500">
              <FaDesktop />
              Theatre management
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Screens<span className="text-red-500">.</span>
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              Manage your screens, seat capacity, and ticket pricing.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start rounded-xl border border-white/[0.08] bg-[#111111] px-4 py-3 sm:self-auto">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600/10 text-red-500">
              <FaDesktop />
            </div>
            <div>
              <p className="text-xl font-bold">
                {screens.length.toString().padStart(2, "0")}
              </p>
              <p className="text-xs text-gray-500">Total screens</p>
            </div>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 flex items-start justify-between gap-3 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm text-red-400"
          >
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss error"
              className="shrink-0 hover:text-white"
            >
              <FaTimes />
            </button>
          </div>
        )}

        {screens.length === 0 ? (
          <div className="rounded-3xl border border-white/[0.08] bg-[#111111] px-6 py-16 text-center sm:px-10">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/20 bg-red-600/10 text-2xl text-red-500">
              <FaDesktop />
            </div>

            <h2 className="text-2xl font-bold">No Screens Found</h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-400">
              Your theatre doesn't have any screens yet. Add your first screen
              to start managing your movie shows.
            </p>

            <Link
              to="/theatre-owner/theatre"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              <FaPlus />
              Manage Theatre
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {screens.map((screen) => (
              <div
                key={screen._id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111111] transition-all duration-300 hover:-translate-y-1 hover:border-red-500/30 hover:bg-[#141414]"
              >
                <div className="relative overflow-hidden border-b border-white/[0.06] bg-gradient-to-br from-red-950/40 via-[#171111] to-[#101010] p-5">
                  <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-red-600/[0.06] blur-2xl transition group-hover:bg-red-600/[0.12]" />

                  <div className="relative flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-red-500/20 bg-red-600/10 text-xl text-red-500">
                        <FaFilm />
                      </div>

                      <div className="min-w-0">
                        <h2 className="truncate text-xl font-bold">
                          {screen.name}
                        </h2>
                        <p className="mt-1 text-xs text-gray-400">
                          {screen.screenType || "Standard Screen"}
                        </p>
                      </div>
                    </div>

                    <span className="shrink-0 rounded-full border border-red-500/20 bg-red-600/10 px-3 py-1.5 text-xs font-semibold text-red-400">
                      {screen.totalSeats || 0} Seats
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-5">
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500">
                      Theatre information
                    </p>

                    <div className="flex items-start gap-3">
                      <FaBuilding className="mt-1 shrink-0 text-sm text-red-500" />

                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold text-gray-200">
                          {screen.theatre?.name || "Theatre not available"}
                        </h3>

                        <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
                          <FaMapMarkerAlt className="shrink-0" />
                          {screen.theatre?.location?.city || "Location unavailable"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-5">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500">
                        Ticket pricing
                      </p>
                      <FaIndianRupeeSign className="text-xs text-red-500" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(screen.prices || {}).map(
                        ([type, priceData]) => {
                          const price =
                            typeof priceData === "object"
                              ? priceData?.price
                              : priceData;

                          return (
                            <div
                              key={type}
                              className="rounded-xl border border-white/[0.06] bg-black/30 p-3 transition hover:border-red-500/20"
                            >
                              <p className="truncate text-xs capitalize text-gray-500">
                                {type}
                              </p>

                              <p className="mt-1.5 text-lg font-bold text-white">
                                ₹
                                {Number(price || 0).toLocaleString("en-IN")}
                              </p>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>

                  <div className="mt-auto space-y-3 border-t border-white/[0.06] pt-5">
                    <Link
                      to={`/theatre-owner/shows/create/${screen._id}`}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-red-950/20 transition hover:bg-red-700"
                    >
                      <FaPlus />
                      Create Show
                    </Link>

                    <div className="grid grid-cols-2 gap-3">
                      <Link
                        to={`/theatre-owner/screens/edit/${screen._id}`}
                        className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 text-sm font-semibold text-gray-300 transition hover:border-red-500/30 hover:bg-red-600/10 hover:text-red-400"
                      >
                        <FaEdit />
                        Edit
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedScreenId(screen._id);
                          setShowDeleteModal(true);
                        }}
                        className="flex items-center justify-center gap-2 rounded-xl border border-red-500/15 bg-red-600/[0.06] px-3 py-3 text-sm font-semibold text-red-400 transition hover:border-red-500/40 hover:bg-red-600/15"
                      >
                        <FaTrash />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm"
          onClick={() => {
            if (!deleting) {
              setShowDeleteModal(false);
              setSelectedScreenId(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-screen-title"
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111111] p-6 shadow-2xl shadow-black/50 sm:p-7"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-red-500/20 bg-red-600/10 text-xl text-red-500">
              <FaExclamationTriangle />
            </div>

            <h2
              id="delete-screen-title"
              className="text-2xl font-bold text-white"
            >
              Delete Screen?
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-400">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-white">
                {selectedScreen?.name || "this screen"}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-7 grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedScreenId(null);
                }}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-gray-300 transition hover:bg-white/[0.08] disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={deleteHandler}
                className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <FaTrash />
                    Yes, Delete
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

export default ScreenListPage;