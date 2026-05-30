import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import axios from "axios";
import { deleteScreen, getAllScreens } from "../../../services/screensApi";

const ScreenList = () => {
  const [loading, setLoading] = useState(true);

  const [screens, setScreens] = useState([]);

  useEffect(() => {
    fetchScreens();
  }, []);

  const fetchScreens = async () => {
    try {
      const res = await getAllScreens();
console.log(res)
      setScreens(res.screens || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteHandler = async (id) => {
    try {
      await deleteScreen(id);

      setScreens(screens.filter((screen) => screen._id !== id));
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
    <div className=" text-white px-4 py-6 sm:p-8">

        <div
          className="
            flex
            flex-col
            sm:flex-row

            sm:items-center
            sm:justify-between

            gap-4

            mb-8
          "
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold">All Screens</h1>

            <p className="text-white/50 mt-2">Manage all theatre screens</p>
          </div>

          <div
            className="
              px-4
              py-2

              rounded-2xl

              bg-pink-500/10

              text-pink-400

              font-semibold

              w-fit
            "
          >
            {screens.length} Screens
          </div>
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
            <h2 className="text-2xl font-semibold">No Screens Found</h2>

            <p className="text-white/50 mt-2">No theatre screens available</p>
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
                  <div
                    className="
                      flex
                      items-start
                      justify-between

                      gap-4
                    "
                  >
                    <div>
                      <h2 className="text-2xl font-bold">{screen.name}</h2>

                      <p className="text-white/50 mt-1">{screen.screenType}</p>
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
                    <p className="text-white/40 text-sm">Theatre</p>

                    <h3 className="text-lg font-semibold">
                      {screen.theatre?.name}
                    </h3>

                    <p className="text-white/50 text-sm mt-1">
                      {screen.theatre?.location?.city || "No Location"}
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
                      ([type, price]) => (
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

                          <h3
                            className="
                            text-lg
                            font-semibold

                            mt-1
                          "
                          >
                            ₹{price}
                          </h3>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                <div
                  className="
                    mt-6

                    pt-4

                    border-t
                    border-white/10

                    flex
                    items-center
                    justify-between
                  "
                >
                  <div>
                    <p className="text-white/40 text-sm">Owner</p>

                    <h4 className="font-medium">
                      {screen.owner?.name || "N/A"}
                    </h4>
                  </div>

                  <div
                    className="
                      px-3
                      py-1

                      rounded-full

                      bg-green-500/10

                      text-green-400

                      text-sm
                    "
                  >
                    Active
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
};

export default ScreenList;
