import cron from "node-cron";

import Booking from "../models/bookingModel.js";
import moment from "moment-timezone";

cron.schedule(
  "*/5 * * * *",

  async () => {
    try {
      const now = moment().tz("Asia/Kolkata").toDate();
      await Booking.updateMany(
        {
          bookingStatus: "PENDING",

          expiresAt: {
            $lt: now,
          },
        },

        {
          bookingStatus: "EXPIRED",
        },
      );
    } catch (error) {
      console.log("Cron Error:", error.message);
    }
  },
);
