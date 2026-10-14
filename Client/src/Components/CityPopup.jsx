import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import { updateUser } from "../features/authSlice";
import { updateUser as updateUserApi } from "../services/usersAPi";
import { useDispatch } from "react-redux";

function CityPopup({ isOpen, onClose, selectedCity, setSelectedCity }) {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!isOpen) return;
    fetchCities(1, true);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      fetchCities(1, true);
    }, 500);

    return () => clearTimeout(timer);
  }, [search, isOpen]);

  const fetchCities = async (currentPage = 1, reset = false) => {
    try {
      setLoading(true);

      const res = await axios.get(
        "https://countriesnow.space/api/v0.1/countries/population/cities"
      );

      let allCities = res.data.data
        ?.map((item) => item.city)
        .filter(Boolean);

      allCities = [...new Set(allCities)];

      if (search.trim()) {
        allCities = allCities.filter((city) =>
          city.toLowerCase().includes(search.toLowerCase())
        );
      }

      const limit = 30;
      const start = (currentPage - 1) * limit;
      const end = start + limit;
      const paginatedCities = allCities.slice(start, end);

      setHasMore(end < allCities.length);

      if (reset) {
        setCities(paginatedCities);
      } else {
        setCities((prev) => [...prev, ...paginatedCities]);
      }

      setPage(currentPage);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (loading || !hasMore) return;
    fetchCities(page + 1);
  };

  const handleSelectCity = async (city) => {
    try {
      await updateUserApi({ preferredCity: city });

      setSelectedCity(city);

      dispatch(
        updateUser({
          preferredCity: city,
        })
      );

      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-black text-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 p-4">
          <div>
            <h2 className="text-2xl font-bold">
              Select City 🌍
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              Explore theatres near your city
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close city selection"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white transition hover:bg-red-600"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          <div className="relative">
            <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-red-500" />

            <input
              type="text"
              placeholder="Search city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-14 pr-5 text-white outline-none transition placeholder:text-gray-500 focus:border-red-600"
            />
          </div>
        </div>

        <div className="max-h-[500px] overflow-y-auto px-4 pb-4 scrollbar-hide">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => handleSelectCity(city)}
                className={`flex items-center gap-4 rounded-2xl border p-5 text-left transition-all ${
                  selectedCity === city
                    ? "border-red-600 bg-red-600/10"
                    : "border-white/10 bg-white/[0.03] hover:border-red-600/50 hover:bg-red-600/5"
                }`}
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                    selectedCity === city
                      ? "bg-red-600 text-white"
                      : "bg-red-600/10 text-red-500"
                  }`}
                >
                  <FaMapMarkerAlt />
                </div>

                <div className="min-w-0 text-left">
                  <h3 className="line-clamp-1 font-semibold text-white">
                    {city}
                  </h3>

                  <p className="mt-1 text-sm text-gray-400">
                    Explore theatres
                  </p>
                </div>
              </button>
            ))}
          </div>

          {!loading && cities.length === 0 && (
            <p className="py-8 text-center text-gray-400">
              No cities found
            </p>
          )}

          {hasMore && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={loadMore}
                disabled={loading}
                className="rounded-2xl bg-red-600 px-6 py-4 font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CityPopup;