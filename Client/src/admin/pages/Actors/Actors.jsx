import React, {
  useEffect,
  useState,
} from "react";

import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
} from "react-icons/fa";

import {
  useNavigate,
} from "react-router-dom";
import { deleteActor, getAllActors } from "../../../services/actorsApi";

function Actors() {

  const navigate = useNavigate();

  const [actors, setActors] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // =========================
  // FETCH ACTORS
  // =========================
  useEffect(() => {

    fetchActors();

  }, []);

  const fetchActors = async () => {

    try {

      setLoading(true);

      const res = await getAllActors();

      if (!res.success) {

        setError(res.message);

        return;
      }

      setActors(
        res.actors || []
      );

    } catch (error) {

      setError(
        error?.message ||
        "Failed to fetch actors"
      );

    } finally {

      setLoading(false);
    }
  };

  // =========================
  // DELETE ACTOR
  // =========================
  const handleDelete = async (
    id
  ) => {

    try {

      const res =
        await deleteActor(id);

      if (!res.success) {

        setError(res.message);

        return;
      }

      fetchActors();

    } catch (error) {

      setError(
        error?.message || "Failed to delete actor"
      );
    }
  };

  // =========================
  // EDIT ACTOR
  // =========================
  const handleEdit = (id) => {

    navigate(
      `/admin/actors/create/${id}`
    );
  };

  // =========================
  // DETAILS
  // =========================
  const handleDetails = (
    id
  ) => {

    navigate(
      `/admin/actors/${id}`
    );
  };

  return (
    <div className="w-full">

      {/* HEADER */}
      <div
        className="
          flex flex-col md:flex-row
          md:items-center
          md:justify-between
          gap-4 mb-8
        "
      >

        <div>

          <h1 className="text-2xl md:text-3xl font-bold">
            Actors 🎭
          </h1>

          <p className="text-gray-400 text-sm mt-2">
            Manage all actors here
          </p>

        </div>

        {/* CREATE BUTTON */}
        <button
          onClick={() =>
            navigate(
              "/admin/actors/create"
            )
          }
          className="
            flex items-center
            justify-center gap-2
            bg-gradient-to-r
            from-[#8b5c76]
            to-[#6f4660]
            px-5 py-3
            rounded-xl
            font-medium
            hover:opacity-90
            transition
            w-full md:w-auto
          "
        >

          <FaPlus />

          Create Actor

        </button>

      </div>

      {/* ERROR */}
      {error && (

        <div
          className="
            w-full
            bg-[#1a1a1a]
            border border-red-500/30
            rounded-2xl
            py-14 px-6
            flex flex-col
            items-center
            justify-center
            text-center
            mb-6
          "
        >

          <div
            className="
              w-20 h-20
              rounded-full
              bg-red-500/10
              flex items-center
              justify-center
              text-4xl
              mb-5
            "
          >

            ⚠️

          </div>

          <h2
            className="
              text-2xl
              font-bold
              text-white
            "
          >
            {error}
          </h2>

        </div>
      )}

      {/* LOADING */}
      {loading && (

        <div className="text-center py-20 text-gray-400">
          Loading actors...
        </div>
      )}

      {/* EMPTY */}
      {!loading &&
        actors.length === 0 &&
        !error && (

        <div
          className="
            w-full
            bg-[#1a1a1a]
            border border-gray-800
            rounded-2xl
            py-20 px-6
            flex flex-col
            items-center
            justify-center
            text-center
          "
        >

          <div
            className="
              w-20 h-20
              rounded-full
              bg-[#8b5c76]/20
              flex items-center
              justify-center
              text-4xl
              mb-5
            "
          >

            🎭

          </div>

          <h2
            className="
              text-2xl
              font-bold
            "
          >
            No Actors Found
          </h2>

          <p
            className="
              text-gray-400
              mt-3
              max-w-md
            "
          >
            There are currently no actors
            available in your collection.
          </p>

        </div>
      )}

      {/* ACTORS GRID */}
      {!loading &&
        actors.length > 0 && (

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-3
            gap-6
          "
        >

          {actors.map((actor) => (

            <div
              key={actor._id}
              className="
                bg-[#1a1a1a]
                rounded-2xl
                p-6
                border border-gray-800
                hover:border-[#8b5c76]
                transition
                shadow-2xl
              "
            >

              {/* PROFILE */}
              <div
                className="
                  flex flex-col
                  items-center
                  text-center
                "
              >

                <img
                  src={
                    actor.profileImage
                  }
                  alt={actor.name}
                  className="
                    w-28 h-28
                    rounded-full
                    object-cover
                    border-4
                    border-[#8b5c76]/30
                  "
                />

                <h2
                  onClick={() =>
                    handleDetails(
                      actor._id
                    )
                  }
                  className="
                    text-xl
                    font-bold
                    mt-5
                    cursor-pointer
                    hover:text-[#d6a7c1]
                    transition
                  "
                >
                  {actor.name}
                </h2>

                <p
                  className="
                    text-gray-400
                    text-sm
                    mt-3
                    line-clamp-3
                  "
                >
                  {actor.bio || "-"}
                </p>

              </div>

              {/* ACTIONS */}
              <div
                className="
                  grid grid-cols-3
                  gap-3 mt-6
                "
              >

                {/* VIEW */}
                <button
                  onClick={() =>
                    handleDetails(
                      actor._id
                    )
                  }
                  className="
                    py-3
                    rounded-xl
                    bg-[#252525]
                    hover:bg-[#333]
                    transition
                    flex items-center
                    justify-center
                    gap-2
                  "
                >

                  <FaEye />

                </button>

                {/* EDIT */}
                <button
                  onClick={() =>
                    handleEdit(
                      actor._id
                    )
                  }
                  className="
                    py-3
                    rounded-xl
                    bg-[#252525]
                    hover:bg-[#333]
                    transition
                    flex items-center
                    justify-center
                    gap-2
                  "
                >

                  <FaEdit />

                </button>

                {/* DELETE */}
                <button
                  onClick={() =>
                    handleDelete(
                      actor._id
                    )
                  }
                  className="
                    py-3
                    rounded-xl
                    bg-red-500/10
                    text-red-400
                    hover:bg-red-500
                    hover:text-white
                    transition
                    flex items-center
                    justify-center
                    gap-2
                  "
                >

                  <FaTrash />

                </button>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default Actors;