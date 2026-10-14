import React, { useEffect, useState } from "react";
import {
  FaPlus,
  FaTags,
  FaGlobe,
  FaTrash,
  FaSpinner,
  FaExclamationCircle,
} from "react-icons/fa";
import {
  createGenre,
  createLanguage,
  deleteGenre,
  deleteLanguage,
  getGenres,
  getLanguages,
} from "../../services/categories";

function LanguageGenre() {
  const [activeTab, setActiveTab] = useState("languages");
  const [languages, setLanguages] = useState([]);
  const [genres, setGenres] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchLanguages();
    fetchGenres();
  }, []);

  const fetchLanguages = async () => {
    try {
      const res = await getLanguages();
      setLanguages(res.languages || []);
    } catch (error) {
      setError(error?.message || "Failed to fetch languages");
    }
  };

  const fetchGenres = async () => {
    try {
      const res = await getGenres();
      setGenres(res.genres || []);
    } catch (error) {
      setError(error?.message || "Failed to fetch genres");
    }
  };

  const fetchActiveData = async () => {
    setFetching(true);
    setError("");

    try {
      if (activeTab === "languages") {
        const res = await getLanguages();
        setLanguages(res.languages || []);
      } else {
        const res = await getGenres();
        setGenres(res.genres || []);
      }
    } catch (error) {
      setError(error?.message || "Failed to fetch data");
    } finally {
      setFetching(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setName("");
    setError("");
    setSuccess("");
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    const trimmedName = name.trim();

    setError("");
    setSuccess("");

    if (!trimmedName) {
      setError(
        `${activeTab === "languages" ? "Language" : "Genre"} name is required`
      );
      return;
    }

    setLoading(true);

    try {
      const res =
        activeTab === "languages"
          ? await createLanguage({ name: trimmedName })
          : await createGenre({ name: trimmedName });

      if (!res.success) {
        setError(res.message || "Failed to create item");
        return;
      }

      setName("");
      setSuccess(
        `${activeTab === "languages" ? "Language" : "Genre"} created successfully`
      );

      await fetchActiveData();
    } catch (error) {
      setError(error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id, itemName) => {
    const itemType = activeTab === "languages" ? "language" : "genre";

    const confirmed = window.confirm(
      `Are you sure you want to delete ${itemType} "${itemName}"?`
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");
    setDeletingId(id);

    try {
      const res =
        activeTab === "languages"
          ? await deleteLanguage(id)
          : await deleteGenre(id);

      if (!res.success) {
        setError(res.message || "Failed to delete item");
        return;
      }

      setSuccess(
        `${activeTab === "languages" ? "Language" : "Genre"} deleted successfully`
      );

      await fetchActiveData();
    } catch (error) {
      setError(error?.message || "Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  const items = activeTab === "languages" ? languages : genres;

  return (
    <div className="min-h-full w-full bg-[#080808] p-4 text-white sm:p-6 lg:p-8">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Languages & Genres
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Manage the languages and genres available for your movies.
          </p>
        </div>

        <div className="flex w-fit items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
          <FaTags />
          <span>{items.length} {activeTab === "languages" ? "Languages" : "Genres"}</span>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111] shadow-xl shadow-black/20">
        <div className="grid grid-cols-2 border-b border-white/10">
          <button
            type="button"
            onClick={() => handleTabChange("languages")}
            className={`flex items-center justify-center gap-2 border-b-2 px-4 py-4 text-sm font-semibold transition ${
              activeTab === "languages"
                ? "border-red-500 bg-red-500/10 text-red-400"
                : "border-transparent text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <FaGlobe />
            Languages
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("genres")}
            className={`flex items-center justify-center gap-2 border-b-2 px-4 py-4 text-sm font-semibold transition ${
              activeTab === "genres"
                ? "border-red-500 bg-red-500/10 text-red-400"
                : "border-transparent text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <FaTags />
            Genres
          </button>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          <form
            onSubmit={handleCreate}
            className="mb-6 flex flex-col gap-3 sm:flex-row"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                  setSuccess("");
                }}
                placeholder={
                  activeTab === "languages"
                    ? "Enter language name"
                    : "Enter genre name"
                }
                maxLength={60}
                disabled={loading}
                className="w-full rounded-xl border border-white/10 bg-[#080808] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-red-500 focus:ring-2 focus:ring-red-500/10 disabled:opacity-60"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaPlus />
              )}
              {loading
                ? "Creating..."
                : activeTab === "languages"
                  ? "Add Language"
                  : "Add Genre"}
            </button>
          </form>

          {error && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
              <FaExclamationCircle className="mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-5 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-400">
              {success}
            </div>
          )}

          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-base font-semibold text-white sm:text-lg">
              {activeTab === "languages" ? "All Languages" : "All Genres"}
            </h2>

            <button
              type="button"
              onClick={fetchActiveData}
              disabled={fetching}
              className="rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-gray-400 transition hover:border-red-500/40 hover:text-red-400 disabled:opacity-50"
            >
              {fetching ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {fetching ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500">
              <FaSpinner className="mb-3 animate-spin text-2xl text-red-500" />
              <p className="text-sm">Loading {activeTab}...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/10 px-4 py-14 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-xl text-red-400">
                {activeTab === "languages" ? <FaGlobe /> : <FaTags />}
              </div>
              <h3 className="font-semibold text-white">
                No {activeTab === "languages" ? "languages" : "genres"} found
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Add your first {activeTab === "languages" ? "language" : "genre"} using the form above.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="group flex min-w-0 items-center gap-3 rounded-xl border border-white/10 bg-[#080808] p-4 transition duration-200 hover:border-red-500/40 hover:bg-[#101010]"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 transition group-hover:bg-red-500/20">
                    {activeTab === "languages" ? <FaGlobe /> : <FaTags />}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold text-white">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-xs text-gray-500">
                      {activeTab === "languages" ? "Movie Language" : "Movie Genre"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemove(item._id, item.name)}
                    disabled={deletingId === item._id}
                    aria-label={`Delete ${item.name}`}
                    title={`Delete ${item.name}`}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 transition hover:border-red-500 hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {deletingId === item._id ? (
                      <FaSpinner className="animate-spin" size={13} />
                    ) : (
                      <FaTrash size={13} />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LanguageGenre;