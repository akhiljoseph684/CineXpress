import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useParams, useNavigate } from "react-router-dom";
import { FaStar, FaPlay, FaArrowLeft } from "react-icons/fa";
import { getMovieById, addReview } from "../services/moviesApi";

dayjs.extend(relativeTime);

function MovieDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");
  const [stars, setStars] = useState(0);
  const [comments, setComments] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchMovie = async () => {
      try {
        setLoading(true);
        const res = await getMovieById(id);
        setMovie(res.movie);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMovie();
    }
  }, [id]);

  const handleReview = async (e) => {
    e.preventDefault();
    setReviewError("");
    setReviewSuccess("");

    if (!comments.trim()) {
      setReviewError("Please write a review before submitting.");
      return;
    }

    try {
      setReviewLoading(true);

      const res = await addReview(id, {
        stars,
        comments: comments.trim(),
      });

      setMovie(res.movie);
      setComments("");
      setStars(5);
      setReviewSuccess("Your review has been submitted successfully.");
    } catch (error) {
      setReviewError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to submit review."
      );
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-800 border-t-red-600" />
          <p className="text-gray-400">Loading movie...</p>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-black px-4 text-center text-white">
        <h2 className="text-2xl font-bold">Movie not found</h2>
        <button
          onClick={() => navigate(-1)}
          className="rounded-xl bg-red-600 px-6 py-3 font-semibold transition hover:bg-red-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  const reviews = movie.reviews || [];
  const avgRating = reviews.length
    ? (
        reviews.reduce((acc, item) => acc + item.stars, 0) /
        reviews.length
      ).toFixed(1)
    : "0.0";

  const fallbackImage =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThZwd0Ar5WsR1Z-ylhArKLTDqEhKPlMqWvZw&s";

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative h-[75vh] min-h-[500px] max-h-[850px] w-full sm:h-[90vh]">
        <img
          src={movie.poster?.banner || movie.poster?.thumbnail || ""}
          alt={movie.title}
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent" />

        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-end px-4 pb-12 sm:px-8 sm:pb-20">
          <div className="max-w-3xl">
            <button
              onClick={() => navigate(-1)}
              className="mb-8 flex items-center gap-2 text-gray-300 transition hover:text-red-500"
            >
              <FaArrowLeft />
              Back
            </button>

            <h1 className="text-4xl font-black leading-tight sm:text-5xl md:text-7xl">
              {movie.title}
            </h1>

            <div className="mt-6 flex flex-wrap gap-3">
              {movie.genre?.map((item) => (
                <span
                  key={item._id}
                  className="rounded-full border border-red-500/30 bg-red-600/15 px-4 py-2 text-sm text-red-300 backdrop-blur-md"
                >
                  {item.name}
                </span>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              {movie.language?.map((item) => (
                <span
                  key={item._id}
                  className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-gray-200 backdrop-blur-md"
                >
                  {item.name}
                </span>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <FaStar className="text-red-500" />
              <span className="text-2xl font-bold">{avgRating}</span>
              <span className="text-gray-400">
                ({reviews.length} reviews)
              </span>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => navigate(`/shows/movie/${movie._id}`)}
                className="rounded-2xl bg-red-600 px-7 py-4 font-semibold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700"
              >
                Book Tickets
              </button>

              <button
                onClick={() => navigate(`/trailer/${movie._id}`)}
                className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/5 px-7 py-4 font-semibold transition hover:border-red-500 hover:bg-red-600/10"
              >
                <FaPlay className="text-red-500" />
                Watch Trailer
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <section>
              <h2 className="mb-8 text-3xl font-bold sm:text-4xl">
                About the <span className="text-red-500">Movie</span>
              </h2>

              <p className="text-base leading-loose text-gray-300 sm:text-lg">
                {movie.description || "No description available."}
              </p>

              <div className="mt-12 grid gap-8 sm:grid-cols-2">
                <div>
                  <h3 className="mb-2 text-gray-500">Director</h3>
                  <p className="text-xl font-semibold">
                    {movie.director || "-"}
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 text-gray-500">Producer</h3>
                  <p className="text-xl font-semibold">
                    {movie.producer || "-"}
                  </p>
                </div>
              </div>
            </section>

            <section className="mt-16">
              <h2 className="mb-10 text-3xl font-bold sm:text-4xl">
                Cast <span className="text-red-500">🎬</span>
              </h2>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-4 xl:grid-cols-5">
                {movie.cast?.map((actor, index) => {
                  const existingActor = actor.actorId;
                  const actorName =
                    existingActor?.name || actor.name || "Unknown Actor";

                  return (
                    <div
                      key={existingActor?._id || `${actorName}-${index}`}
                      className="rounded-3xl border border-gray-800 bg-[#111111] p-4 text-center transition duration-300 hover:-translate-y-1 hover:border-red-600/50 sm:p-5"
                    >
                      <img
                        src={existingActor?.profileImage || fallbackImage}
                        alt={actorName}
                        className="mx-auto h-20 w-20 rounded-full border-2 border-red-600/30 object-cover sm:h-28 sm:w-28"
                      />

                      <h3 className="mt-4 break-words text-sm font-semibold transition hover:text-red-400 sm:mt-5 sm:text-lg">
                        {actorName}
                      </h3>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          <aside>
            <div className="rounded-3xl border border-gray-800 bg-[#111111] p-5 sm:p-6 lg:sticky lg:top-24">
              <h2 className="mb-6 text-2xl font-bold">
                Add <span className="text-red-500">Review</span>
              </h2>

              <form onSubmit={handleReview}>
                <p className="mb-3 text-sm text-gray-400">
                  Rate this movie
                </p>

                <div className="mb-6 flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setStars(item)}
                      aria-label={`Rate ${item} out of 5 stars`}
                      className="transition hover:scale-110"
                    >
                      <FaStar
                        className={`text-2xl ${
                          item <= stars ? "text-red-500" : "text-gray-700"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Share your thoughts..."
                  rows={5}
                  className="w-full resize-none rounded-2xl border border-gray-800 bg-black p-4 text-white outline-none transition placeholder:text-gray-600 focus:border-red-600 focus:ring-1 focus:ring-red-600"
                />

                {reviewError && (
                  <p className="mt-3 text-sm text-red-400">{reviewError}</p>
                )}

                {reviewSuccess && (
                  <p className="mt-3 text-sm text-green-400">
                    {reviewSuccess}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={reviewLoading}
                  className="mt-5 w-full rounded-2xl bg-red-600 py-4 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {reviewLoading ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            </div>
          </aside>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-8 sm:pb-24">
        <h2 className="mb-10 text-3xl font-bold sm:mb-12 sm:text-4xl">
          User <span className="text-red-500">Reviews</span>
        </h2>

        {reviews.length === 0 ? (
          <div className="rounded-3xl border border-gray-800 bg-[#111111] px-6 py-12 text-center">
            <FaStar className="mx-auto mb-4 text-3xl text-red-500" />
            <p className="text-gray-400">
              No reviews yet. Be the first to share your thoughts!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <article
                key={review._id}
                className="rounded-3xl border border-gray-800 bg-[#111111] p-5 transition hover:border-red-600/30 sm:p-6"
              >
                <div className="mb-5 flex items-center gap-4">
                  <img
                    src={review.user?.avatar || fallbackImage}
                    alt={review.user?.name || "User"}
                    className="h-12 w-12 rounded-full border border-red-600/30 object-cover sm:h-14 sm:w-14"
                  />

                  <div>
                    <h3 className="text-base font-semibold sm:text-lg">
                      {review.user?.name || "Anonymous"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {review.createdAt ? dayjs(review.createdAt).fromNow() : ""}
                    </p>
                  </div>
                </div>

                <div className="mb-4 flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={
                        star <= review.stars
                          ? "text-red-500"
                          : "text-gray-700"
                      }
                    />
                  ))}
                </div>

                <p className="text-base leading-relaxed text-gray-300 sm:text-lg">
                  {review.comments}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default MovieDetailsPage;