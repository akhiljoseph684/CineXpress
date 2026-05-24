import cron from "node-cron";

import Booking from "../models/bookingModel.js";

cron.schedule("*/5 * * * *", async () => {

  await Booking.updateMany(
    {
      bookingStatus: "PENDING",

      expiresAt: {
        $lt: new Date(),
      },
    },

    {
      bookingStatus: "EXPIRED",
    }
  );
});