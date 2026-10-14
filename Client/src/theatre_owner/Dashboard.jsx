import React, { useEffect, useState } from "react";
import {
  FaBuilding,
  FaDesktop,
  FaFilm,
  FaTicketAlt,
  FaCalendarDay,
  FaArrowUp,
  FaChartLine,
} from "react-icons/fa";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { getOwnerDashboard } from "../services/dashboard";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await getOwnerDashboard();
        setDashboard(res.dashboard);
      } catch (err) {
        console.error(err);
        setError("Unable to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#080808] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-red-500" />
          <p className="text-sm text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-center">
        <p className="text-sm text-red-400">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const totalRevenue = dashboard?.totalRevenue || 0;

  const cards = [
    {
      title: "Theatres",
      value: dashboard?.totalTheatres || 0,
      icon: FaBuilding,
      description: "Registered theatres",
    },
    {
      title: "Screens",
      value: dashboard?.totalScreens || 0,
      icon: FaDesktop,
      description: "Total screens",
    },
    {
      title: "Shows",
      value: dashboard?.totalShows || 0,
      icon: FaFilm,
      description: "Scheduled shows",
    },
    {
      title: "Bookings",
      value: dashboard?.totalBookings || 0,
      icon: FaTicketAlt,
      description: "Total bookings",
    },
    {
      title: "Today's Bookings",
      value: dashboard?.todayBookings || 0,
      icon: FaCalendarDay,
      description: "Bookings today",
    },
    {
      title: "Revenue",
      value: `₹${totalRevenue.toLocaleString("en-IN")}`,
      icon: FaIndianRupeeSign,
      description: "Total revenue",
    },
  ];

  return (
    <div className="min-h-full bg-[#080808] p-4 text-white sm:p-6 lg:p-8">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-red-500">
            Theatre management
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Dashboard<span className="text-red-500">.</span>
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Welcome back! Manage your theatres and track performance.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start rounded-full border border-green-500/20 bg-green-500/[0.06] px-4 py-2 sm:self-auto">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          <span className="text-xs font-medium text-green-400">
            Dashboard overview
          </span>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111111] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-red-500/40 hover:bg-[#141414] sm:p-6"
            >
              <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-red-600/[0.04] blur-2xl transition-all duration-300 group-hover:bg-red-600/10" />

              <div className="relative flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-400">
                    {card.title}
                  </p>

                  <h2 className="mt-4 break-words text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                    {card.value}
                  </h2>

                  <p className="mt-3 text-xs text-gray-500">
                    {card.description}
                  </p>
                </div>

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-red-500/15 bg-red-600/10 text-xl text-red-500 transition duration-300 group-hover:border-red-500/30 group-hover:bg-red-600 group-hover:text-white">
                  <Icon />
                </div>
              </div>

              <div className="mt-5 h-1 overflow-hidden rounded-full bg-white/[0.04]">
                <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-red-700 to-red-500 opacity-60 transition-all duration-300 group-hover:w-2/3 group-hover:opacity-100" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <section className="rounded-2xl border border-white/[0.08] bg-[#111111] p-5 sm:p-7">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600/10 text-red-500">
              <FaChartLine />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Quick Overview
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                Your theatre activity at a glance
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between gap-4 rounded-xl px-3 py-4 transition hover:bg-white/[0.03]">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                <span className="text-sm text-gray-300">Active Shows</span>
              </div>
              <span className="font-bold tabular-nums text-red-400">
                {dashboard?.totalShows || 0}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-xl px-3 py-4 transition hover:bg-white/[0.03]">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                <span className="text-sm text-gray-300">Total Screens</span>
              </div>
              <span className="font-bold tabular-nums text-red-400">
                {dashboard?.totalScreens || 0}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-xl px-3 py-4 transition hover:bg-white/[0.03]">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-sm text-gray-300">
                  Confirmed Bookings
                </span>
              </div>
              <span className="font-bold tabular-nums text-green-400">
                {dashboard?.totalBookings || 0}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-xl px-3 py-4 transition hover:bg-white/[0.03]">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                <span className="text-sm text-gray-300">
                  Today's Bookings
                </span>
              </div>
              <span className="font-bold tabular-nums text-red-400">
                {dashboard?.todayBookings || 0}
              </span>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden rounded-2xl border border-red-500/20 bg-gradient-to-br from-[#171010] via-[#111111] to-[#0b0b0b] p-5 sm:p-7">
          <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-red-600/[0.08] blur-3xl" />

          <div className="relative">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600/15 text-red-400">
                <FaIndianRupeeSign />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">
                  Revenue Summary
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Overall revenue overview
                </p>
              </div>
            </div>

            <div className="flex min-h-[190px] flex-col justify-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                Total Revenue
              </p>

              <h3 className="break-words text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                <span className="mr-1 text-red-500">₹</span>
                {totalRevenue.toLocaleString("en-IN")}
              </h3>

              <div className="mt-6 flex items-center gap-2 text-xs text-gray-500">
                <FaArrowUp className="text-red-500" />
                <span>Revenue recorded across your bookings</span>
              </div>
            </div>

            <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/[0.05]">
              <div className="h-full w-full rounded-full bg-gradient-to-r from-red-800 via-red-600 to-red-400" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;