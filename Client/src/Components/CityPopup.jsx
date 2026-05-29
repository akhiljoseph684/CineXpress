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

  useEffect(() => {
    if (!isOpen) return;

    fetchCities(1, true);
  }, [isOpen]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCities(1, true);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const dispatch = useDispatch();

  const fetchCities = async (currentPage = 1, reset = false) => {
    try {
      setLoading(true);

      const res = await axios.get(
        `https://countriesnow.space/api/v0.1/countries/population/cities`,
      );

      let allCities = res.data.data
        ?.map((item) => item.city)

        .filter(Boolean);

      allCities = [...new Set(allCities)];

      if (search.trim()) {
        allCities = allCities.filter((city) =>
          city.toLowerCase().includes(search.toLowerCase()),
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
    console.log(city);
    setSelectedCity(city);

    await updateUserApi({
      preferredCity: city,
    });

    dispatch(
      updateUser({
        preferredCity: city,
      }),
    );

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="
        fixed
        inset-0

        z-[9999]

        bg-black/70
        backdrop-blur-sm

        flex
        items-start
        justify-center

        overflow-y-auto

        p-4
      "
    >
      <div
        className="
          w-full
          max-w-2xl

          bg-[#111]

          border
          border-white/10

          rounded-3xl

          overflow-hidden

          shadow-2xl
        "
      >
        <div
          className="
            flex
            items-center
            justify-between

            p-4

            border-b
            border-white/10
          "
        >
          <div>
            <h2
              className="
                text-2xl
                font-bold
              "
            >
              Select City 🌍
            </h2>

            <p
              className="
                text-white/40
                mt-2
              "
            >
              Explore theatres near your city
            </p>
          </div>

          <button
            onClick={onClose}
            className="
              w-10
              h-10

              rounded-xl

              bg-white/5
              hover:bg-white/10

              transition
            "
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          <div
            className="
              relative
            "
          >
            <FaSearch
              className="
                absolute

                left-5
                top-1/2
                -translate-y-1/2

                text-white/40
              "
            />

            <input
              type="text"
              placeholder="
                Search city...
              "
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full

                bg-[#1a1a1a]

                border
                border-white/10

                rounded-2xl

                pl-14
                pr-5
                py-4

                outline-none

                focus:border-pink-500

                transition
              "
            />
          </div>
        </div>

        <div
          className="
            px-4
            pb-4

            max-h-[500px]
            overflow-y-auto

            scrollbar-hide
          "
        >
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              md:grid-cols-3

              gap-4
            "
          >
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => handleSelectCity(city)}
                className={`
                    flex
                    items-center
                    gap-4

                    p-5

                    rounded-2xl

                    border

                    transition-all

                    ${
                      selectedCity === city
                        ? `
                          border-pink-500
                          bg-pink-500/10
                        `
                        : `
                          border-white/10
                          bg-[#1a1a1a]

                          hover:border-pink-500/40
                        `
                    }
                  `}
              >
                <div
                  className="
                      w-12
                      h-12

                      rounded-2xl

                      bg-pink-500/10

                      flex
                      items-center
                      justify-center

                      text-pink-400
                    "
                >
                  <FaMapMarkerAlt />
                </div>

                <div
                  className="
                      text-left
                    "
                >
                  <h3
                    className="
                        font-semibold
                        line-clamp-1
                      "
                  >
                    {city}
                  </h3>

                  <p
                    className="
                        text-sm
                        text-white/40
                        mt-1
                      "
                  >
                    Explore theatres
                  </p>
                </div>
              </button>
            ))}
          </div>

          {hasMore && (
            <div
              className="
                  flex
                  justify-center

                  mt-8
                "
            >
              <button
                onClick={loadMore}
                disabled={loading}
                className="
                    px-6
                    py-4

                    rounded-2xl

                    bg-gradient-to-r
                    from-pink-500
                    to-pink-600

                    font-medium

                    hover:opacity-90

                    transition

                    disabled:opacity-50
                  "
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
