import React, { useEffect, useState } from "react";

import { FaBell } from "react-icons/fa";
import { getNotifications } from "../../services/notificationApi";

function NotificationPage() {
  const [notifications, setNotifications] = useState([]);

  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchNotifications(currentPage);
  }, [currentPage]);

  const fetchNotifications = async (page = 1) => {
    try {
      setLoading(true);

      const res = await getNotifications(`?page=${page}&limit=10`);

      setNotifications(res.notifications || []);

      setCurrentPage(res.currentPage || 1);

      setTotalPages(res.totalPages || 1);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        w-full
        text-white
      "
    >
      <div
        className="
          flex
          items-center
          gap-4

          mb-8
        "
      >
        <FaBell
          className="
            text-[#8b5c76]
            text-4xl
          "
        />

        <div>
          <h1
            className="
              text-4xl
              font-bold

              text-[#8b5c76]
            "
          >
            Notifications
          </h1>

          <p
            className="
              text-white/50
              mt-1
            "
          >
            Recent activities
          </p>
        </div>
      </div>

      {loading ? (
        <div
          className="
            py-20

            text-center
          "
        >
          Loading...
        </div>
      ) : notifications.length === 0 ? (
        <div
          className="
            bg-[#111]

            border
            border-white/10

            rounded-2xl

            p-10

            text-center
          "
        >
          No Notifications
        </div>
      ) : (
        <>
          <div
            className="
              flex
              flex-col

              gap-4
            "
          >
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className="
                    bg-[#111]

                    border
                    border-white/10

                    rounded-2xl

                    px-5
                    py-4

                    hover:border-[#8b5c76]

                    transition-all
                  "
              >
                <div
                  className="
                      flex

                      items-start

                      gap-4
                    "
                >
                  <div
                    className="
                        w-12
                        h-12

                        rounded-full

                        bg-[#8b5c76]/20

                        flex
                        items-center
                        justify-center

                        flex-shrink-0
                      "
                  >
                    <FaBell
                      className="
                          text-[#8b5c76]
                        "
                    />
                  </div>

                  <div
                    className="
                        flex-1
                      "
                  >
                    <h3
                      className="
                          text-xl

                          font-semibold

                          mb-2
                        "
                    >
                      {notification.title}
                    </h3>

                    <p
                      className="
                          text-white/70
                        "
                    >
                      {notification.message}
                    </p>

                    <p
                      className="
                          text-xs

                          text-white/40

                          mt-3
                        "
                    >
                      {new Date(notification.createdAt).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div
              className="
                flex

                justify-center

                gap-3

                mt-8
              "
            >
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="
                  px-4
                  py-2

                  rounded-xl

                  bg-[#111]

                  border
                  border-white/10

                  disabled:opacity-40
                "
              >
                Previous
              </button>

              <span
                className="
                  px-4
                  py-2

                  rounded-xl

                  bg-[#8b5c76]
                "
              >
                {currentPage}
                {" / "}
                {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="
                  px-4
                  py-2

                  rounded-xl

                  bg-[#111]

                  border
                  border-white/10

                  disabled:opacity-40
                "
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default NotificationPage;
