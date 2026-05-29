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

  const [stars, setStars] = useState(5);

  const [comments, setComments] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchMovie = async () => {
      try {
        const res = await getMovieById(id);

        console.log(res);
        setMovie(res.movie);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  const handleReview = async (e) => {
    e.preventDefault();

    try {
      const res = await addReview(id, {
        stars,
        comments,
      });

      setMovie(res.movie);

      setComments("");

      setStars(5);
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div
        className="
          min-h-screen
          bg-black
        "
      />
    );
  }

  const avgRating = movie.reviews?.length
    ? (
        movie.reviews.reduce(
          (acc, item) => acc + item.stars,

          0,
        ) / movie.reviews.length
      ).toFixed(1)
    : 0;

  return (
    <div
      className="
        min-h-screen
        bg-black
        text-white
      "
    >
      <div
        className="
          relative
          h-[90vh]
        "
      >
        <img
          src={movie.poster.banner}
          alt={movie.title}
          className="
            absolute
            inset-0

            w-full
            h-full

            object-cover
          "
        />

        <div
          className="
            absolute
            inset-0

            bg-gradient-to-t
            from-black
            via-black/70
            to-black/40
          "
        />

        <div
          className="
            relative
            z-10

            h-full

            max-w-7xl
            mx-auto

            px-4 md:px-8

            flex
            items-end

            pb-20
          "
        >
          <div
            className="
              max-w-3xl
            "
          >
            <h1
              className="
                text-5xl
                md:text-7xl

                font-black

                leading-tight
              "
            >
              {movie.title}
            </h1>

            <div
              className="
                flex flex-wrap

                gap-3

                mt-6
              "
            >
              {movie.genre?.map((item) => (
                <div
                  key={item._id}
                  className="
                        px-4 py-2

                        rounded-full

                        bg-white/10

                        backdrop-blur-md

                        text-sm
                      "
                >
                  {item.name}
                </div>
              ))}
            </div>

            <div
              className="
                flex flex-wrap

                gap-3

                mt-4
              "
            >
              {movie.language?.map((item) => (
                <div
                  key={item._id}
                  className="
                        px-4 py-2

                        rounded-full

                        bg-pink-500/20

                        text-pink-400

                        text-sm
                      "
                >
                  {item.name}
                </div>
              ))}
            </div>

            <div
              className="
                flex items-center
                gap-3

                mt-6
              "
            >
              <FaStar
                className="
                  text-yellow-400
                "
              />

              <span
                className="
                  text-2xl
                  font-bold
                "
              >
                {avgRating}
              </span>

              <span
                className="
                  text-gray-400
                "
              >
                ({movie.reviews.length} reviews)
              </span>
            </div>

            <div
              className="
                flex flex-wrap

                gap-4

                mt-8
              "
            >
              <button
                onClick={() => navigate(`/shows/movie/${movie._id}`)}
                className="
                  bg-pink-600
                  hover:bg-pink-700

                  transition

                  px-8 py-4

                  rounded-2xl

                  font-semibold
                "
              >
                Book Tickets
              </button>

              <button
                onClick={() => navigate(`/trailer/${movie._id}`)}
                className=" flex items-center gap-3 border border-white/20 hover:bg-white/10 transition px-8 py-4 rounded-2xl font-semibold "
              >
                {" "}
                <FaPlay /> Watch Trailer{" "}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="
          max-w-7xl
          mx-auto

          px-4 md:px-8

          py-20
        "
      >
        <div
          className="
            grid
            lg:grid-cols-3

            gap-12
          "
        >
          <div
            className="
              lg:col-span-2
            "
          >
            <h2
              className="
                text-4xl
                font-bold

                mb-8
              "
            >
              About the Movie
            </h2>

            <p
              className="
                text-gray-300

                leading-loose

                text-lg
              "
            >
              {movie.description}
            </p>

            <div
              className="
                grid
                md:grid-cols-2

                gap-8

                mt-12
              "
            >
              <div>
                <h3
                  className="
                    text-gray-500
                    mb-2
                  "
                >
                  Director
                </h3>

                <p
                  className="
                    text-xl
                    font-semibold
                  "
                >
                  {movie.director}
                </p>
              </div>

              <div>
                <h3
                  className="
                    text-gray-500
                    mb-2
                  "
                >
                  Producer
                </h3>

                <p
                  className="
                    text-xl
                    font-semibold
                  "
                >
                  {movie.producer}
                </p>
              </div>
            </div>

            <div
              className="
                mt-16
              "
            >
              <h2
                className="
                  text-4xl
                  font-bold

                  mb-10
                "
              >
                Cast
              </h2>

              <div
                className="
                  grid

                  grid-cols-2
                  sm:grid-cols-3
                  md:grid-cols-4
                  lg:grid-cols-5

                  gap-8
                "
              >
                {movie.cast?.map((actor, index) => {
                  const existingActor = actor.actorId;

                  const actorName =
                    existingActor?.name || actor.name || "Unknown Actor";

                  return (
                    <div
                      key={
                        existingActor?.profileImage ||
                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThZwd0Ar5WsR1Z-ylhArKLTDqEhKPlMqWvZw&s"
                      }
                      className="
                            bg-[#111]
                    
                            border border-white/10
                    
                            rounded-3xl
                    
                            p-5
                    
                            text-center
                    
                            hover:border-pink-500/40
                    
                            hover:-translate-y-1
                    
                            transition-all
                            duration-300
                          "
                    >
                      <img
                        src={
                          existingActor?.profileImage ||
                          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThZwd0Ar5WsR1Z-ylhArKLTDqEhKPlMqWvZw&s"
                        }
                        alt={actorName}
                        className="
                              w-28 h-28
                    
                              rounded-full
                    
                              object-cover
                    
                              mx-auto
                    
                              border-2
                              border-white/10
                            "
                      />

                      <h3
                        className="
                              mt-5
                    
                              font-semibold
                    
                              text-lg
                            "
                      >
                        {actorName}
                      </h3>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div>
            <div
              className="
                bg-[#111]

                border border-white/10

                rounded-3xl

                p-6

                sticky
                top-24
              "
            >
              <h2
                className="
                  text-2xl
                  font-bold

                  mb-6
                "
              >
                Add Review
              </h2>

              <div
                className="
                  flex items-center
                  gap-2

                  mb-6
                "
              >
                {[1, 2, 3, 4, 5].map((item) => (
                  <FaStar
                    key={item}
                    onClick={() => setStars(item)}
                    className={`
                          text-2xl

                          cursor-pointer

                          transition

                          ${item <= stars ? "text-yellow-400" : "text-gray-600"}
                        `}
                  />
                ))}
              </div>

              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="
                  Share your thoughts...
                "
                className="
                  w-full

                  h-[150px]

                  bg-black/30

                  border border-white/10

                  rounded-2xl

                  p-5

                  outline-none

                  resize-none
                "
              />

              <button
                onClick={handleReview}
                className="
                  w-full

                  mt-5

                  bg-pink-600
                  hover:bg-pink-700

                  transition

                  py-4

                  rounded-2xl

                  font-semibold
                "
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="
          max-w-7xl
          mx-auto

          px-4 md:px-8

          pb-24
        "
      >
        <h2
          className="
            text-4xl
            font-bold

            mb-12
          "
        >
          User Reviews
        </h2>

        <div
          className="
            space-y-6
          "
        >
          {movie.reviews?.map((review) => (
            <div
              key={review._id}
              className="
                    bg-[#111]

                    border border-white/10

                    rounded-3xl

                    p-6
                  "
            >
              <div
                className="
                      flex items-center
                      gap-4

                      mb-5
                    "
              >
                <img
                  src={
                    review.user?.avatar ||
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThZwd0Ar5WsR1Z-ylhArKLTDqEhKPlMqWvZw&s"
                  }
                  alt=""
                  className="
                        w-14 h-14

                        rounded-full

                        object-cover
                      "
                />

                <div>
                  <h3
                    className="
                          font-semibold
                          text-lg
                        "
                  >
                    {review.user?.name}
                  </h3>

                  <p
                    className="
                          text-gray-500
                          text-sm
                        "
                  >
                    {dayjs(review.createdAt).fromNow()}
                  </p>
                </div>
              </div>

              <div
                className="
                      flex items-center
                      gap-2

                      mb-4
                    "
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={
                      star <= review.stars ? "text-yellow-400" : "text-gray-700"
                    }
                  />
                ))}
              </div>

              <p
                className="
                      text-gray-300

                      leading-relaxed

                      text-lg
                    "
              >
                {review.comments}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MovieDetailsPage;
