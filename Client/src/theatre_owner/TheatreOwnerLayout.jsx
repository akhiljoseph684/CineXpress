import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaBars,
  FaTimes,
  FaFilm,
  FaTachometerAlt,
  FaTheaterMasks,
  FaDesktop,
  FaCalendarAlt,
  FaTicketAlt,
  FaChevronRight,
  FaUserCircle,
  FaClock,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";

function TheatreOwnerLayout() {
  const { user } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const status = user?.status || "pending";
  const isPending = status === "pending";
  const isRejected = status === "rejected";
  const isApproved = status === "active";

  const navItems = [
    {
      name: "Dashboard",
      path: "/theatre-owner",
      icon: FaTachometerAlt,
      description: "Overview",
    },
    {
      name: "My Theatre",
      path: "/theatre-owner/theatre",
      icon: FaTheaterMasks,
      description: "Theatre details",
    },
    {
      name: "Screens",
      path: "/theatre-owner/screens",
      icon: FaDesktop,
      description: "Manage screens",
    },
    {
      name: "Shows",
      path: "/theatre-owner/shows",
      icon: FaCalendarAlt,
      description: "Movie schedules",
    },
    {
      name: "Bookings",
      path: "/theatre-owner/bookings",
      icon: FaTicketAlt,
      description: "Ticket bookings",
    },
  ];

  const handleProfileClick = () => {
    setSidebarOpen(false);
    navigate("/profile");
  };

  return (
    <div className="flex h-dvh overflow-hidden bg-[#080808] font-[Poppins] text-white">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation overlay"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col border-r border-white/[0.07] bg-[#101010] transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-5">
          <button
            type="button"
            onClick={() => navigate("/theatre-owner")}
            className="flex items-center gap-3 text-left"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-800 shadow-lg shadow-red-900/30">
              <FaFilm className="text-xl text-white" />
            </div>

            <div>
              <h1 className="text-xl font-extrabold tracking-tight">
                Cine<span className="text-red-500">Xpress</span>
              </h1>
              <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.19em] text-gray-500">
                Theatre Partner
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
            className="rounded-lg p-2 text-gray-400 transition hover:bg-white/10 hover:text-white lg:hidden"
          >
            <FaTimes size={18} />
          </button>
        </div>

        <button
          type="button"
          onClick={handleProfileClick}
          className="mx-4 mt-5 flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] p-3 text-left transition hover:border-red-500/30 hover:bg-white/[0.05]"
        >
          <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-red-500/40 bg-[#1a1a1a]">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user?.name || "User avatar"}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-lg font-bold text-red-400">
                {user?.name?.trim()?.charAt(0)?.toUpperCase() || (
                  <FaUserCircle />
                )}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">
              {user?.name || "Theatre Owner"}
            </p>
            <p className="mt-1 truncate text-xs text-gray-500">
              {user?.email || "Manage your profile"}
            </p>
          </div>

          <FaChevronRight className="shrink-0 text-xs text-gray-600" />
        </button>

        <div className="px-5 pb-2 pt-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
            Workspace
          </p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2 scrollbar-hide">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/theatre-owner"}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3 overflow-hidden rounded-xl px-3 py-3 transition-all duration-200 ${
                    isActive
                      ? "bg-red-600/10 text-red-400"
                      : "text-gray-400 hover:bg-white/[0.045] hover:text-white"
                  } ${
                    !isApproved
                      ? "pointer-events-none cursor-not-allowed opacity-40"
                      : ""
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full bg-red-500" />
                    )}

                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition ${
                        isActive
                          ? "bg-red-600 text-white shadow-md shadow-red-900/30"
                          : "bg-white/[0.04] text-gray-400 group-hover:bg-white/[0.08] group-hover:text-white"
                      }`}
                    >
                      <Icon className="text-sm" />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium">
                        {item.name}
                      </span>
                      <span
                        className={`mt-0.5 block text-[10px] ${
                          isActive ? "text-red-400/70" : "text-gray-600"
                        }`}
                      >
                        {item.description}
                      </span>
                    </span>

                    {isActive && (
                      <FaChevronRight className="mr-1 text-[10px] text-red-500" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="px-4 pb-5 pt-3">
          {!isApproved && (
            <div
              className={`rounded-xl border p-3 ${
                isPending
                  ? "border-amber-500/20 bg-amber-500/[0.06]"
                  : isRejected
                    ? "border-red-500/20 bg-red-500/[0.06]"
                    : "border-white/10 bg-white/[0.03]"
              }`}
            >
              <div className="flex items-start gap-2.5">
                {isPending ? (
                  <FaClock className="mt-0.5 shrink-0 text-amber-400" />
                ) : isRejected ? (
                  <FaExclamationCircle className="mt-0.5 shrink-0 text-red-400" />
                ) : (
                  <FaExclamationCircle className="mt-0.5 shrink-0 text-gray-400" />
                )}

                <div>
                  <p
                    className={`text-xs font-semibold ${
                      isPending
                        ? "text-amber-400"
                        : isRejected
                          ? "text-red-400"
                          : "text-gray-300"
                    }`}
                  >
                    {isPending
                      ? "Approval Pending"
                      : isRejected
                        ? "Request Rejected"
                        : "Account Inactive"}
                  </p>

                  <p className="mt-1 text-[10px] leading-4 text-gray-500">
                    {isPending
                      ? "Your account is waiting for administrator approval."
                      : isRejected
                        ? "Contact the administrator for more information."
                        : "Your account does not currently have access."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {isApproved && (
            <div className="flex items-center gap-2 rounded-xl border border-green-500/15 bg-green-500/[0.05] px-3 py-2.5">
              <FaCheckCircle className="text-xs text-green-500" />
              <span className="text-xs font-medium text-green-400">
                Partner account active
              </span>
            </div>
          )}

          <div className="mt-4 border-t border-white/[0.07] pt-4 text-center">
            <p className="text-[10px] text-gray-600">
              © {new Date().getFullYear()} CineXpress
            </p>
            <p className="mt-1 text-[10px] text-gray-700">
              Theatre Management Portal
            </p>
          </div>
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex shrink-0 items-center justify-between border-b border-white/[0.07] bg-[#101010] px-4 py-3.5 sm:px-6 lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
            className="rounded-lg border border-white/10 bg-white/[0.03] p-2.5 text-gray-300 transition hover:border-red-500/40 hover:text-red-400"
          >
            <FaBars size={17} />
          </button>

          <div className="text-center">
            <h2 className="text-sm font-bold">
              Theatre <span className="text-red-500">Owner</span>
            </h2>
            <p className="mt-0.5 text-[10px] text-gray-500">
              CineXpress Dashboard
            </p>
          </div>

          <button
            type="button"
            onClick={handleProfileClick}
            aria-label="Open profile"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600/15 font-bold text-red-400 ring-1 ring-red-500/20"
          >
            {user?.name?.trim()?.charAt(0)?.toUpperCase() || <FaUserCircle />}
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {!isApproved && (
            <div
              className={`mx-4 mt-4 rounded-xl border px-4 py-3 text-sm sm:mx-6 lg:mx-8 ${
                isPending
                  ? "border-amber-500/20 bg-amber-500/[0.06] text-amber-300"
                  : isRejected
                    ? "border-red-500/20 bg-red-500/[0.06] text-red-300"
                    : "border-white/10 bg-white/[0.03] text-gray-300"
              }`}
            >
              {isPending
                ? "Your account is awaiting approval. Dashboard features are temporarily unavailable."
                : isRejected
                  ? "Your registration has been rejected. Please contact the administrator."
                  : "Your account is inactive. Please contact the administrator."}
            </div>
          )}

          <div
            className={`p-4 sm:p-6 lg:p-8 ${
              !isApproved ? "pointer-events-none select-none opacity-40" : ""
            }`}
          >
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}

export default TheatreOwnerLayout;
