import React, { useState } from "react";

import {
  Outlet,
  NavLink,
} from "react-router-dom";

import {
  useSelector,
} from "react-redux";

import {
  FaBars,
  FaTimes,
} from "react-icons/fa";

function TheatreOwnerLayout() {

  const { user } =
    useSelector(
      (state) => state.auth
    );

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const status =
    user?.status || "pending";

  const isPending =
    status === "pending";

  const isRejected =
    status === "rejected";

  const isApproved =
    status === "approved";

  const navItems = [
    {
      name: "Dashboard",
      path: "/theatre-owner",
    },

    {
      name: "Theatre",
      path: "/theatre-owner/theatre",
    },

    {
      name: "Screens",
      path: "/theatre-owner/screens",
    },

    {
      name: "Shows",
      path: "/theatre-owner/shows",
    },

    {
      name: "Bookings",
      path: "/theatre-owner/bookings",
    },
  ];

  return (
    <div
      className="
        h-screen
        bg-black
        text-white
        flex
        overflow-hidden
      "
    >

      {
        sidebarOpen && (
          <div
            onClick={() =>
              setSidebarOpen(false)
            }
            className="
              fixed
              inset-0
              bg-black/50
              z-40
              lg:hidden
            "
          />
        )
      }

      <aside
        className={`
          fixed lg:static
          top-0 left-0

          h-full
          w-[240px]

          bg-[#111111]

          border-r
          border-white/10

          z-50

          transform
          transition-transform
          duration-300

          flex
          flex-col

          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >

        <div
          className="
            px-6
            py-6

            border-b
            border-white/10

            flex
            items-center
            justify-between
          "
        >

          <div>

            <h1
              className="
                text-3xl
                font-bold
                text-pink-500
              "
            >

              CineXpress

            </h1>

            <p
              className="
                text-sm
                text-gray-500
                mt-1
              "
            >

              Theatre Owner Panel

            </p>

          </div>

          <button
            onClick={() =>
              setSidebarOpen(false)
            }
            className="
              lg:hidden
            "
          >

            <FaTimes size={22} />

          </button>

        </div>

        <div
          className="
            px-6
            py-5

            border-b
            border-white/10
          "
        >

          <h2
            className="
              text-lg
              font-semibold
              truncate
            "
          >

            {user?.name}

          </h2>

          <p
            className="
              text-sm
              text-gray-500
              truncate
            "
          >

            {user?.email}

          </p>

        </div>

        {
          isPending && (

            <div
              className="
                mx-4
                mt-4

                bg-yellow-500/10
                text-yellow-400

                rounded-xl

                px-4
                py-3

                text-sm
              "
            >

              Pending Approval

            </div>

          )
        }

        {
          isRejected && (

            <div
              className="
                mx-4
                mt-4

                bg-red-500/10
                text-red-400

                rounded-xl

                px-4
                py-3

                text-sm
              "
            >

              Request Rejected

            </div>

          )
        }

        <nav
          className="
            flex-1

            px-4
            py-6

            space-y-2
          "
        >

          {
            navItems.map((item) => (

              <NavLink
                key={item.path}

                to={item.path}

                end={
                  item.path ===
                  "/theatre-owner"
                }

                onClick={() =>
                  setSidebarOpen(false)
                }

                className={({
                  isActive,
                }) => `
                  
                  block

                  px-4
                  py-3

                  rounded-xl

                  text-sm

                  transition

                  ${
                    isActive

                      ? "bg-pink-600 text-white"

                      : "text-gray-300 hover:bg-white/5"
                  }

                  ${
                    !isApproved

                      ? "opacity-20 pointer-events-none"

                      : ""
                  }
                `}
              >

                {item.name}

              </NavLink>

            ))
          }

        </nav>

      </aside>

      <main
        className="
          flex-1
          min-w-0
          overflow-y-auto
          scrollbar-hide
        "
      >

        <div
          className="
            lg:hidden

            flex
            items-center
            justify-between

            px-4
            py-4

            border-b
            border-white/10

            bg-[#111111]
          "
        >

          <button
            onClick={() =>
              setSidebarOpen(true)
            }
          >

            <FaBars size={24} />

          </button>

          <h1
            className="
              text-xl
              font-bold
            "
          >

            Theatre Owner

          </h1>

          <div className="w-[24px]" />

        </div>

        <div
          className="
            p-4 md:p-6
          "
        >

          <div
            className={`

              ${
                isPending ||
                isRejected

                  ? "opacity-20 pointer-events-none"

                  : ""
              }
            `}
          >

            <Outlet />

          </div>

        </div>

      </main>

    </div>
  );
}

export default TheatreOwnerLayout;