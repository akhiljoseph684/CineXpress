import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTv,
  FaSpinner,
  FaTrash,
  FaPen,
  FaMapMarkerAlt,
  FaChair,
  FaExclamationCircle,
  FaRedo,
} from "react-icons/fa";
import { deleteScreen, getAllScreens } from "../../../services/screensApi";

const ScreenList = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [screens, setScreens] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchScreens();
  }, []);

  const fetchScreens = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getAllScreens();
      setScreens(res.screens || []);
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load screens."
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteHandler = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this screen?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");

      await deleteScreen(id);

      setScreens((prevScreens) =>
        prevScreens.filter((screen) => screen._id !== id)
      );
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to delete screen."
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080808] text-white flex flex-col items-center justify-center gap-4">
        <FaSpinner className="text-red-500 text-4xl animate-spin" />
        <p className="text-white/50 text-sm">Loading screens...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] text-white px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-11 h-11 rounded-xl bg-red-600/10 border border-red-500/20 flex items-center justify-center">
                <FaTv className="text-red-500 text-xl" />
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                All Screens
              </h1>
            </div>

            <p className="text-white/50 text-sm sm:text-base">
              Manage and organize all theatre screens.
            </p>
          </div>

          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-600/10 border border-red-500/20 w-fit">
            <FaTv className="text-red-400" />
            <span className="text-red-400 font-semibold">
              {screens.length} Screens
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl border border-red-500/20 bg-red-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <FaExclamationCircle className="text-red-400 shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>

            <button
              type="button"
              onClick={fetchScreens}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors"
            >
              <FaRedo />
              Retry
            </button>
          </div>
        )}

        {screens.length === 0 ? (
          <div className="bg-[#111] border border-white/10 rounded-2xl p-8 sm:p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-red-600/10 flex items-center justify-center">
              <FaTv className="text-red-500 text-3xl" />
            </div>

            <h2 className="text-xl sm:text-2xl font-semibold">
              No Screens Found
            </h2>

            <p className="text-white/50 mt-2 text-sm">
              No theatre screens are available yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {screens.map((screen) => (
              <div
                key={screen._id}
                className="bg-[#111] border border-white/10 rounded-2xl p-5 sm:p-6 flex flex-col justify-between hover:border-red-500/30 transition-colors duration-200"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="text-xl font-bold text-white break-words">
                        {screen.name}
                      </h2>

                      <p className="text-white/50 text-sm mt-1">
                        {screen.screenType || "Standard"}
                      </p>
                    </div>

                    <div className="shrink-0 px-3 py-1.5 rounded-lg bg-red-600/10 border border-red-500/20 text-red-400 text-sm font-medium flex items-center gap-2">
                      <FaChair className="text-xs" />
                      {screen.totalSeats ?? 0} Seats
                    </div>
                  </div>

                  <div className="mt-6 p-4 rounded-xl bg-black/40 border border-white/5">
                    <p className="text-white/40 text-xs uppercase tracking-wider mb-2">
                      Theatre
                    </p>

                    <h3 className="text-base font-semibold text-white">
                      {screen.theatre?.name || "Unknown Theatre"}
                    </h3>

                    <p className="text-white/50 text-sm mt-2 flex items-center gap-2">
                      <FaMapMarkerAlt className="text-red-400 shrink-0" />
                      {screen.theatre?.location?.city || "No Location"}
                    </p>
                  </div>

                  <div className="mt-5">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3">
                      Ticket Prices
                    </h3>

                    {Object.keys(screen.prices || {}).length === 0 ? (
                      <p className="text-white/40 text-sm">
                        No ticket prices configured.
                      </p>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        {Object.entries(screen.prices || {}).map(
                          ([type, price]) => (
                            <div
                              key={type}
                              className="bg-black/40 border border-white/5 rounded-xl p-3"
                            >
                              <p className="text-white/50 text-sm capitalize">
                                {type}
                              </p>

                              <h3 className="text-lg font-bold text-white mt-1">
                                ₹{price}
                              </h3>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <div className="min-w-0">
                      <p className="text-white/40 text-xs uppercase tracking-wider mb-1">
                        Owner
                      </p>

                      <h4 className="font-medium text-white truncate">
                        {screen.owner?.name || "N/A"}
                      </h4>
                    </div>

                    <span className="shrink-0 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium">
                      Active
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <button
                      type="button"
                      onClick={() => deleteHandler(screen._id)}
                      disabled={deletingId === screen._id}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600/10 border border-red-500/20 hover:bg-red-600 hover:border-red-600 text-red-400 hover:text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deletingId === screen._id ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        <FaTrash className="text-xs" />
                      )}
                      {deletingId === screen._id ? "Deleting..." : "Delete"}
                    </button>
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

export default ScreenList;
