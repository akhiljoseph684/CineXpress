import React, { useEffect, useState } from "react";

import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import {
  deleteActor,
  getAllActors,
  searchActors,
} from "../../../services/actorsApi";

function Actors() {
  const navigate = useNavigate();

  const [actors, setActors] = useState([]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedActorId, setSelectedActorId] = useState(null);

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchActors();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchActors(search, 1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const fetchActors = async (name = "", currentPage = 1) => {
    try {
      setLoading(true);

      setError("");

      let query = [];

      if (name.trim()) {
        query.push(`name=${name}`);
      }

      query.push(`page=${currentPage}`);

      query.push("limit=12");

      const queryString = `?${query.join("&")}`;

      const res = await searchActors(queryString);

      if (!res.success) {
        setError(res.message);

        return;
      }

      setActors(res.actors || []);

      setTotalPages(res.totalPages || 1);

      setPage(res.currentPage || 1);
    } catch (error) {
      setError(error?.message || "Failed to fetch actors");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteActor(id);

      if (!res.success) {
        setError(res.message);

        return;
      }

      fetchActors();
    } catch (error) {
      setError(error?.message || "Failed to delete actor");
    }
  };

  const confirmDelete = async () => {
    try {
      const res = await deleteActor(selectedActorId);

      if (!res.success) {
        setError(res.message);
        return;
      }

      setShowDeleteModal(false);
      setSelectedActorId(null);

      fetchActors();
    } catch (error) {
      setError(error?.message || "Failed to delete actor");
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/actors/edit/${id}`);
  };

  const handleDetails = (id) => {
    navigate(`/admin/actors/${id}`);
  };

  return (
    <div className="w-full">
      <div
        className="
          flex flex-col md:flex-row
          md:items-center
          md:justify-between
          gap-4 mb-8
        "
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Actors 🎭</h1>

          <p className="text-gray-400 text-sm mt-2">Manage all actors here</p>
        </div>

        <button
          onClick={() => navigate("/admin/actors/create")}
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
      <div className="mb-8">
        <div className="relative">
          <FaSearch
            className="
              absolute
              left-4 top-1/2
              -translate-y-1/2
              text-gray-500
            "
          />

          <input
            type="text"
            placeholder="Search actors..."
            value={search}
            onChange={(e) => {
              const value = e.target.value;

              setSearch(value);
            }}
            className="
              w-full
              bg-[#1a1a1a]
              border border-gray-800
              rounded-2xl
              pl-12 pr-4 py-4
              outline-none
              focus:border-[#8b5c76]
              transition
            "
          />
        </div>
      </div>

      {loading && (
        <div className="text-center py-20 text-gray-400">Loading actors...</div>
      )}

      {!loading && actors.length === 0 && !error && (
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
            There are currently no actors available in your collection.
          </p>
        </div>
      )}

      {!loading && actors.length > 0 && (
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
              <div
                className="
                  flex flex-col
                  items-center
                  text-center
                "
              >
                <img
                  src={actor.profileImage}
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
                  onClick={() => handleDetails(actor._id)}
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

              <div
                className="
                  grid grid-cols-3
                  gap-3 mt-6
                "
              >
                <button
                  onClick={() => handleEdit(actor._id)}
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

                <button
                  onClick={() => {
                    setSelectedActorId(actor._id);
                    setShowDeleteModal(true);
                  }}
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
      {totalPages > 1 && (
        <div
          className="
              flex items-center
              justify-center
              gap-3
              mt-12
              flex-wrap
            "
        >
          <button
            disabled={page === 1}
            onClick={() => fetchActors(search, page - 1)}
            className="
                px-5 py-3
                rounded-xl
                bg-[#1a1a1a]
                border border-gray-800
                hover:border-[#8b5c76]
                transition
                disabled:opacity-40
                disabled:cursor-not-allowed
              "
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, index) => {
            const pageNumber = index + 1;

            return (
              <button
                key={pageNumber}
                onClick={() => fetchActors(search, pageNumber)}
                className={`
                      w-12 h-12
                      rounded-xl
                      font-medium
                      transition
                      border
                    
                      ${
                        page === pageNumber
                          ? `
                            bg-gradient-to-r
                            from-[#8b5c76]
                            to-[#6f4660]
                            border-[#8b5c76]
                            text-white
                          `
                          : `
                            bg-[#1a1a1a]
                            border-gray-800
                            hover:border-[#8b5c76]
                          `
                      }
                    `}
              >
                {pageNumber}
              </button>
            );
          })}

          <button
            disabled={page === totalPages}
            onClick={() => fetchActors(search, page + 1)}
            className="
                px-5 py-3
                rounded-xl
                bg-[#1a1a1a]
                border border-gray-800
                hover:border-[#8b5c76]
                transition
                disabled:opacity-40
                disabled:cursor-not-allowed
              "
          >
            Next
          </button>
        </div>
    )}
          {
      showDeleteModal && (
      
        <div
          className="
            fixed inset-0
            bg-black/70
            backdrop-blur-sm
            z-50
      
            flex
            items-center
            justify-center
      
            p-4
          "
        >
        
          <div
            className="
              w-full
              max-w-md
      
              bg-[#1a1a1a]
      
              border
              border-red-500/20
      
              rounded-3xl
      
              p-8
      
              text-center
            "
          >
          
            <div
              className="
                w-20
                h-20
      
                mx-auto
      
                rounded-full
      
                bg-red-500/10
      
                flex
                items-center
                justify-center
      
                text-4xl
              "
            >
              🗑️
            </div>
      
            <h2
              className="
                text-2xl
                font-bold
                mt-6
              "
            >
              Delete Actor?
            </h2>
      
            <p
              className="
                text-gray-400
                mt-3
              "
            >
              This action cannot be
              undone.
            </p>
      
            <div
              className="
                flex
                gap-4
                mt-8
              "
            >
            
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedActorId(null);
                }}
                className="
                  flex-1
              
                  py-3
              
                  rounded-xl
              
                  bg-[#252525]
              
                  hover:bg-[#333]
              
                  transition
                "
              >
                Cancel
              </button>
              
              <button
                onClick={confirmDelete}
                className="
                  flex-1
              
                  py-3
              
                  rounded-xl
              
                  bg-red-600
              
                  hover:bg-red-500
              
                  transition
              
                  font-medium
                "
              >
                Delete
              </button>
              
            </div>
              
          </div>
              
        </div>
      )
    }
    </div>
  );
}

export default Actors;
