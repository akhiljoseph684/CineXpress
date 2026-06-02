import cron from "node-cron";
import Movie from "../models/movieModel.js";

export const movieStatusCron = () => {
  cron.schedule(
    "0 0 * * *",
    async () => {
      try {
        const today = new Date();
        
        today.setHours(0, 0, 0, 0);
        
        await Movie.updateMany(
          {
            releaseDate: {
              $lte: today,
            },
            
            status: "upcoming",
          },
          {
            $set: {
              status: "now_showing",
            },
          },
        );
        console.log("Movie status updated successfully");

      } catch (error) {
        console.log(error);
      }
    },
    {
      timezone: "Asia/Kolkata",
    },
  );
};
