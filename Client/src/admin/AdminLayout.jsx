import React, { useEffect, useState } from "react";
import {
  FaFilm,
  FaUsers,
  FaCog,
  FaTicketAlt,
  FaTv,
  FaThLarge,
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

  const currentPage = location.pathname.split("/")[2] || "theatre";
  const { user } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  useEffect(() => {
    fetchNotificationCount();
  }, []);

  const fetchNotificationCount = async () => {
    try {
      const res = await getUnreadNotificationCount();

      setNotificationCount(res.count || 0);
    } catch (error) {
      console.log(error);
    }
  };

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

  return (
    <div className="flex h-screen bg-[#0f0f0f] text-white font-[Poppins] overflow-hidden">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed md:static top-0 left-0 z-50
          h-screen w-[260px]
          bg-[#1a1a1a]
          p-6
          flex flex-col
          shadow-2xl
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-xl font-bold text-[#8b5c76]">🎬 Admin Panel</h1>

          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <FaTimes className="text-xl" />
          </button>
        </div>

        <nav className="space-y-3">
          {menu.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              end={item.path === "/admin"}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group
                ${
                  isActive
                    ? "bg-[#8b5c76]/20 text-[#8b5c76]"
                    : "hover:bg-[#252525] text-gray-300"
                }`
              }
            >
              <span className="group-hover:scale-110 transition">
                {item.icon}
              </span>

              <span className="text-sm">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto text-xs text-gray-500">© 2026 Admin Panel</div>
      </aside>

      <div className="flex-1 flex flex-col w-full overflow-hidden">
        <header className="h-[70px] bg-[#1a1a1a] flex items-center justify-between px-4 md:px-6 shadow-md">
          <div className="flex items-center gap-4">
            <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
              <FaBars className="text-xl" />
            </button>

            <h2 className="text-lg md:text-xl font-semibold capitalize">
              {currentPage}
            </h2>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <div
              className="relative cursor-pointer"
              onClick={() => navigate("notification")}
            >
              <FaBell className="text-gray-300 text-lg hover:text-white transition" />

              {notificationCount > 0 && (
                <span
                  className="
                      absolute
                
                      -top-2
                      -right-2
                
                      bg-[#8b5c76]
                
                      text-[10px]
                
                      min-w-[20px]
                      h-5
                
                      px-1
                
                      rounded-full
                
                      flex
                      items-center
                      justify-center
                    "
                >
                  {notificationCount}
                </span>
              )}
            </div>

            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigate("/profile")}
            >
              <img
                src={
                  user?.avatar ||
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjtHioeP3798yMa6QIJsA3piLZlDdOMuA17Q&s"
                }
                className="w-9 h-9 rounded-full border border-gray-600 object-cover"
              />

              <span className="hidden sm:block text-sm text-gray-300">
                {user.name}
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
