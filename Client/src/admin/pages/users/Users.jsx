import React, {
  useEffect,
  useState,
} from "react";

import {
  FaUser,
  FaUserShield,
  FaEye,
  FaTrash,
  FaSearch,
  FaLock,
  FaLockOpen,
} from "react-icons/fa";

import {
  useNavigate,
} from "react-router-dom";
import { blockUser, deleteUser, getAllUsers } from "../../../services/usersAPi";

function Users() {

  const navigate =
    useNavigate();

  const [users, setUsers] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [activeRole, setActiveRole] =
    useState("user");

  const [activeStatus, setActiveStatus] =
    useState("all");

  const [page, setPage] =
    useState(1);

  const [totalPages, setTotalPages] =
    useState(1);

  const fetchUsers =
    async (
      role = "user",
      status = "all",
      name = "",
      currentPage = 1
    ) => {

      try {

        setLoading(true);

        setError("");

        let query = [];

        query.push(
          `role=${role}`
        );

        if (
          status &&
          status !== "all"
        ) {

          query.push(
            `status=${status}`
          );
        }

        if (name.trim()) {

          query.push(
            `name=${name}`
          );
        }

        query.push(
          `page=${currentPage}`
        );

        query.push(
          "limit=8"
        );

        const queryString =
          `?${query.join("&")}`;

        const res =
          await getAllUsers(queryString);

        if (!res.success) {

          setError(
            res.message
          );

          return;
        }

        setUsers(
          res.users || []
        );

        setTotalPages(
          res.totalPages || 1
        );

        setPage(
          res.currentPage || 1
        );

      } catch (error) {

        setError(
          error?.message ||
          "Failed to fetch users"
        );

      } finally {

        setLoading(false);
      }
    };

  useEffect(() => {

    const timer =
      setTimeout(() => {

        fetchUsers(
          activeRole,
          activeStatus,
          search,
          page
        );

      }, 500);

    return () =>
      clearTimeout(timer);

  }, [
    search,
    activeRole,
    activeStatus,
    page
  ]);


  const handleDelete =
    async (id) => {

      try {

        const res =
          await deleteUser(id);

        if (!res.success) {

          setError(
            res.message
          );

          return;
        }

        fetchUsers(
          activeRole,
          activeStatus,
          search,
          page
        );

      } catch (error) {

        setError(
          error?.message ||
          "Failed to delete user"
        );
      }
    };

  const handleBlock =
    async (
      id,
      isBlocked
    ) => {

      try {

        const res =
          await blockUser(
            id,
            {
              block:
                isBlocked
            }
          );

        if (!res.success) {

          setError(
            res.message
          );

          return;
        }

        fetchUsers(
          activeRole,
          activeStatus,
          search,
          page
        );

      } catch (error) {

        setError(
          error?.message ||
          "Failed to update user"
        );
      }
    };

  const normalUserStatus =
    [
      "all",
      "active",
      "blocked"
    ];

  const theatreStatus =
    [
      "all",
      "active",
      "pending",
      "rejected"
    ];

  return (
    <div className="w-full">

      <div
        className="
          flex flex-col
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
              text-3xl
              font-bold
            "
          >
            Users 👥
          </h1>

          <p
            className="
              text-gray-400
              mt-2
            "
          >
            Manage users and
            theatre admins
          </p>

        </div>

      </div>

      {/* ROLE FILTER */}
      <div
        className="
          flex flex-wrap
          gap-3
          mb-6
        "
      >

        {[
          {
            label:
              "Normal Users",

            value:
              "user",

            icon:
              <FaUser />
          },

          {
            label:
              "Theatre Admin",

            value:
              "theatre_owner",

            icon:
              <FaUserShield />
          }

        ].map((item) => (

          <button
            key={item.value}
            onClick={() => {
            
              setPage(1);
            
              setActiveRole(
                item.value
              );
            
              setActiveStatus(
                "all"
              );
            }}
            className={`
              flex items-center
              gap-2
              px-5 py-3
              rounded-xl
              border
              transition

              ${
                activeRole ===
                item.value

                  ? `
                    bg-gradient-to-r
                    from-[#8b5c76]
                    to-[#6f4660]
                    border-[#8b5c76]
                  `

                  : `
                    bg-[#1a1a1a]
                    border-gray-800
                    hover:border-[#8b5c76]
                  `
              }
            `}
          >

            {item.icon}

            {item.label}

          </button>
        ))}

      </div>

      <div
        className="
          flex flex-wrap
          gap-3
          mb-8
        "
      >

        {(activeRole ===
        "user"

          ? normalUserStatus

          : theatreStatus

        ).map((status) => (

          <button
            key={status}
            onClick={() => {
            
              setPage(1);
            
              setActiveStatus(
                status
              );
            }}
            className={`
              px-5 py-3
              rounded-xl
              border
              capitalize
              transition

              ${
                activeStatus ===
                status

                  ? `
                    bg-gradient-to-r
                    from-[#8b5c76]
                    to-[#6f4660]
                    border-[#8b5c76]
                  `

                  : `
                    bg-[#1a1a1a]
                    border-gray-800
                    hover:border-[#8b5c76]
                  `
              }
            `}
          >

            {status}

          </button>
        ))}

      </div>

      <div className="mb-8">

        <div className="relative">

          <FaSearch
            className="
              absolute
              left-4 top-1/2
              -translate-y-1/2
              text-gray-500
            "
          />

          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="
              w-full
              bg-[#1a1a1a]
              border border-gray-800
              rounded-2xl
              pl-12 pr-4 py-4
              outline-none
              focus:border-[#8b5c76]
            "
          />

        </div>

      </div>

      {error && (

        <div
          className="
            bg-red-500/10
            border border-red-500/30
            rounded-2xl
            p-5
            text-center
            mb-6
          "
        >

          {error}

        </div>
      )}

      {!loading &&
        users.length > 0 && (

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-3
            gap-6
          "
        >

          {users.map((user) => (

            <div
              key={user._id}
              className="
                bg-[#1a1a1a]
                border border-gray-800
                rounded-3xl
                p-6
                hover:border-[#8b5c76]
                transition
              "
            >

              <div
                className="
                  flex flex-col
                  items-center
                  text-center
                "
              >

                <img
                  src={
                    user.avatar ||
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThZwd0Ar5WsR1Z-ylhArKLTDqEhKPlMqWvZw&s"
                  }
                  alt={user.name ? `${user.name}'s avatar` : "User avatar"}
                  className="
                    w-24 h-24
                    rounded-full
                    object-cover
                    border-4
                    border-[#8b5c76]/30
                  "
                />

                <h2
                  className="
                    text-xl
                    font-bold
                    mt-4
                  "
                >
                  {user.name}
                </h2>

                <p
                  className="
                    text-gray-400
                    text-sm
                    mt-1
                  "
                >
                  {user.email}
                </p>

                <span
                  className={`
                    mt-4
                    px-4 py-2
                    rounded-full
                    text-xs
                    capitalize

                    ${
                      user.status ===
                      "blocked"

                        ? `
                          bg-red-500/20
                          text-red-400
                        `

                        : `
                          bg-green-500/20
                          text-green-400
                        `
                    }
                  `}
                >

                  {user.status}

                </span>

              </div>

              {/* THEATRE DETAILS */}
              {
                user.role ===
                "theatre_owner" && (

                  <div
                    className="
                      mt-5
                      space-y-2
                    "
                  >

                    <div
                      className="
                        flex
                        justify-between
                        text-sm
                      "
                    >

                      <span className="text-gray-400">
                        Business
                      </span>

                      <span>
                        {
                          user
                            .ownerDetails
                            ?.businessName || "-"
                        }
                      </span>

                    </div>

                  </div>
                )
              }

              <div
                className="
                  grid
                  grid-cols-3
                  gap-3
                  mt-6
                "
              >

                {
                  user.role ===
                  "theatre_owner" && (

                    <button
                      onClick={() =>
                        navigate(
                          `/admin/users/${user._id}`
                        )
                      }
                      className="
                        py-3
                        rounded-xl
                        bg-[#252525]
                        hover:bg-[#333]
                        transition
                        flex items-center
                        justify-center
                        gap-2
                      "
                    >

                      <FaEye />

                    </button>
                  )
                }

                <button
                  onClick={() =>
                    handleBlock(
                      user._id,
                      user.status !==
                      "blocked"
                    )
                  }
                  className={`
                    py-3
                    rounded-xl
                    transition
                    flex items-center
                    justify-center

                    ${
                      user.status ===
                      "blocked"

                        ? `
                          bg-green-500/10
                          text-green-400
                        `

                        : `
                          bg-yellow-500/10
                          text-yellow-400
                        `
                    }
                  `}
                >

                  {
                    user.status ===
                    "blocked"

                      ? <FaLockOpen />

                      : <FaLock />
                  }

                </button>

                <button
                  onClick={() =>
                    handleDelete(
                      user._id
                    )
                  }
                  className="
                    py-3
                    rounded-xl
                    bg-red-500/10
                    text-red-400
                    hover:bg-red-500
                    hover:text-white
                    transition
                    flex items-center
                    justify-center
                  "
                >

                  <FaTrash />

                </button>

              </div>

            </div>
          ))}

        </div>
      )}

      {!loading &&
        !users.length &&
        !error && (

        <div
          className="
            min-h-[60vh]
            flex
            items-center
            justify-center
          "
        >

          <div className="text-center">

            <div className="text-6xl">
              👥
            </div>

            <h2
              className="
                text-3xl
                font-bold
                mt-5
              "
            >
              No Users Found
            </h2>

          </div>

        </div>
      )}

      {/* PAGINATION */}
      {
        totalPages > 1 && (

          <div
            className="
              flex items-center
              justify-center
              gap-3
              mt-12
              flex-wrap
            "
          >

            <button
              disabled={page === 1}
              onClick={() =>
                fetchUsers(
                  activeRole,
                  activeStatus,
                  search,
                  page - 1
                )
              }
              className="
                px-5 py-3
                rounded-xl
                bg-[#1a1a1a]
                border border-gray-800
                disabled:opacity-40
              "
            >

              Prev

            </button>

            {[...Array(totalPages)]
              .map((_, index) => {

                const pageNumber =
                  index + 1;

                return (

                  <button
                    key={pageNumber}
                    onClick={() =>
                      fetchUsers(
                        activeRole,
                        activeStatus,
                        search,
                        pageNumber
                      )
                    }
                    className={`
                      w-12 h-12
                      rounded-xl
                      border

                      ${
                        page ===
                        pageNumber

                          ? `
                            bg-gradient-to-r
                            from-[#8b5c76]
                            to-[#6f4660]
                            border-[#8b5c76]
                          `

                          : `
                            bg-[#1a1a1a]
                            border-gray-800
                          `
                      }
                    `}
                  >

                    {pageNumber}

                  </button>
                );
              })}

            <button
              disabled={
                page ===
                totalPages
              }
              onClick={() =>
                fetchUsers(
                  activeRole,
                  activeStatus,
                  search,
                  page + 1
                )
              }
              className="
                px-5 py-3
                rounded-xl
                bg-[#1a1a1a]
                border border-gray-800
                disabled:opacity-40
              "
            >

              Next

            </button>

          </div>
        )
      }

    </div>
  );
}

export default Users;