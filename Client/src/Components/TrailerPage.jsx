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
      } else if (parsedUrl.searchParams.get("v")) {
        videoId = parsedUrl.searchParams.get("v");
      } else if (parsedUrl.pathname.includes("/shorts/")) {
        videoId = parsedUrl.pathname.split("/shorts/")[1];
      }

      return `https://www.youtube.com/embed/${videoId}`;
    } catch {
      return "";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white text-xl">
        Loading...
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white text-xl">
        Movie Not Found
      </div>
    );
  }

  const embedUrl = getYoutubeEmbedUrl(movie.trailer);

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white">
      <div className="relative h-[65vh] overflow-hidden">
        <img
          src={movie.poster.banner}
          alt={movie.title}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0b] via-black/60 to-black/20" />

        <div className="absolute bottom-10 left-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-pink-600 px-4 py-2 rounded-full mb-4">
            <FaPlay />
            Official Trailer
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-4">
            {movie.title}
          </h1>

          <div className="flex gap-6 text-white/80">
            <div className="flex items-center gap-2">
              <FaClock />
              {movie.duration} mins
            </div>

            <div className="flex items-center gap-2">
              <FaStar className="text-yellow-400" />
              {movie.rating}/5
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <Link
          to={`/movies/${movie._id}`}
          className="inline-block mb-8 text-pink-400 hover:text-pink-300"
        >
          ← Back to Movie
        </Link>

        <div className="overflow-hidden rounded-3xl border border-white/10 shadow-xl mb-10">
          <iframe
            src={embedUrl}
            title="Movie Trailer"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full aspect-video"
          />
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
          <h2 className="text-2xl font-bold mb-4">About Movie</h2>

          <p className="text-white/70 leading-relaxed">{movie.description}</p>

          <div className="flex flex-wrap gap-3 mt-6">
            {movie.genre?.map((genre) => (
              <span
                key={genre._id}
                className="px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400"
              >
                {genre.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrailerPage;
