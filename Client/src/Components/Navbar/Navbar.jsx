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

function Navbar() {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const [search, setSearch] = useState("");

  const [movies, setMovies] = useState([]);

  const [loading, setLoading] = useState(false);

  const [showDropdown, setShowDropdown] = useState(false);

  const [mobileMenu, setMobileMenu] = useState(false);

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
      ? 
        [
          user.preferredCity,
          ...cities.filter(
            (city) =>
              city !== user.preferredCity
          ),
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
      await updateUserApi({
        preferredCity: city,
      });

      dispatch(
        updateUser({
          preferredCity: city,
        })
      );

      setShowDropdown(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <header
      className="
        sticky top-0 z-50
        bg-black/80
        backdrop-blur-xl
        border-b border-white/10
        w-full
      "
    >
      <div
        className="
          flex items-center justify-between
          px-4 md:px-6
          py-3
          gap-3
        "
      >
        <div
          onClick={() => navigate("/")}
          className="
            text-xl sm:text-2xl md:text-3xl
            font-black
            tracking-wider
            cursor-pointer
            text-white
            shrink-0
          "
        >
          CINE
          <span className="text-pink-500">
            XPRESS
          </span>
        </div>

        <div
          className="
            hidden md:block
            relative flex-1
            max-w-2xl
          "
        >
          <div
            className="
              flex items-center
              bg-white/5
              border border-white/10
              rounded-full
              px-4
            "
          >
            <FaSearch className="text-gray-400" />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search movies..."
              className="
                w-full
                bg-transparent
                outline-none
                px-4 py-3
                text-white
                placeholder:text-gray-500
              "
            />
          </div>

          {search && (
            <div
              className="
                absolute top-full left-0
                w-full mt-2
                bg-[#111]
                border border-white/10
                rounded-2xl
                overflow-hidden
                shadow-2xl
                max-h-[400px]
                overflow-y-auto
                z-50
              "
            >
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
                    className="
                      flex items-center gap-3
                      p-4
                      hover:bg-white/5
                      cursor-pointer transition
                    "
                  >
                    <img
                      src={movie.poster?.thumbnail}
                      alt=""
                      className="
                        w-14 h-20
                        rounded-lg
                        object-cover
                      "
                    />

                    <div className="min-w-0 flex-1">
                      <h3
                        className="
                          text-white
                          font-semibold
                          truncate
                        "
                      >
                        {movie.title}
                      </h3>

                      <p
                        className="
                          text-sm text-gray-400
                          truncate
                        "
                      >
                        {movie.genre
                          ?.map((g) => g.name)
                          .join(", ")}
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

        <div className="hidden md:flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() =>
                setShowDropdown(!showDropdown)
              }
              className="
                flex items-center gap-2
                px-4 py-2
                rounded-full
                bg-white/5
                border border-white/10
                text-white text-sm
              "
            >
              <FaMapMarkerAlt />

              <span className="max-w-[100px] truncate">
                {user?.preferredCity ||
                  "Select City"}
              </span>

              <FaChevronDown className="text-xs" />
            </button>

            {showDropdown && (
              <div
                className="
                  absolute top-full right-0
                  mt-2 w-56
                  bg-[#111]
                  border border-white/10
                  rounded-2xl
                  overflow-hidden
                  shadow-2xl
                  z-50
                "
              >
                {cities.map((city) => (
                  <button
                    key={city}
                    onClick={() =>
                      handleCity(city)
                    }
                    className="
                      w-full text-left
                      px-5 py-3
                      hover:bg-white/5
                      text-white text-sm
                    "
                  >
                    {city}
                  </button>
                ))}

                <button
                  onClick={() => {
                    navigate("/cities");
                    setShowDropdown(false);
                  }}
                  className="
                    w-full text-left
                    px-5 py-3
                    text-pink-500
                    border-t border-white/10
                    hover:bg-white/5
                    text-sm
                  "
                >
                  More Cities →
                </button>
              </div>
            )}
          </div>

          <div
            onClick={() =>
              navigate("/profile")
            }
            className="cursor-pointer"
          >
            <img
              src={user?.avatar || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThZwd0Ar5WsR1Z-ylhArKLTDqEhKPlMqWvZw&s"}
              alt=""
              className="
                w-11 h-11
                rounded-full
                object-cover
                border border-pink-500/30
              "
            />
          </div>
        </div>

        <button
          onClick={() =>
            setMobileMenu(!mobileMenu)
          }
          className="
            md:hidden
            text-white
            text-xl
          "
        >
          {mobileMenu ? (
            <FaTimes />
          ) : (
            <FaBars />
          )}
        </button>
      </div>

      {mobileMenu && (
        <div
          className="
            md:hidden
            px-4 pb-4
            space-y-4
            border-t border-white/10
          "
        >
          <div className="relative">
            <div
              className="
                flex items-center
                bg-white/5
                border border-white/10
                rounded-full
                px-4
              "
            >
              <FaSearch className="text-gray-400" />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search movies..."
                className="
                  w-full
                  bg-transparent
                  outline-none
                  px-3 py-3
                  text-white
                "
              />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-gray-400 text-sm">
              Select City
            </p>

            <div className="grid grid-cols-2 gap-2">
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() =>
                    handleCity(city)
                  }
                  className={`
                    bg-white/5
                    border
                    rounded-xl
                    py-2 px-3
                    text-white text-sm
                    ${user.preferredCity === city ?
                      "border-pink-500" : 
                      "border-white/10"
                    }
                  `}
                >
                  {city}
                </button>
              ))}
              <button
                onClick={() => {
                  navigate("/cities");
                  setMobileMenu(false);
                }}
                className="
                  w-full
                  bg-white/5
                  border border-white/10
                  rounded-xl
                  py-3
              
                  text-pink-500
                  font-semibold
              
                  hover:bg-white/10
                  transition
                "
              >
                More Cities →
              </button>
            </div>
          </div>

          <button
            onClick={() =>
              navigate("/profile")
            }
            className="
              w-full
              bg-pink-500
              rounded-xl
              py-3
              text-white
              font-semibold
            "
          >
            Go To Profile
          </button>
        </div>
      )}
    </header>
  );
}

export default Navbar;