import React, { useEffect, useState } from "react";
import {
  FaBell,
  FaSpinner,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { getNotifications } from "../../services/notificationApi";

function NotificationPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchNotifications(currentPage);
  }, [currentPage]);

  const fetchNotifications = async (page = 1) => {
    try {
      setLoading(true);
      setError("");

      const res = await getNotifications(`?page=${page}&limit=10`);

      setNotifications(res.notifications || []);
      setCurrentPage(res.currentPage || page);
      setTotalPages(res.totalPages || 1);
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load notifications"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full min-w-0 max-w-7xl text-white">
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10">
          <FaBell className="text-xl text-red-500" />
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Notifications
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Stay updated with recent activities
          </p>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-[#111111] px-5 py-4">
        <div>
          <p className="text-sm font-medium text-gray-200">
            All Notifications
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Showing up to 10 notifications per page
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
          <FaBell />
        </div>
      </div>

      {error && (
        <div className="mb-6 flex flex-col gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-red-400">{error}</p>
          <button
            type="button"
            onClick={() => fetchNotifications(currentPage)}
            disabled={loading}
            className="rounded-lg border border-red-500/30 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
          >
            Try Again
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex min-h-[35vh] flex-col items-center justify-center gap-4 rounded-2xl border border-white/[0.07] bg-[#111111]">
          <FaSpinner className="animate-spin text-3xl text-red-500" />
          <p className="text-sm text-gray-400">
            Loading notifications...
          </p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex min-h-[35vh] flex-col items-center justify-center rounded-2xl border border-white/[0.07] bg-[#111111] px-6 py-14 text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
            <FaBell className="text-2xl text-red-500" />
          </div>

          <h2 className="text-xl font-semibold text-white">
            No Notifications
          </h2>

          <p className="mt-2 max-w-sm text-sm text-gray-500">
            You are all caught up. New notifications will appear here.
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className="group rounded-2xl border border-white/[0.07] bg-[#111111] p-4 transition duration-200 hover:border-red-500/40 sm:p-5"
              >
                <div className="flex min-w-0 items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 transition group-hover:bg-red-500/15 sm:h-12 sm:w-12">
                    <FaBell className="text-lg text-red-400" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <h3 className="break-words text-base font-semibold text-white sm:text-lg">
                        {notification.title}
                      </h3>

                      <span className="shrink-0 text-xs text-gray-500">
                        {notification.createdAt
                          ? new Date(
                              notification.createdAt
                            ).toLocaleString("en-IN")
                          : "Date unavailable"}
                      </span>
                    </div>

                    <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-gray-400">
                      {notification.message}
                    </p>

                    <div className="mt-4 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                      <span className="text-xs text-gray-500">
                        Notification
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                disabled={currentPage <= 1 || loading}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-sm font-medium text-gray-300 transition hover:border-red-500/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FaChevronLeft />
                Previous
              </button>

              <span className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-semibold tabular-nums text-red-400">
                {currentPage} / {totalPages}
              </span>

              <button
                type="button"
                disabled={currentPage >= totalPages || loading}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-sm font-medium text-gray-300 transition hover:border-red-500/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <FaChevronRight />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default NotificationPage;
