import React, { useEffect, useState } from "react";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaChevronDown,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateUser } from "../../features/authSlice";
import { updateUser as updateUserApi } from "../../services/usersAPi";
import { getAllMovies } from "../../services/moviesApi";
import CityPopup from "../CityPopup";

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [openCityPopup, setOpenCityPopup] = useState(false);

  const cities = [
    "Kochi",
    "Trivandrum",
    "Kozhikode",
    "Thrissur",
    "Kannur",
    "Kollam",
    "Palakkad",
  ];

  const updatedCities = user?.preferredCity
    ? [
        user.preferredCity,
        ...cities.filter((city) => city !== user.preferredCity),
      ]
    : cities;

  useEffect(() => {
    if (!search.trim()) {
      setMovies([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await getAllMovies(`?title=${search}`);
        setMovies(res.movies || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const handleCity = async (city) => {
    try {
      await updateUserApi({ preferredCity: city });
      dispatch(updateUser({ preferredCity: city }));
      setShowDropdown(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black">
        <div className="flex items-center justify-between gap-3 px-4 py-3 md:px-6">
          <div
            onClick={() => navigate("/")}
            className="shrink-0 cursor-pointer select-none text-xl font-black tracking-wider text-white sm:text-2xl md:text-3xl"
          >
            CINE<span className="text-red-600">XPRESS</span>
          </div>

          <div className="relative hidden max-w-2xl flex-1 md:block">
            <div className="flex items-center rounded-full border border-white/15 bg-white/5 px-4 transition focus-within:border-red-600">
              <FaSearch className="text-red-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search movies..."
                className="w-full bg-transparent px-4 py-3 text-white outline-none placeholder:text-gray-500"
              />
            </div>

            {search && (
              <div className="absolute left-0 top-full z-50 mt-2 max-h-[400px] w-full overflow-y-auto rounded-2xl border border-white/10 bg-black shadow-2xl">
                {loading ? (
                  <div className="p-5 text-center text-gray-400">
                    Searching...
                  </div>
                ) : movies.length ? (
                  movies.map((movie) => (
                    <div
                      key={movie._id}
                      onClick={() => {
                        navigate(`/movies/${movie._id}`);
                        setSearch("");
                      }}
                      className="group flex cursor-pointer items-center gap-3 p-4 transition hover:bg-red-600"
                    >
                      <img
                        src={movie.poster?.thumbnail}
                        alt={movie.title}
                        className="h-20 w-14 rounded-lg object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-semibold text-white">
                          {movie.title}
                        </h3>
                        <p className="truncate text-sm text-gray-400 group-hover:text-white">
                          {movie.genre?.map((g) => g.name).join(", ")}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-5 text-center text-gray-400">
                    No movies found
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="hidden items-center gap-4 md:flex">
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white transition hover:border-red-600 hover:bg-red-600"
              >
                <FaMapMarkerAlt className="text-red-500" />
                <span className="max-w-[100px] truncate">
                  {user?.preferredCity || "Select City"}
                </span>
                <FaChevronDown className="text-xs" />
              </button>

              {showDropdown && (
                <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
                  {updatedCities.map((city) => (
                    <button
                      key={city}
                      onClick={() => handleCity(city)}
                      className="w-full px-5 py-3 text-left text-sm text-white transition hover:bg-red-600"
                    >
                      {city}
                    </button>
                  ))}

                  <button
                    onClick={() => {
                      setOpenCityPopup(true);
                      setShowDropdown(false);
                    }}
                    className="w-full border-t border-white/10 px-5 py-3 text-left text-sm text-red-500 transition hover:bg-red-600 hover:text-white"
                  >
                    More Cities →
                  </button>
                </div>
              )}
            </div>

            <div
              onClick={() => navigate("/profile")}
              className="cursor-pointer"
            >
              <img
                src={
                  user?.avatar ||
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThZwd0Ar5WsR1Z-ylhArKLTDqEhKPlMqWvZw&s"
                }
                alt="Profile"
                referrerPolicy="no-referrer"
                className="h-11 w-11 rounded-full border border-red-600/50 object-cover transition hover:border-red-500"
              />
            </div>
          </div>

          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="text-xl text-white transition hover:text-red-500 md:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenu ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {mobileMenu && (
          <div className="space-y-4 border-t border-white/10 bg-black p-4 md:hidden">
            <div className="flex items-center rounded-full border border-white/15 bg-white/5 px-4 focus-within:border-red-600">
              <FaSearch className="text-red-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search movies..."
                className="w-full bg-transparent px-4 py-3 text-white outline-none placeholder:text-gray-500"
              />
            </div>

            {search && (
              <div className="overflow-hidden rounded-xl border border-white/10 bg-black">
                {loading ? (
                  <p className="p-4 text-center text-gray-400">
                    Searching...
                  </p>
                ) : movies.length ? (
                  movies.map((movie) => (
                    <div
                      key={movie._id}
                      onClick={() => {
                        navigate(`/movies/${movie._id}`);
                        setSearch("");
                        setMobileMenu(false);
                      }}
                      className="group flex cursor-pointer items-center gap-3 p-3 transition hover:bg-red-600"
                    >
                      <img
                        src={movie.poster?.thumbnail}
                        alt={movie.title}
                        className="h-16 w-12 rounded object-cover"
                      />
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-white">
                          {movie.title}
                        </p>
                        <p className="truncate text-sm text-gray-400 group-hover:text-white">
                          {movie.genre?.map((g) => g.name).join(", ")}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="p-4 text-center text-gray-400">
                    No movies found
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <p className="text-sm text-gray-400">Select City</p>
              <div className="grid grid-cols-2 gap-2">
                {updatedCities.map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      handleCity(city);
                      setMobileMenu(false);
                    }}
                    className="rounded-lg border border-white/15 px-3 py-2 text-sm text-white transition hover:border-red-600 hover:bg-red-600"
                  >
                    {city}
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  setOpenCityPopup(true);
                  setMobileMenu(false);
                }}
                className="w-full rounded-lg border border-red-600 px-4 py-2 text-red-500 transition hover:bg-red-600 hover:text-white"
              >
                More Cities →
              </button>
            </div>

            <button
              onClick={() => {
                navigate("/profile");
                setMobileMenu(false);
              }}
              className="flex w-full items-center gap-3 rounded-lg border border-white/15 p-3 text-white transition hover:border-red-600 hover:bg-red-600"
            >
              <img
                src={
                  user?.avatar ||
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThZwd0Ar5WsR1Z-ylhArKLTDqEhKPlMqWvZw&s"
                }
                alt="Profile"
                referrerPolicy="no-referrer"
                className="h-9 w-9 rounded-full border border-red-600/50 object-cover"
              />
              <span>My Profile</span>
            </button>
          </div>
        )}
      </header>

      <CityPopup
        isOpen={openCityPopup}
        onClose={() => setOpenCityPopup(false)}
        selectedCity={user?.preferredCity}
        setSelectedCity={async (city) => {
          await handleCity(city);
        }}
      />
    </>
  );
}

export default Navbar;