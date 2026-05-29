import React, { useEffect, useState } from "react";

import {
  FaBuilding,
  FaDesktop,
  FaFilm,
  FaTicketAlt,
  FaCalendarDay,
} from "react-icons/fa";

import { FaIndianRupeeSign } from "react-icons/fa6";
import { getOwnerDashboard } from "../services/dashboard";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await getOwnerDashboard();

      setDashboard(res.dashboard);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
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
        Loading Dashboard...
      </div>
    );
  }

  const cards = [
    {
      title: "Theatres",
      value: dashboard?.totalTheatres || 0,
      icon: <FaBuilding />,
    },

    {
      title: "Screens",
      value: dashboard?.totalScreens || 0,
      icon: <FaDesktop />,
    },

    {
      title: "Shows",
      value: dashboard?.totalShows || 0,
      icon: <FaFilm />,
    },

    {
      title: "Bookings",
      value: dashboard?.totalBookings || 0,
      icon: <FaTicketAlt />,
    },

    {
      title: "Today's Bookings",
      value: dashboard?.todayBookings || 0,
      icon: <FaCalendarDay />,
    },

    {
      title: "Revenue",
      value: `₹${(dashboard?.totalRevenue || 0).toLocaleString()}`,
      icon: <FaIndianRupeeSign />,
    },
  ];

  return (
    <div
      className="
        min-h-screen

        bg-black

        text-white

        p-6
      "
    >
      <div
        className="
          mb-10
        "
      >
        <h1
          className="
            text-4xl

            font-black
          "
        >
          Dashboard
        </h1>

        <p
          className="
            text-gray-400

            mt-2
          "
        >
          Welcome back, manage your theatres and track performance.
        </p>
      </div>

      <div
        className="
          grid

          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-3

          gap-6
        "
      >
        {cards.map((card, index) => (
          <div
            key={index}
            className="
                bg-[#111]

                border
                border-pink-500/20

                rounded-3xl

                p-6

                hover:border-pink-500/60

                transition-all
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
                  {card.title}
                </p>

                <h2
                  className="
                      text-4xl

                      font-black

                      mt-3
                    "
                >
                  {card.value}
                </h2>
              </div>

              <div
                className="
                    w-16
                    h-16

                    rounded-2xl

                    bg-pink-500/10

                    text-pink-400

                    text-2xl

                    flex

                    items-center

                    justify-center
                  "
              >
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        className="
          grid

          lg:grid-cols-2

          gap-6

          mt-8
        "
      >
        <div
          className="
            bg-[#111]

            border
            border-white/10

            rounded-3xl

            p-6
          "
        >
          <h2
            className="
              text-2xl

              font-bold

              mb-6
            "
          >
            Quick Overview
          </h2>

          <div
            className="
              space-y-4
            "
          >
            <div
              className="
                flex
                justify-between
              "
            >
              <span>Active Shows</span>

              <span
                className="
                  text-pink-400
                "
              >
                {dashboard?.totalShows}
              </span>
            </div>

            <div
              className="
                flex
                justify-between
              "
            >
              <span>Total Screens</span>

              <span
                className="
                  text-pink-400
                "
              >
                {dashboard?.totalScreens}
              </span>
            </div>

            <div
              className="
                flex
                justify-between
              "
            >
              <span>Confirmed Bookings</span>

              <span
                className="
                  text-green-400
                "
              >
                {dashboard?.totalBookings}
              </span>
            </div>
          </div>
        </div>

        <div
          className="
            bg-[#111]

            border
            border-white/10

            rounded-3xl

            p-6
          "
        >
          <h2
            className="
              text-2xl

              font-bold

              mb-6
            "
          >
            Revenue Summary
          </h2>

          <div
            className="
              flex

              flex-col

              items-center

              justify-center

              h-[180px]
            "
          >
            <h3
              className="
                text-5xl

                font-black

                text-pink-400
              "
            >
              ₹{(dashboard?.totalRevenue || 0).toLocaleString()}
            </h3>

            <p
              className="
                text-gray-400

                mt-3
              "
            >
              Total Revenue
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
