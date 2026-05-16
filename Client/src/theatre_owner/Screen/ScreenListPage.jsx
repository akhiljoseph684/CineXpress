import React, {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  getTheatreByOwner
} from "../../services/theatreApi";

function ScreenListPage() {

  const navigate =
    useNavigate();

  const [theatres,
    setTheatres] =
    useState([]);

  useEffect(() => {

    fetchTheatres();

  }, []);

  const fetchTheatres =
    async () => {

      try {

        const res =
          await getTheatreByOwner();

        setTheatres(
          res.theatres || []
        );

      } catch (error) {

        console.log(error);

      }

    };

  return (

    <div
      className="
        p-8

        space-y-8
      "
    >

      <div>

        <h1
          className="
            text-4xl
            font-bold
          "
        >

          Screens

        </h1>

        <p
          className="
            text-gray-400
            mt-2
          "
        >

          Manage theatre screens

        </p>

      </div>

      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-2

          gap-8
        "
      >

        {
          theatres.map(
            (theatre) => (

              <div
                key={theatre._id}

                className="
                  bg-[#181818]

                  rounded-3xl

                  overflow-hidden

                  border
                  border-white/10
                "
              >

                {/* Banner */}

                <div
                  className="
                    relative
                  "
                >

                  <img
                    src={
                      theatre.bannerImage
                    }

                    alt=""

                    className="
                      w-full
                      h-[260px]

                      object-cover
                    "
                  />

                  <div
                    className="
                      absolute
                      inset-0

                      bg-gradient-to-t
                      from-black/90
                      to-transparent
                    "
                  />

                  <div
                    className="
                      absolute
                      bottom-5
                      left-5
                    "
                  >

                    <h2
                      className="
                        text-3xl
                        font-bold
                      "
                    >

                      {
                        theatre.name
                      }

                    </h2>

                    <p
                      className="
                        text-gray-300
                        mt-1
                      "
                    >

                      {
                        theatre.city
                      }

                    </p>

                  </div>

                </div>

                {/* Body */}

                <div
                  className="
                    p-6
                    space-y-5
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                    "
                  >

                    <div>

                      <p
                        className="
                          text-gray-400
                        "
                      >

                        {
                          theatre.address
                        }

                      </p>

                    </div>

                    <div
                      className="
                        bg-white/5

                        px-4
                        py-2

                        rounded-xl
                      "
                    >

                      <span
                        className="
                          text-sm
                          text-gray-300
                        "
                      >

                        {
                          theatre.screens?.length || 0
                        }

                        Screens

                      </span>

                    </div>

                  </div>

                  {/* Existing Screens */}

                  {
                    theatre.screens?.length > 0 && (

                      <div
                        className="
                          space-y-3
                        "
                      >

                        {
                          theatre.screens.map(
                            (screen) => (

                              <div
                                key={screen._id}

                                className="
                                  bg-white/5

                                  rounded-2xl

                                  p-4

                                  flex
                                  items-center
                                  justify-between
                                "
                              >

                                <div>

                                  <h3
                                    className="
                                      font-semibold
                                      text-lg
                                    "
                                  >

                                    {
                                      screen.name
                                    }

                                  </h3>

                                  <p
                                    className="
                                      text-gray-400
                                      text-sm
                                    "
                                  >

                                    {
                                      screen.totalSeats
                                    }

                                    Seats

                                  </p>

                                </div>

                                <button
                                  className="
                                    bg-white/10
                                    hover:bg-white/20

                                    transition

                                    px-4
                                    py-2

                                    rounded-xl
                                  "
                                >

                                  Edit

                                </button>

                              </div>

                            )
                          )
                        }

                      </div>

                    )
                  }

                  {/* Create Screen */}

                  <button
                    onClick={() =>
                      navigate(
                        `/theatre-owner/screens/create/${theatre._id}`
                      )
                    }

                    className="
                      w-full

                      bg-pink-600
                      hover:bg-pink-700

                      transition

                      py-4

                      rounded-2xl

                      font-medium
                    "
                  >

                    + Create Screen

                  </button>

                </div>

              </div>

            )
          )
        }

      </div>

    </div>

  );
}

export default ScreenListPage;