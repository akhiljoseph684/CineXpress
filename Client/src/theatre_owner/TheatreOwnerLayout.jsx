import React from "react";

import {
  Outlet,
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  useSelector,
} from "react-redux";

function TheatreOwnerLayout() {

  const navigate =
    useNavigate();

  const { user } =
    useSelector(
      (state) => state.auth
    );

  const status =
    user?.status || "pending";

  const isPending =
    status === "pending";

  const isRejected =
    status === "rejected";

  const isApproved =
    status === "approved";

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

      <aside
        className="
          hidden
          lg:flex

          flex-col

          w-[240px]

          shrink-0

          bg-[#111111]

          border-r
          border-white/10
        "
      >

        <div
          className="
            px-6
            py-6

            border-b
            border-white/10
          "
        >

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
            [
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
            ].map((item) => (

              <NavLink
                key={item.path}

                to={item.path}

                end={
                  item.path ===
                  "/theatre-owner"
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

        <div
          className="
            p-4

            border-t
            border-white/10
          "
        >

          <button
            onClick={() =>
              navigate("/")
            }

            className="
              w-full

              bg-white/5
              hover:bg-white/10

              transition

              py-3

              rounded-xl

              text-sm
            "
          >

            Back To Home

          </button>

        </div>

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

            flex items-center
            justify-between

            px-4
            py-4

            border-b
            border-white/10

            bg-[#111111]
          "
        >

          <h1
            className="
              text-xl
              font-bold
            "
          >

            Theatre Owner

          </h1>

          <button
            onClick={() =>
              navigate("/")
            }

            className="
              text-sm

              bg-white/10

              px-4
              py-2

              rounded-lg
            "
          >

            Home

          </button>

        </div>

        <div
          className="
            lg:hidden

            px-4
            py-4
          "
        >

          {
            isPending && (

              <div
                className="
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

        </div>

        <div
          className="
            p-4 md:p-6
          "
        >

          <div
            className={`
              bg-[#111111]

              rounded-2xl

              border
              border-white/10

              min-h-[calc(100vh-48px)]

              p-4 md:p-6

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