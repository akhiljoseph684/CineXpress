import React, { useEffect, useState } from "react";
import {
  FaTrash,
  FaPlus,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaEdit,
  FaSpinner,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  deleteTheatre,
  getAllTheatres,
} from "../../../services/theatreApi";

function Theatres() {
  const navigate = useNavigate();

  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTheatre, setSelectedTheatre] = useState(null);

  const fetchTheatres = async (status = "all", searchValue = "") => {
    try {
      setLoading(true);
      setError("");

      const query = [];

      if (status && status !== "all") {
        query.push(`status=${encodeURIComponent(status)}`);
      }

      if (searchValue.trim()) {
        query.push(`search=${encodeURIComponent(searchValue.trim())}`);
      }

      const queryString = query.length ? `?${query.join("&")}` : "";
      const res = await getAllTheatres(queryString);

      if (!res.success) {
        setError(res.message || "Failed to fetch theatres");
        setTheatres([]);
        return;
      }

      setTheatres(res.theatres || []);
    } catch (error) {
      setError(error?.message || "Failed to fetch theatres");
      setTheatres([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTheatres(activeFilter, search);
    }, 400);

    return () => clearTimeout(timer);
  }, [activeFilter, search]);

  const handleDelete = async () => {
    if (!selectedTheatre?._id || deleting) return;

    try {
      setDeleting(true);
      setError("");

      const res = await deleteTheatre(selectedTheatre._id);

      if (!res.success) {
        setError(res.message || "Failed to delete theatre");
        return;
      }

      setShowDeleteModal(false);
      setSelectedTheatre(null);

      await fetchTheatres(activeFilter, search);

      navigate("/admin/theatre");
    } catch (error) {
      setError(error?.message || "Failed to delete theatre");
    } finally {
      setDeleting(false);
    }
  };

  const filters = [
    { label: "All", value: "all" },
    { label: "Approved", value: "approved" },
    { label: "Pending", value: "pending" },
    { label: "Rejected", value: "rejected" },
  ];

  const statusStyle = (status) => {
    if (status === "approved") {
      return "border-green-500/20 bg-green-500/10 text-green-400";
    }

    if (status === "pending") {
      return "border-yellow-500/20 bg-yellow-500/10 text-yellow-400";
    }

    return "border-red-500/20 bg-red-500/10 text-red-400";
  };

  return (
    <div className="mx-auto w-full min-w-0 max-w-7xl text-white">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-2xl">
              🎭
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Theatres
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage all theatres in CineXpress
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate("/admin/theatre-owner/register")}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/40 sm:w-auto"
        >
          <FaPlus />
          Create Theatre
        </button>
      </div>

      {error && (
        <div className="mb-6 flex items-start justify-between gap-4 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          <p>{error}</p>
          <button
            type="button"
            onClick={() => setError("")}
            className="shrink-0 text-red-400 transition hover:text-white"
            aria-label="Dismiss error"
          >
            <FaTimesCircle />
          </button>
        </div>
      )}

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search theatres by name or city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-[#111111] px-5 py-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
        />
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-3">
        {filters.map((item) => (
          <button
            type="button"
            key={item.value}
            onClick={() => setActiveFilter(item.value)}
            className={`rounded-xl border px-5 py-3 text-sm font-medium transition ${
              activeFilter === item.value
                ? "border-red-500 bg-red-600 text-white"
                : "border-white/10 bg-[#111111] text-gray-400 hover:border-red-500/50 hover:text-white"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
          <FaSpinner className="animate-spin text-3xl text-red-500" />
          <p className="text-sm text-gray-400">Loading theatres...</p>
        </div>
      ) : theatres.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {theatres.map((theatre) => (
            <div
              key={theatre._id}
              className="group min-w-0 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111111] shadow-xl transition duration-300 hover:border-red-500/40"
            >
              <div className="relative h-[230px] overflow-hidden bg-[#080808]">
                <img
                  src={theatre.bannerImage}
                  alt={theatre.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

                <span
                  className={`absolute left-4 top-4 rounded-lg border px-3 py-2 text-xs font-semibold capitalize backdrop-blur-md ${statusStyle(
                    theatre.status
                  )}`}
                >
                  {theatre.status}
                </span>

                <div className="absolute right-4 top-4 flex items-center gap-2">
                  <button
                    type="button"
                    aria-label={`Edit ${theatre.name}`}
                    onClick={() =>
                      navigate(`/admin/theatres/edit/${theatre._id}`)
                    }
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/60 text-white transition hover:border-red-500 hover:bg-red-600"
                  >
                    <FaEdit />
                  </button>

                  <button
                    type="button"
                    aria-label={`Delete ${theatre.name}`}
                    onClick={() => {
                      setSelectedTheatre(theatre);
                      setShowDeleteModal(true);
                    }}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/20 bg-red-600/90 text-white transition hover:bg-red-700"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              <div className="p-5">
                <h2 className="truncate text-xl font-bold text-white">
                  {theatre.name}
                </h2>

                <div className="mt-5 space-y-4 text-sm">
                  <div className="flex items-start justify-between gap-4">
                    <span className="shrink-0 text-gray-500">👤 Owner</span>
                    <div className="min-w-0 text-right">
                      <p className="break-words font-medium text-gray-200">
                        {theatre.ownerId?.name || "Waiting Registration"}
                      </p>
                      <p className="mt-1 break-all text-xs text-gray-500">
                        {theatre.ownerId?.email ||
                          theatre.ownerEmail ||
                          "-"}
                      </p>
                    </div>
                  </div>

                  {theatre.secretCode && (
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-gray-500">🔐 Secret Code</span>
                      <span className="break-all font-bold tracking-widest text-red-400">
                        {theatre.secretCode}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-2 text-gray-500">
                      <FaMapMarkerAlt className="text-red-500" />
                      City
                    </span>
                    <span className="text-right text-gray-200">
                      {theatre.city || "-"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4 border-t border-white/[0.06] pt-4">
                    <span className="text-gray-500">Status</span>
                    <span className="flex items-center gap-2 text-sm capitalize text-gray-200">
                      {theatre.status === "approved" ? (
                        <FaCheckCircle className="text-green-400" />
                      ) : theatre.status === "pending" ? (
                        <FaClock className="text-yellow-400" />
                      ) : (
                        <FaTimesCircle className="text-red-400" />
                      )}
                      {theatre.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex min-h-[35vh] flex-col items-center justify-center rounded-2xl border border-white/[0.07] bg-[#111111] px-6 py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-3xl">
            🎭
          </div>
          <h2 className="text-xl font-semibold text-white">
            No Theatres Found
          </h2>
          <p className="mt-2 max-w-sm text-sm text-gray-500">
            No theatres match your current search or selected status filter.
          </p>
          {(search || activeFilter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setActiveFilter("all");
              }}
              className="mt-5 rounded-lg border border-red-500/30 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111111] p-6 shadow-2xl sm:p-8">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-xl text-red-500">
              <FaTrash />
            </div>

            <h2 className="text-xl font-bold text-white">
              Delete Theatre?
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-400">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-white">
                {selectedTheatre?.name}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={deleting}
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedTheatre(null);
                }}
                className="rounded-xl border border-white/10 bg-[#1a1a1a] px-5 py-3 text-sm font-medium text-gray-300 transition hover:bg-white/10 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <FaTrash />
                    Delete Theatre
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Theatres;