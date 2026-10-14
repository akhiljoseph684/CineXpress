import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBuilding,
  FaMapMarkerAlt,
  FaPlus,
  FaImages,
  FaSpinner,
  FaExclamationCircle,
  FaRedo,
} from "react-icons/fa";
import { getTheatreByOwner } from "../../services/theatreApi";

function TheatreListPage() {
  const navigate = useNavigate();

  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTheatres = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getTheatreByOwner();
      setTheatres(res.theatres || []);
    } catch (error) {
      setTheatres([]);
      setError(error?.message || "Failed to load theatres. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTheatres();
  }, []);

  return (
    <div className="min-h-full space-y-8 bg-[#080808] p-4 text-white sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-xl text-red-400">
              <FaBuilding />
            </div>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              My Theatres
            </h1>
          </div>

          <p className="max-w-xl text-sm leading-6 text-gray-400">
            Manage your cinema theatres, screens, locations, and gallery.
          </p>
        </div>

        {!loading && theatres.length > 0 && (
          <div className="flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-[#111] px-4 py-3">
            <FaBuilding className="text-red-400" />
            <span className="text-sm font-medium text-gray-300">
              {theatres.length} {theatres.length === 1 ? "Theatre" : "Theatres"}
            </span>
          </div>
        )}
      </div>

      {error && (
        <div className="flex flex-col gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3 text-sm text-red-400">
            <FaExclamationCircle className="mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>

          <button
            type="button"
            onClick={fetchTheatres}
            disabled={loading}
            className="flex w-fit items-center gap-2 rounded-lg border border-red-500/30 px-3 py-2 text-sm text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
          >
            <FaRedo />
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#111] py-24">
          <FaSpinner className="mb-4 animate-spin text-3xl text-red-500" />
          <p className="text-sm text-gray-400">Loading your theatres...</p>
        </div>
      ) : theatres.length === 0 && !error ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-[#111] px-5 py-16 text-center sm:py-20">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-2xl text-red-400">
            <FaBuilding />
          </div>

          <h2 className="text-xl font-semibold sm:text-2xl">
            No Theatres Found
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-400">
            You haven't added any theatres yet. Once a theatre is created, it
            will appear here for you to manage.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {theatres.map((theatre) => (
            <div
              key={theatre._id}
              className="group min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-[#111] transition duration-300 hover:border-red-500/40 hover:shadow-xl hover:shadow-red-950/10"
            >
              <div className="relative h-56 overflow-hidden bg-[#181818] sm:h-64">
                {theatre.bannerImage ? (
                  <img
                    src={theatre.bannerImage}
                    alt={`${theatre.name} banner`}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <FaBuilding className="text-5xl text-gray-700" />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                <div className="absolute left-4 top-4">
                  <span
                    className={`rounded-lg border px-3 py-1.5 text-xs font-semibold capitalize ${
                      theatre.status === "approved"
                        ? "border-green-500/30 bg-green-500/15 text-green-400"
                        : theatre.status === "rejected"
                          ? "border-red-500/30 bg-red-500/15 text-red-400"
                          : "border-yellow-500/30 bg-yellow-500/15 text-yellow-400"
                    }`}
                  >
                    {theatre.status || "Pending"}
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                  <h2 className="line-clamp-2 text-2xl font-bold text-white sm:text-3xl">
                    {theatre.name}
                  </h2>

                  <p className="mt-2 flex items-center gap-2 text-sm text-gray-300">
                    <FaMapMarkerAlt className="shrink-0 text-red-400" />
                    {theatre.city || "Location not specified"}
                  </p>
                </div>
              </div>

              <div className="space-y-5 p-4 sm:p-6">
                <div>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Theatre Address
                  </h3>

                  <p className="break-words text-sm leading-6 text-gray-300">
                    {theatre.address || "No address provided"}
                  </p>
                </div>

                {theatre.gallery?.length > 0 && (
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-white">
                        Gallery
                      </h3>

                      <span className="flex items-center gap-1.5 text-xs text-gray-500">
                        <FaImages />
                        {theatre.gallery.length} Photos
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {theatre.gallery.map((img, index) => (
                        <div
                          key={`${theatre._id}-gallery-${index}`}
                          className="overflow-hidden rounded-xl border border-white/10 bg-[#080808]"
                        >
                          <img
                            src={img}
                            alt={`${theatre.name} gallery ${index + 1}`}
                            loading="lazy"
                            className="h-24 w-full object-cover transition duration-300 hover:scale-105 sm:h-28"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t border-white/10 pt-5">
                  {theatre.status === "approved" ? (
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/theatre-owner/screens/create/${theatre._id}`
                        )
                      }
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 sm:w-fit"
                    >
                      <FaPlus />
                      Add Screens
                    </button>
                  ) : (
                    <div className="rounded-xl border border-white/10 bg-[#080808] px-4 py-3 text-sm text-gray-400">
                      {theatre.status === "rejected"
                        ? "This theatre was rejected. Contact the administrator for more information."
                        : "Screen management will be available after your theatre is approved."}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TheatreListPage;