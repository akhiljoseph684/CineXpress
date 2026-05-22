import axios from "axios";

export const geocodeCity = async (city) => {
  try {
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: city,
          format: "json",
          limit: 1,
        },
        headers: {
          "User-Agent": "CineXpress",
        },
      },
    );
    if (!response.data.length) {
      return null;
    }

    return {
      latitude: parseFloat(response.data[0].lat),
      longitude: parseFloat(response.data[0].lon),
    };
  } catch (error) {
    console.log(error);

    return null;
  }
};
