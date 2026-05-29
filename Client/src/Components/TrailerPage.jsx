import React, { useEffect, useState } from "react";

import { useParams, Link } from "react-router-dom";

import { FaPlay, FaClock, FaStar } from "react-icons/fa";
import { getMovieById } from "../services/moviesApi";

const TrailerPage = () => {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);

  const [movie, setMovie] = useState(null);

  useEffect(() => {
    fetchMovie();
  }, [id]);

  const fetchMovie = async () => {
    try {
      setLoading(true);

      const res = await getMovieById(id);

      setMovie(res.movie);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getYoutubeEmbedUrl = (url) => {
    if (!url) return "";

    try {
      const parsedUrl = new URL(url);

      let videoId = "";

      if (parsedUrl.hostname === "youtu.be") {
        videoId = parsedUrl.pathname.slice(1);
      }
      else if (parsedUrl.searchParams.get("v")) {
        videoId = parsedUrl.searchParams.get("v");
      }
      else if (parsedUrl.pathname.includes("/shorts/")) {
        videoId = parsedUrl.pathname.split("/shorts/")[1];
      }

      return `https://www.youtube.com/embed/${videoId}`;
    } catch (error) {
      return "";
    }
  };

  if (loading) {
    return (
      <div
        className="
          min-h-screen
          bg-black
          text-white
          flex
          items-center
          justify-center
        "
      >
        Loading...
      </div>
    );
  }

  if (!movie) {
    return (
      <div
        className="
          min-h-screen
          bg-black
          text-white
          flex
          items-center
          justify-center
        "
      >
        Movie not found
      </div>
    );
  }

  const embedUrl = getYoutubeEmbedUrl(movie.trailer);

  return (
    <div
      className="
    max-w-7xl
    mx-auto
  "
    >

      <Link
        to={`/movies/${movie._id}`}
        className="
      inline-flex
      items-center
      gap-2
      text-white/60
      hover:text-pink-400
      transition
      mb-8
    "
      >
        ← Back to Movie
      </Link>

      <div
        className="
      relative
      w-full
      rounded-3xl
      overflow-hidden
      border
      border-white/10
      shadow-2xl
      shadow-pink-500/10
    "
      >
        <div
          className="
        relative
        w-full
        pt-[56.25%]
        bg-[#111]
      "
        >
          <iframe
            src={embedUrl}
            title="Movie Trailer"
            allow="
          accelerometer;
          clipboard-write;
          encrypted-media;
          gyroscope;
          picture-in-picture
        "
            allowFullScreen
            className="
          absolute
          top-0
          left-0
          w-full
          h-full
        "
          />
        </div>
      </div>


      <div
        className="
      mt-10
    "
      >

        <div
          className="
        inline-flex
        items-center
        gap-2
        px-4
        py-2
        rounded-full
        bg-pink-500/10
        border
        border-pink-500/20
        text-pink-400
        text-sm
        font-medium
      "
        >
          <FaPlay />
          Official Trailer
        </div>

        <h1
          className="
        text-4xl
        md:text-6xl
        font-black
        mt-5
        leading-tight
      "
        >
          {movie.title}
        </h1>

        <div
          className="
        flex
        flex-wrap
        items-center
        gap-5
        mt-5
        text-white/70
      "
        >
          {movie.duration && (
            <div
              className="
            flex
            items-center
            gap-2
          "
            >
              <FaClock />
              {movie.duration} mins
            </div>
          )}

          {movie.rating && (
            <div
              className="
            flex
            items-center
            gap-2
          "
            >
              <FaStar
                className="
              text-yellow-400
            "
              />
              {movie.rating}/5
            </div>
          )}

          {movie.genre && (
            <div>{movie.genre?.map((g) => g.name).join(", ")}</div>
          )}
        </div>

        {movie.description && (
          <p
            className="
            max-w-4xl
            text-white/60
            text-lg
            mt-6
            leading-relaxed
          "
          >
            {movie.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default TrailerPage;
