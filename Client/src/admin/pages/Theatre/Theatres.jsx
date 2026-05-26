import React, {
  useEffect,
  useState,
} from "react";

import {
  FaTrash,
  FaPlus,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
} from "react-icons/fa";

import { useNavigate }
from "react-router-dom";

import {
  deleteTheatre,
  getAllTheatres,
} from "../../../services/theatreApi";

function Theatres() {

  const navigate =
    useNavigate();

  const [theatres,
    setTheatres] =
    useState([]);

  const [loading,
    setLoading] =
    useState(false);

  const [error,
    setError] =
    useState("");

  const [activeFilter,
    setActiveFilter] =
    useState("all");

  const [search,
    setSearch] =
    useState("");

  const [showDeleteModal,
    setShowDeleteModal] =
    useState(false);

  const [selectedTheatre,
    setSelectedTheatre] =
    useState(null);

  useEffect(() => {

    fetchTheatres("all");

  }, []);

  useEffect(() => {

    const timer =
      setTimeout(() => {

        fetchTheatres(
          activeFilter,
          search
        );

      }, 500);

    return () =>
      clearTimeout(timer);

  }, [

    search,

    activeFilter,
  ]);

  const fetchTheatres =
    async (

      status = "all",

      searchValue = ""

    ) => {

      try {

        setLoading(true);

        setError("");

        let query = [];

        if (
          status &&
          status !== "all"
        ) {

          query.push(

            `status=${status}`
          );
        }

        if (
          searchValue.trim()
        ) {

          query.push(

            `search=${searchValue}`
          );
        }

        const queryString =

          `?${query.join("&")}`;

        const res =
          await getAllTheatres(
            queryString
          );

        if (!res.success) {

          setError(
            res.message
          );

          return;
        }

        setTheatres(
          res.theatres || []
        );

      } catch (error) {

        setError(

          error?.message ||

          "Failed to fetch theatres"
        );

      } finally {

        setLoading(false);
      }
    };

  const handleDelete =
    async (id) => {

      try {

        const res =
          await deleteTheatre(
            id
          );

        if (!res.success) {

          setError(
            res.message
          );

          return;
        }

        fetchTheatres();

      } catch (error) {

        setError(

          error?.message ||

          "Failed to delete theatre"
        );
      }
    };

  return (

    <div className="w-full">

      {/* HEADER */}

      <div
        className="
          flex
          flex-col
          md:flex-row

          md:items-center
          md:justify-between

          gap-4
          mb-8
        "
      >

        <div>

          <h1
            className="
              text-2xl
              md:text-3xl

              font-bold
            "
          >

            Theatres 🎭

          </h1>

          <p
            className="
              text-gray-400
              text-sm
              mt-2
            "
          >

            Manage all theatres here

          </p>

        </div>

        <button
          onClick={() =>

            navigate(
              "/admin/theatre-owner/register"
            )
          }

          className="
            flex
            items-center
            justify-center
            gap-2

            bg-gradient-to-r
            from-[#8b5c76]
            to-[#6f4660]

            px-5
            py-3

            rounded-xl

            font-medium

            hover:opacity-90

            transition

            w-full
            md:w-auto
          "
        >

          <FaPlus />

          Create Theatre

        </button>

      </div>

      {/* ERROR */}

      {
        error && (

          <div
            className="
              w-full

              bg-[#1a1a1a]

              border
              border-red-500/30

              rounded-2xl

              py-14
              px-6

              flex
              flex-col

              items-center
              justify-center

              text-center

              mb-8
            "
          >

            <div
              className="
                w-20
                h-20

                rounded-full

                bg-red-500/10

                flex
                items-center
                justify-center

                text-4xl

                mb-5
              "
            >

              ⚠️

            </div>

            <h2
              className="
                text-2xl
                font-bold
              "
            >

              {error}

            </h2>

          </div>
        )
      }

      {/* SEARCH */}

      <div className="mb-8">

        <input
          type="text"

          placeholder="
            Search theatres...
          "

          value={search}

          onChange={(e) =>

            setSearch(
              e.target.value
            )
          }

          className="
            w-full

            bg-[#1a1a1a]

            border
            border-gray-800

            rounded-2xl

            px-5
            py-4

            outline-none

            focus:border-[#8b5c76]

            transition
          "
        />

      </div>

      {/* FILTERS */}

      <div
        className="
          flex
          flex-wrap

          items-center

          gap-3

          mb-8
        "
      >

        {
          [
            {
              label: "All",
              value: "all",
            },

            {
              label: "Approved",
              value: "approved",
            },

            {
              label: "Pending",
              value: "pending",
            },

            {
              label: "Rejected",
              value: "rejected",
            },
          ].map((item) => (

            <button
              key={item.value}

              onClick={() => {

                setActiveFilter(
                  item.value
                );

                fetchTheatres(
                  item.value,
                  search
                );
              }}

              className={`
                px-5 py-3

                rounded-xl

                text-sm
                font-medium

                transition

                border

                ${
                  activeFilter ===
                  item.value

                    ? `
                      bg-gradient-to-r
                      from-[#8b5c76]
                      to-[#6f4660]

                      border-[#8b5c76]

                      text-white
                    `

                    : `
                      bg-[#1a1a1a]

                      border-gray-800

                      text-gray-300

                      hover:border-[#8b5c76]
                    `
                }
              `}
            >

              {item.label}

            </button>
          ))
        }

      </div>

      {/* GRID */}

      <div
        className={`
          w-full

          ${
            !theatres.length

              ? `
                flex
                items-center
                justify-center

                min-h-[70vh]
              `

              : `
                grid
                grid-cols-1
                md:grid-cols-2
                xl:grid-cols-3

                gap-6
              `
          }
        `}
      >

        {
          theatres.length

            ? (

              theatres.map(
                (theatre) => (

                  <div
                    key={theatre._id}

                    className="
                      bg-[#1a1a1a]

                      rounded-2xl

                      overflow-hidden

                      shadow-2xl

                      border
                      border-gray-800

                      hover:border-[#8b5c76]

                      transition
                    "
                  >

                    {/* IMAGE */}

                    <div
                      className="
                        relative
                      "
                    >

                      {/* STATUS */}

                      <div
                        className={`
                          absolute
                          top-4
                          left-4

                          z-10

                          px-4
                          py-2

                          rounded-xl

                          text-xs
                          font-semibold

                          ${
                            theatre.status ===
                            "approved"

                              ? `
                                bg-green-500
                                text-black
                              `

                              : theatre.status ===
                                "pending"

                                ? `
                                  bg-yellow-500
                                  text-black
                                `

                                : `
                                  bg-red-500
                                  text-white
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
                          absolute
                          top-4
                          right-4
                                            
                          z-10
                                            
                          flex
                          items-center
                                            
                          gap-2
                        "
                      >
                                            
                        {/* EDIT */}
                                            
                        <button
                          onClick={() =>
                          
                            navigate(
                            
                              `/admin/theatres/edit/${theatre._id}`
                            )
                          }
                        
                          className="
                            w-11
                            h-11
                        
                            rounded-xl
                        
                            bg-blue-500/90
                        
                            flex
                            items-center
                            justify-center
                        
                            hover:scale-105
                        
                            transition
                          "
                        >
                        
                          ✏️
                        
                        </button>
                        
                        {/* DELETE */}
                        
                        <button
                          onClick={() => {
                          
                            setSelectedTheatre(
                              theatre
                            );
                          
                            setShowDeleteModal(
                              true
                            );
                          }}
                        
                          className="
                            w-11
                            h-11
                        
                            rounded-xl
                        
                            bg-red-500/90
                        
                            flex
                            items-center
                            justify-center
                        
                            hover:scale-105
                        
                            transition
                          "
                        >
                        
                          <FaTrash />
                        
                        </button>
                        
                      </div>

                      <img
                        src={
                          theatre.bannerImage
                        }

                        alt={
                          theatre.name
                        }

                        className="
                          w-full
                          h-[250px]

                          object-cover
                        "
                      />

                    </div>

                    {/* CONTENT */}

                    <div className="p-5">

                      <h2
                        className="
                          text-xl
                          font-bold

                          line-clamp-1
                        "
                      >

                        {
                          theatre.name
                        }

                      </h2>

                      <div
                        className="
                          mt-5

                          space-y-3

                          text-sm
                          text-gray-400
                        "
                      >

                        {/* OWNER */}

                        <div
                          className="
                            flex
                            items-center
                            justify-between

                            gap-5
                          "
                        >

                          <div
                            className="
                              flex
                              items-center
                              gap-2
                            "
                          >

                            👤 Owner

                          </div>

                          <div
                            className="
                              text-right
                            "
                          >

                            <h3
                              className="
                                text-white
                                text-sm

                                font-medium
                              "
                            >

                              {
                                theatre.ownerId?.name ||

                                "Waiting Registration"
                              }

                            </h3>

                            <p
                              className="
                                text-xs
                                text-gray-500
                              "
                            >

                              {
                                theatre.ownerId?.email ||

                                theatre.ownerEmail ||

                                "-"
                              }

                            </p>

                          </div>

                        </div>

                        {/* SECRET */}

                        {
                          theatre.secretCode && (

                            <div
                              className="
                                flex
                                items-center
                                justify-between

                                gap-5
                              "
                            >

                              <div
                                className="
                                  flex
                                  items-center
                                  gap-2
                                "
                              >

                                🔐 Secret Code

                              </div>

                              <span
                                className="
                                  text-yellow-400
                                  font-bold

                                  tracking-widest
                                "
                              >

                                {
                                  theatre.secretCode
                                }

                              </span>

                            </div>
                          )
                        }

                        {/* CITY */}

                        <div
                          className="
                            flex
                            items-center
                            justify-between

                            gap-5
                          "
                        >

                          <div
                            className="
                              flex
                              items-center
                              gap-2
                            "
                          >

                            <FaMapMarkerAlt />

                            City

                          </div>

                          <span
                            className="
                              text-white
                            "
                          >

                            {
                              theatre.city
                            }

                          </span>

                        </div>

                        {/* STATUS */}

                        <div
                          className="
                            flex
                            items-center
                            justify-between
                          "
                        >

                          <div
                            className="
                              flex
                              items-center
                              gap-2
                            "
                          >

                            {
                              theatre.status ===
                              "approved"

                                ? <FaCheckCircle />

                                : theatre.status ===
                                  "pending"

                                  ? <FaClock />

                                  : <FaTimesCircle />
                            }

                            Status

                          </div>

                          <span
                            className="
                              text-white
                            "
                          >

                            {
                              theatre.status
                            }

                          </span>

                        </div>

                      </div>

                    </div>

                  </div>
                )
              )
            )

            : (

              <div
                className="
                  flex
                  flex-col

                  items-center
                  justify-center

                  py-20

                  text-center
                "
              >

                <h2
                  className="
                    text-2xl
                    font-semibold

                    text-gray-700
                  "
                >

                  No Theatres Found 🎭

                </h2>

                <p
                  className="
                    mt-2
                    text-gray-500
                  "
                >

                  No theatres available

                </p>

              </div>
            )
        }

      </div>

      {/* DELETE MODAL */}

      {
        showDeleteModal && (

          <div
            className="
              fixed
              inset-0

              bg-black/70

              z-50

              flex
              items-center
              justify-center

              px-5
            "
          >

            <div
              className="
                w-full
                max-w-md

                bg-[#1a1a1a]

                border
                border-gray-800

                rounded-3xl

                p-8
              "
            >

              <h2
                className="
                  text-2xl
                  font-bold

                  mb-4
                "
              >

                Delete Theatre?

              </h2>

              <p
                className="
                  text-gray-400
                  leading-7
                "
              >

                Are you sure you want
                to delete

                <span
                  className="
                    text-white
                    font-medium
                  "
                >

                  {" "}
                  {
                    selectedTheatre?.name
                  }

                </span>

                ?

              </p>

              <div
                className="
                  flex
                  items-center
                  justify-end

                  gap-4

                  mt-8
                "
              >

                <button
                  onClick={() => {

                    setShowDeleteModal(
                      false
                    );

                    setSelectedTheatre(
                      null
                    );
                  }}

                  className="
                    px-5
                    py-3

                    rounded-xl

                    bg-gray-800
                  "
                >

                  Cancel

                </button>

                <button
                  onClick={async () => {

                    await handleDelete(

                      selectedTheatre._id
                    );

                    setShowDeleteModal(
                      false
                    );

                    setSelectedTheatre(
                      null
                    );
                  }}

                  className="
                    px-5
                    py-3

                    rounded-xl

                    bg-red-500

                    font-medium
                  "
                >

                  Delete

                </button>

              </div>

            </div>

          </div>
        )
      }

    </div>
  );
}

export default Theatres;