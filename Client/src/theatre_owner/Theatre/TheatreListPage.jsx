import React, {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {

  getTheatreByOwner,
  deleteTheatre

} from "../../services/theatreApi";

function TheatreListPage() {

  const navigate =
    useNavigate();

  const [theatres,
    setTheatres] =
    useState([]);

  const [loading,
    setLoading] =
    useState(false);


  const fetchTheatres =
    async () => {

      try {

        setLoading(true);

        const res =
          await getTheatreByOwner();

        setTheatres(
          res.theatres || []
        );

      } catch (error) {
        setTheatres([])

      } finally {

        setLoading(false);

      }

    };

  useEffect(() => {

    fetchTheatres();

  }, []);


  const handleDelete =
    async (id) => {

      try {

        await deleteTheatre(id);

        fetchTheatres();

      } catch (error) {

        console.log(error);

      }

    };

  return (

    <div
      className="
        p-6
        lg:p-8

        space-y-10
      "
    >


      <div
        className="
          flex
          flex-col
          lg:flex-row

          lg:items-center
          lg:justify-between

          gap-5
        "
      >

        <div>

          <h1
            className="
              text-4xl
              font-bold
            "
          >

            My Theatres

          </h1>

          <p
            className="
              text-gray-400

              mt-2
            "
          >

            Manage your cinema
            theatres, screens,
            and settings

          </p>

        </div>

      </div>


      {
        loading && (

          <div
            className="
              text-center
              py-20

              text-gray-400
            "
          >

            Loading theatres...

          </div>

        )
      }


      {
        !loading &&
        theatres.length === 0 && (

          <div
            className="
              bg-[#181818]

              border
              border-white/10

              rounded-3xl

              p-16

              text-center
            "
          >

            <h2
              className="
                text-2xl
                font-semibold
              "
            >

              No Theatres Found

            </h2>

            <p
              className="
                text-gray-400

                mt-3
              "
            >

              Create your first
              theatre to get started

            </p>

          </div>

        )
      }

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
                key={
                  theatre._id
                }

                className="
                  bg-[#181818]

                  rounded-3xl

                  overflow-hidden

                  border
                  border-white/10
                "
              >


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

                      h-[300px]

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


                <div
                  className="
                    p-6

                    space-y-6
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


                  {
                    theatre.gallery
                      ?.length > 0 && (

                      <div>

                        <h3
                          className="
                            mb-4

                            font-semibold

                            text-lg
                          "
                        >

                          Gallery

                        </h3>

                        <div
                          className="
                            grid
                            grid-cols-2
                            md:grid-cols-3

                            gap-3
                          "
                        >

                          {
                            theatre.gallery.map(

                              (
                                img,
                                index
                              ) => (

                                <img
                                  key={
                                    index
                                  }

                                  src={img}

                                  alt=""

                                  className="
                                    h-[110px]
                                    w-full

                                    object-cover

                                    rounded-2xl
                                  "
                                />

                              )

                            )
                          }

                        </div>

                      </div>

                    )
                  }

                  <div
                    className="
                      flex
                      flex-col
                      lg:flex-row

                      lg:items-center
                      lg:justify-between

                      gap-5
                    "
                  >


                    <div
                      className={`
                        w-fit

                        px-4
                        py-2

                        rounded-full

                        text-sm

                        ${
                          theatre.status ===
                          "approved"

                            ? `
                              bg-green-500/10
                              text-green-400
                            `

                            : theatre.status ===
                              "rejected"

                            ? `
                              bg-red-500/10
                              text-red-400
                            `

                            : `
                              bg-yellow-500/10
                              text-yellow-400
                            `
                        }
                      `}
                    >

                      {
                        theatre.status
                      }

                    </div>


                    <div
                      className="
                        flex
                        flex-wrap

                        gap-3
                      "
                    >


                      {
                        theatre.status ===
                        "approved" && (

                          <button
                            onClick={() =>
                              navigate(
                                `/theatre-owner/screens/create/${theatre._id}`
                              )
                            }

                            className="
                              bg-green-600
                              hover:bg-green-700

                              transition

                              px-5
                              py-2

                              rounded-xl
                            "
                          >

                            Add Screens

                          </button>

                        )
                      }


                      <button
                        onClick={() =>
                          navigate(
                            `/theatre-owner/theatre/edit/${theatre._id}`
                          )
                        }

                        className="
                          bg-white/10
                          hover:bg-white/20

                          transition

                          px-5
                          py-2

                          rounded-xl
                        "
                      >

                        Edit

                      </button>

                      <button
                        onClick={() =>
                          handleDelete(
                            theatre._id
                          )
                        }

                        className="
                          bg-red-500/10
                          hover:bg-red-500/20

                          text-red-400

                          transition

                          px-5
                          py-2

                          rounded-xl
                        "
                      >

                        Delete

                      </button>

                    </div>

                  </div>

                </div>

              </div>

            )
          )
        }

      </div>

    </div>

  );
}

export default TheatreListPage;