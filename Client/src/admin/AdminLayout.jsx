import React, { useEffect, useState } from "react";
import {
  FaFilm,
  FaUsers,
  FaTicketAlt,
  FaTv,
  FaUserTie,
  FaBell,
  FaBars,
  FaTimes,
  FaTags,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { getUnreadNotificationCount } from "../services/notificationApi";

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();
  const currentPage = location.pathname.split("/")[2] || "theatre";
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        const res = await getUnreadNotificationCount();
        setNotificationCount(res.count || 0);
      } catch (error) {
        console.error(error);
      }
    };

    fetchNotificationCount();
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const menu = [
    {
      name: "Theatres",
      path: "/admin/theatre",
      icon: <FaFilm />,
    },
    {
      name: "Screens",
      path: "/admin/screens",
      icon: <FaTv />,
    },
    {
      name: "Shows",
      path: "/admin/shows",
      icon: <FaTicketAlt />,
    },
    {
      name: "Movies",
      path: "/admin/movies",
      icon: <FaFilm />,
    },
    {
      name: "Actors",
      path: "/admin/actors",
      icon: <FaUserTie />,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: <FaUsers />,
    },
    {
      name: "Bookings",
      path: "/admin/bookings",
      icon: <FaTicketAlt />,
    },
    {
      name: "Languages / Genre",
      path: "/admin/categories",
      icon: <FaTags />,
    },
  ];

  const pageTitles = {
    theatre: "Theatres",
    screens: "Screens",
    shows: "Shows",
    movies: "Movies",
    actors: "Actors",
    users: "Users",
    bookings: "Bookings",
    categories: "Languages / Genre",
    notification: "Notifications",
  };

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-[#080808] font-[Poppins] text-white">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-dvh w-[260px] shrink-0 flex-col overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden border-r border-white/[0.06] bg-[#111111] p-5 shadow-2xl transition-transform duration-300 md:static md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-10 flex min-h-12 items-center justify-between gap-3 px-1">
          <h1 className="whitespace-nowrap text-xl font-bold text-red-500">
            🎬 Admin Panel
          </h1>

          <button
            type="button"
            aria-label="Close sidebar"
            className="rounded-lg p-2 text-gray-400 transition hover:bg-white/5 hover:text-white md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <FaTimes className="text-lg" />
          </button>
        </div>

        <nav className="flex flex-col gap-2">
          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `group flex min-h-12 items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-200 ${
                  isActive
                    ? "border-red-500/15 bg-red-500/10 text-red-400"
                    : "border-transparent text-gray-400 hover:bg-white/[0.04] hover:text-white"
                }`
              }
            >
              <span className="shrink-0 text-lg transition-transform group-hover:scale-110">
                {item.icon}
              </span>

              <span className="truncate text-sm font-medium">
                {item.name}
              </span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto shrink-0 border-t border-white/[0.06] pt-5 text-xs text-gray-600">
          © 2026 CineXpress Admin
        </div>
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <header className="relative z-30 flex h-[70px] min-h-[70px] w-full items-center justify-between gap-3 border-b border-white/[0.06] bg-[#111111] px-4 shadow-md sm:px-6">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <button
              type="button"
              aria-label="Open sidebar"
              className="shrink-0 rounded-lg p-2 text-gray-300 transition hover:bg-white/5 hover:text-red-400 md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <FaBars className="text-xl" />
            </button>

            <h2 className="truncate text-lg font-bold capitalize sm:text-xl">
              {pageTitles[currentPage] ||
                currentPage.replace(/-/g, " ")}
            </h2>
          </div>

          <div className="flex shrink-0 items-center gap-3 sm:gap-6">
            <button
              type="button"
              aria-label="View notifications"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl text-gray-400 transition hover:bg-red-500/10 hover:text-red-400"
              onClick={() => {setNotificationCount(0);navigate("/admin/notification")}}
            >
              <FaBell className="text-lg" />

              {notificationCount > 0 && (
                <span className="absolute right-1 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                  {notificationCount > 99 ? "99+" : notificationCount}
                </span>
              )}
            </button>

            <button
              type="button"
              className="flex min-w-0 items-center gap-2 rounded-xl p-1.5 transition hover:bg-white/[0.04] sm:gap-3 sm:px-2"
              onClick={() => navigate("/profile")}
            >
              <img
                src={
                  user?.avatar ||
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjtHioeP3798yMa6QIJsA3piLZlDdOMuA17Q&s"
                }
                alt={user?.name || "User"}
                className="h-9 w-9 shrink-0 rounded-full border border-red-500/30 object-cover"
              />

              <span className="hidden max-w-[150px] truncate text-sm font-medium text-gray-300 sm:block">
                {user?.name || "Admin"}
              </span>
            </button>
          </div>
        </header>

        <main className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto bg-[#080808] p-4 sm:p-5 lg:p-7">
          <div className="w-full min-w-0 max-w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;