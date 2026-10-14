import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaUserShield,
  FaEye,
  FaTrash,
  FaSearch,
  FaLock,
  FaLockOpen,
  FaSpinner,
  FaChevronLeft,
  FaChevronRight,
  FaExclamationCircle,
  FaRedo,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  blockUser,
  deleteUser,
  getAllUsers,
} from "../../../services/usersAPi";

function Users() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeRole, setActiveRole] = useState("user");
  const [activeStatus, setActiveStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(activeRole, activeStatus, search, page);
    }, search ? 500 : 0);

    return () => clearTimeout(timer);
  }, [search, activeRole, activeStatus, page]);

  const fetchUsers = async (
    role = "user",
    status = "all",
    name = "",
    currentPage = 1
  ) => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({
        role,
        page: String(currentPage),
        limit: "8",
      });

      if (status && status !== "all") {
        params.set("status", status);
      }

      if (name.trim()) {
        params.set("name", name.trim());
      }

      const res = await getAllUsers(`?${params.toString()}`);

      if (!res.success) {
        setError(res.message || "Failed to fetch users.");
        setUsers([]);
        return;
      }

      setUsers(res.users || []);
      setTotalPages(res.totalPages || 1);
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch users."
      );
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (role) => {
    setActiveRole(role);
    setActiveStatus("all");
    setPage(1);
  };

  const handleStatusChange = (status) => {
    setActiveStatus(status);
    setPage(1);
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleBlock = async (id, shouldBlock) => {
    try {
      setActionLoading(id);
      setError("");

      const res = await blockUser(id, {
        block: shouldBlock,
      });

      if (!res.success) {
        setError(res.message || "Failed to update user status.");
        return;
      }

      await fetchUsers(activeRole, activeStatus, search, page);
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update user status."
      );
    } finally {
      setActionLoading("");
    }
  };

  const openDeleteModal = (id) => {
    setSelectedUserId(id);
    setShowDeleteModal(true);
    setError("");
  };

  const closeDeleteModal = () => {
    if (actionLoading) return;

    setShowDeleteModal(false);
    setSelectedUserId(null);
  };

  const confirmDelete = async () => {
    if (!selectedUserId || actionLoading) return;

    try {
      setActionLoading(selectedUserId);
      setError("");

      const res = await deleteUser(selectedUserId);

      if (!res.success) {
        setError(res.message || "Failed to delete user.");
        return;
      }

      const remainingUsers = users.filter(
        (user) => user._id !== selectedUserId
      );

      setShowDeleteModal(false);
      setSelectedUserId(null);

      if (remainingUsers.length === 0 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        await fetchUsers(activeRole, activeStatus, search, page);
      }
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to delete user."
      );
    } finally {
      setActionLoading("");
    }
  };

  const normalUserStatus = ["all", "active", "blocked"];
  const theatreStatus = ["all", "active", "blocked"];

  const roles = [
    {
      label: "Normal Users",
      value: "user",
      icon: <FaUser />,
    },
    {
      label: "Theatre Admins",
      value: "theatre_owner",
      icon: <FaUserShield />,
    },
  ];

  const statusOptions =
    activeRole === "user" ? normalUserStatus : theatreStatus;

  return (
    <div className="min-h-screen w-full bg-[#080808] text-white px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-11 h-11 rounded-xl bg-red-600/10 border border-red-500/20 flex items-center justify-center">
                <FaUserShield className="text-red-500 text-xl" />
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Users
              </h1>
            </div>

            <p className="text-white/50 text-sm sm:text-base">
              Manage users and theatre administrators.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          {roles.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => handleRoleChange(item.value)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-medium transition-colors ${
                activeRole === item.value
                  ? "bg-red-600 border-red-600 text-white"
                  : "bg-[#111] border-white/10 text-white/60 hover:text-white hover:border-red-500/50"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          {statusOptions.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => handleStatusChange(status)}
              className={`px-4 sm:px-5 py-2.5 rounded-xl border capitalize text-sm font-medium transition-colors ${
                activeStatus === status
                  ? "bg-red-600/15 border-red-500/50 text-red-400"
                  : "bg-[#111] border-white/10 text-white/60 hover:text-white hover:border-red-500/40"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="mb-6">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />

            <input
              type="text"
              placeholder={
                activeRole === "user"
                  ? "Search users by name..."
                  : "Search theatre admins by name..."
              }
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full bg-[#111] border border-white/10 rounded-xl pl-12 pr-12 py-4 outline-none focus:border-red-500/60 transition-colors placeholder:text-white/30"
            />

            {search && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => handleSearchChange("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                <FaTimes />
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <FaExclamationCircle className="text-red-400 shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>

            <button
              type="button"
              onClick={() =>
                fetchUsers(activeRole, activeStatus, search, page)
              }
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-sm font-medium transition-colors"
            >
              <FaRedo />
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <FaSpinner className="text-red-500 text-4xl animate-spin" />
            <p className="text-white/50 text-sm">Loading users...</p>
          </div>
        ) : users.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {users.map((user) => (
              <div
                key={user._id}
                className="bg-[#111] border border-white/10 rounded-2xl p-5 sm:p-6 hover:border-red-500/30 transition-colors duration-200"
              >
                <div className="flex flex-col items-center text-center">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name ? `${user.name}'s avatar` : "User avatar"}
                      className="w-24 h-24 rounded-full object-cover border-4 border-red-500/20 bg-black"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full border-4 border-red-500/20 bg-black flex items-center justify-center">
                      <FaUser className="text-white/30 text-3xl" />
                    </div>
                  )}

                  <h2 className="text-xl font-bold mt-4 break-words max-w-full">
                    {user.name || "Unnamed User"}
                  </h2>

                  <p className="text-white/50 text-sm mt-1 break-all">
                    {user.email}
                  </p>

                  <span
                    className={`mt-4 px-4 py-2 rounded-full text-xs font-medium capitalize border ${
                      user.status === "blocked"
                        ? "bg-red-500/10 border-red-500/20 text-red-400"
                        : user.status === "pending"
                          ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
                          : user.status === "rejected"
                            ? "bg-white/5 border-white/10 text-white/50"
                            : "bg-green-500/10 border-green-500/20 text-green-400"
                    }`}
                  >
                    {user.status || "active"}
                  </span>
                </div>

                <div className="mt-5 p-3 rounded-xl bg-black/30 border border-white/5">
                  <p className="text-white/40 text-xs uppercase tracking-wider">
                    Role
                  </p>

                  <p className="text-white/80 text-sm mt-1 capitalize">
                    {user.role === "theatre_owner"
                      ? "Theatre Admin"
                      : user.role || "User"}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-5">

                  <button
                    type="button"
                    disabled={actionLoading === user._id}
                    onClick={() =>
                      handleBlock(user._id, user.status !== "blocked")
                    }
                    aria-label={
                      user.status === "blocked" ? "Unblock user" : "Block user"
                    }
                    title={
                      user.status === "blocked" ? "Unblock user" : "Block user"
                    }
                    className={`py-3 rounded-xl transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed ${
                      user.status === "blocked"
                        ? "bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-600 hover:text-white"
                        : "bg-red-600/10 border border-red-500/20 text-red-400 hover:bg-red-600 hover:text-white"
                    }`}
                  >
                    {actionLoading === user._id ? (
                      <FaSpinner className="animate-spin" />
                    ) : user.status === "blocked" ? (
                      <FaLockOpen />
                    ) : (
                      <FaLock />
                    )}
                  </button>

                  <button
                    type="button"
                    disabled={actionLoading === user._id}
                    onClick={() => openDeleteModal(user._id)}
                    aria-label={`Delete ${user.name || "user"}`}
                    title="Delete user"
                    className="py-3 rounded-xl bg-red-600/10 border border-red-500/20 text-red-400 hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center disabled:opacity-50"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : !error ? (
          <div className="min-h-[40vh] bg-[#111] border border-white/10 rounded-2xl flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 rounded-2xl bg-red-600/10 flex items-center justify-center">
              <FaUser className="text-red-500 text-2xl" />
            </div>

            <h2 className="text-2xl font-bold mt-5">No Users Found</h2>

            <p className="text-white/50 text-sm mt-2 max-w-md">
              {search.trim()
                ? "No users match your search. Try a different name."
                : "There are no users in this category."}
            </p>

            {search.trim() && (
              <button
                type="button"
                onClick={() => handleSearchChange("")}
                className="mt-5 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-sm font-medium"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : null}

        {!loading && !error && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 sm:gap-3 mt-10 flex-wrap">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              className="flex items-center gap-2 px-3 sm:px-5 py-3 rounded-xl bg-[#111] border border-white/10 hover:border-red-500/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <FaChevronLeft className="text-xs" />
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1)
              .filter(
                (pageNumber) =>
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  Math.abs(pageNumber - page) <= 1
              )
              .map((pageNumber, index, visiblePages) => (
                <React.Fragment key={pageNumber}>
                  {index > 0 &&
                    visiblePages[index - 1] !== pageNumber - 1 && (
                      <span className="text-white/40 px-1">...</span>
                    )}

                  <button
                    type="button"
                    onClick={() => setPage(pageNumber)}
                    aria-current={page === pageNumber ? "page" : undefined}
                    className={`w-11 h-11 rounded-xl border font-medium transition-colors ${
                      page === pageNumber
                        ? "bg-red-600 border-red-600 text-white"
                        : "bg-[#111] border-white/10 text-white/70 hover:border-red-500/50"
                    }`}
                  >
                    {pageNumber}
                  </button>
                </React.Fragment>
              ))}

            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() =>
                setPage((prev) => Math.min(totalPages, prev + 1))
              }
              className="flex items-center gap-2 px-3 sm:px-5 py-3 rounded-xl bg-[#111] border border-white/10 hover:border-red-500/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next
              <FaChevronRight className="text-xs" />
            </button>
          </div>
        )}
      </div>

      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeDeleteModal();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-user-title"
            className="w-full max-w-md bg-[#111] border border-red-500/20 rounded-2xl p-6 sm:p-8 text-center shadow-2xl"
          >
            <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <FaTrash className="text-red-400 text-2xl" />
            </div>

            <h2 id="delete-user-title" className="text-2xl font-bold mt-5">
              Delete User?
            </h2>

            <p className="text-white/50 text-sm mt-3 leading-6">
              Are you sure you want to delete this user? This action cannot be
              undone.
            </p>

            <div className="flex gap-3 mt-8">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={Boolean(actionLoading)}
                className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                disabled={Boolean(actionLoading)}
                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <FaTrash />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;