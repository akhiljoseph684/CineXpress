import React, { useEffect, useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaSpinner,
  FaUserAlt,
  FaChevronLeft,
  FaChevronRight,
  FaExclamationCircle,
  FaRedo,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  deleteActor,
  searchActors,
} from "../../../services/actorsApi";

function Actors() {
  const navigate = useNavigate();

  const [actors, setActors] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedActorId, setSelectedActorId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchActors(search, page);
    }, search ? 500 : 0);

    return () => clearTimeout(timer);
  }, [search, page]);

  const fetchActors = async (name = "", currentPage = 1) => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({
        page: String(currentPage),
        limit: "12",
      });

      if (name.trim()) {
        params.set("name", name.trim());
      }

      const res = await searchActors(`?${params.toString()}`);

      if (!res.success) {
        setError(res.message || "Failed to fetch actors.");
        setActors([]);
        return;
      }

      setActors(res.actors || []);
      setTotalPages(res.totalPages || 1);
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch actors."
      );
      setActors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleEdit = (id) => {
    navigate(`/admin/actors/edit/${id}`);
  };

  const handleDetails = (id) => {
    navigate(`/admin/actors/${id}`);
  };

  const openDeleteModal = (id) => {
    setSelectedActorId(id);
    setShowDeleteModal(true);
    setError("");
  };

  const closeDeleteModal = () => {
    if (deleting) return;

    setShowDeleteModal(false);
    setSelectedActorId(null);
  };

  const confirmDelete = async () => {
    if (!selectedActorId || deleting) return;

    try {
      setDeleting(true);
      setError("");

      const res = await deleteActor(selectedActorId);

      if (!res.success) {
        setError(res.message || "Failed to delete actor.");
        return;
      }

      const remainingActors = actors.filter(
        (actor) => actor._id !== selectedActorId
      );

      setShowDeleteModal(false);
      setSelectedActorId(null);

      if (remainingActors.length === 0 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        await fetchActors(search, page);
      }
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to delete actor."
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#080808] text-white px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-11 h-11 rounded-xl bg-red-600/10 border border-red-500/20 flex items-center justify-center">
                <FaUserAlt className="text-red-500 text-lg" />
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Actors
              </h1>
            </div>

            <p className="text-white/50 text-sm sm:text-base">
              Manage your movie actors and their profiles.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/admin/actors/create")}
            className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 px-5 py-3 rounded-xl font-medium transition-colors w-full sm:w-auto"
          >
            <FaPlus />
            Create Actor
          </button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />

            <input
              type="text"
              placeholder="Search actors by name..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full bg-[#111] border border-white/10 rounded-xl pl-12 pr-12 py-4 text-white placeholder:text-white/30 outline-none focus:border-red-500/60 transition-colors"
            />

            {search && (
              <button
                type="button"
                onClick={() => handleSearch("")}
                aria-label="Clear search"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
              >
                <FaTimes />
              </button>
            )}
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
              onClick={() => fetchActors(search, page)}
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
            <p className="text-white/50 text-sm">Loading actors...</p>
          </div>
        ) : actors.length === 0 && !error ? (
          <div className="bg-[#111] border border-white/10 rounded-2xl py-16 px-6 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-600/10 border border-red-500/10 flex items-center justify-center mb-5">
              <FaUserAlt className="text-red-500 text-2xl" />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold">
              No Actors Found
            </h2>

            <p className="text-white/50 mt-3 max-w-md text-sm">
              {search.trim()
                ? "No actors match your search. Try another name."
                : "There are currently no actors available in your collection."}
            </p>

            {search.trim() && (
              <button
                type="button"
                onClick={() => handleSearch("")}
                className="mt-5 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {actors.map((actor) => (
              <div
                key={actor._id}
                className="bg-[#111] rounded-2xl p-5 sm:p-6 border border-white/10 hover:border-red-500/30 transition-colors duration-200"
              >
                <div className="flex flex-col items-center text-center">
                  {actor.profileImage ? (
                    <img
                      src={actor.profileImage}
                      alt={actor.name || "Actor"}
                      className="w-28 h-28 rounded-full object-cover border-4 border-red-500/20 bg-black"
                    />
                  ) : (
                    <div className="w-28 h-28 rounded-full border-4 border-red-500/20 bg-black flex items-center justify-center">
                      <FaUserAlt className="text-white/30 text-3xl" />
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDetails(actor._id)}
                    className="text-xl font-bold mt-5 hover:text-red-400 transition-colors"
                  >
                    {actor.name}
                  </button>

                  <p className="text-white/50 text-sm mt-3 line-clamp-3 min-h-[3.75rem]">
                    {actor.bio || "No biography available."}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => handleEdit(actor._id)}
                    aria-label={`Edit ${actor.name}`}
                    className="py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaEdit />
                    <span className="text-sm font-medium">Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => openDeleteModal(actor._id)}
                    aria-label={`Delete ${actor.name}`}
                    className="py-3 rounded-xl bg-red-600/10 border border-red-500/20 text-red-400 hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center gap-2"
                  >
                    <FaTrash />
                    <span className="text-sm font-medium">Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 sm:gap-3 mt-10 flex-wrap">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              className="flex items-center gap-2 px-3 sm:px-5 py-3 rounded-xl bg-[#111] border border-white/10 hover:border-red-500/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <FaChevronLeft className="text-xs" />
              <span>Prev</span>
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1)
              .filter(
                (pageNumber) =>
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  Math.abs(pageNumber - page) <= 1
              )
              .map((pageNumber, index, visiblePages) => (
                <React.Fragment key={pageNumber}>
                  {index > 0 &&
                    visiblePages[index - 1] !== pageNumber - 1 && (
                      <span className="text-white/40 px-1">...</span>
                    )}

                  <button
                    type="button"
                    onClick={() => setPage(pageNumber)}
                    aria-current={page === pageNumber ? "page" : undefined}
                    className={`w-11 h-11 rounded-xl font-medium transition-colors border ${
                      page === pageNumber
                        ? "bg-red-600 border-red-600 text-white"
                        : "bg-[#111] border-white/10 hover:border-red-500/50 text-white/70"
                    }`}
                  >
                    {pageNumber}
                  </button>
                </React.Fragment>
              ))}

            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() =>
                setPage((prev) => Math.min(totalPages, prev + 1))
              }
              className="flex items-center gap-2 px-3 sm:px-5 py-3 rounded-xl bg-[#111] border border-white/10 hover:border-red-500/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <span>Next</span>
              <FaChevronRight className="text-xs" />
            </button>
          </div>
        )}
      </div>

      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeDeleteModal();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-actor-title"
            className="w-full max-w-md bg-[#111] border border-red-500/20 rounded-2xl p-6 sm:p-8 text-center shadow-2xl shadow-black/50"
          >
            <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <FaTrash className="text-red-400 text-2xl" />
            </div>

            <h2
              id="delete-actor-title"
              className="text-2xl font-bold mt-5"
            >
              Delete Actor?
            </h2>

            <p className="text-white/50 mt-3 text-sm leading-6">
              This action cannot be undone. Are you sure you want to delete
              this actor?
            </p>

            <div className="flex gap-3 mt-8">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={deleting}
                className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <FaTrash />
                    Delete
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

export default Actors;