import Notification from "../models/notificationModel.js";

export const getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const notifications = await Notification.find()

      .sort({
        createdAt: -1,
      })

      .skip(skip)

      .limit(Number(limit));

    const totalNotifications = await Notification.countDocuments();

    const totalPages = Math.ceil(totalNotifications / Number(limit));

    await Notification.updateMany(
      {
        isRead: false,
      },
      {
        $set: {
          isRead: true,
        },
      },
    );

    return res.status(200).json({
      success: true,

      notifications,

      currentPage: Number(page),

      totalPages,

      totalNotifications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

export const getUnreadNotificationCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      isRead: false,
    });

    return res.status(200).json({
      success: true,

      count,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};
