import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { deleteScreen, getScreensByOwner } from "../../services/screensApi";

const ScreenListPage = () => {
  const [loading, setLoading] = useState(true);

  const [screens, setScreens] = useState([]);

  const [theatre, setTheatre] = useState(null);

  useEffect(() => {
    fetchScreens();
  }, []);

  const fetchScreens = async () => {
    try {
      const res = await getScreensByOwner();

      setScreens(res.screens || []);
      console.log(res.screens)

      if (res.screens?.length) {
        setTheatre(res.screens[0].theatre);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteHandler = async (id) => {
    try {
      await deleteScreen(id)
       
      fetchScreens()
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div
        className="
          min-h-screen

          bg-black

          text-white

          flex
          items-center
          justify-center
        "
      >
        Loading...
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-black text-white px-4 py-6">
    <div className="max-w-7xl mx-auto">

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">
            Screens
          </h1>

          <p className="text-white/50 mt-2">
            Manage your theatre screens
          </p>
        </div>

        {screens.length > 0 && (
          <Link
            to={`/screens/create/${screens[0]?.theatre?._id}`}
            className="
              inline-flex
              items-center
              justify-center

              px-5
              py-3

              rounded-2xl

              bg-pink-600
              hover:bg-pink-700

              font-semibold

              transition
            "
          >
            Create Screen
          </Link>
        )}
      </div>

      {screens.length === 0 ? (
        <div
          className="
            bg-[#111]
            border
            border-white/10

            rounded-3xl

            p-10

            text-center
          "
        >
          <h2 className="text-2xl font-semibold">
            No Screens Found
          </h2>

          <p className="text-white/50 mt-2">
            Create your first screen
          </p>
        </div>
      ) : (
        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            xl:grid-cols-3

            gap-6
          "
        >
          {screens.map((screen) => (
            <div
              key={screen._id}
              className="
                bg-[#111]

                border
                border-white/10

                rounded-3xl

                p-6

                flex
                flex-col
                justify-between
              "
            >

              <div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold">
                      {screen.name}
                    </h2>

                    <p className="text-white/50 mt-1">
                      {screen.screenType}
                    </p>
                  </div>

                  <div
                    className="
                      px-3
                      py-1

                      rounded-full

                      bg-pink-500/10
                      text-pink-400

                      text-sm
                      whitespace-nowrap
                    "
                  >
                    {screen.totalSeats} Seats
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-white/40 text-sm">
                    Theatre
                  </p>

                  <h3 className="text-lg font-semibold">
                    {screen.theatre?.name}
                  </h3>

                  <p className="text-white/50 text-sm mt-1">
                    {screen.theatre?.location?.city || "Location"}
                  </p>
                </div>

                <div
                  className="
                    mt-6

                    grid
                    grid-cols-2

                    gap-4
                  "
                >
                  {Object.entries(screen.prices || {}).map(
                    ([type, priceData]) => (
                      <div
                        key={type}
                        className="
                          bg-black/40

                          border
                          border-white/5

                          rounded-2xl

                          p-4
                        "
                      >
                        <p
                          className="
                            text-white/50
                            text-sm
                            capitalize
                          "
                        >
                          {type}
                        </p>

                        <h3 className="text-lg font-semibold mt-1">
                          ₹
                          {typeof priceData === "object"
                            ? priceData?.price
                            : priceData}
                        </h3>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Link
                  to={`/theatre-owner/screens/edit/${screen._id}`}
                  className="
                    flex-1

                    px-4
                    py-3

                    rounded-2xl

                    bg-blue-600
                    hover:bg-blue-700

                    text-center
                    font-semibold

                    transition
                  "
                >
                  Edit
                </Link>

                <button
                  onClick={() => deleteHandler(screen._id)}
                  className="
                    flex-1

                    px-4
                    py-3

                    rounded-2xl

                    bg-red-600
                    hover:bg-red-700

                    font-semibold

                    transition
                  "
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);
};

export default ScreenListPage;
