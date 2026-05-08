import React, { useEffect, useState } from "react";

import { FaPlus, FaTags, FaGlobe, FaTrash } from "react-icons/fa";
import { createGenre, createLanguage, deleteGenre, deleteLanguage, getGenres, getLanguages } from "../../services/categories";

function LanguageGenre() {

  const [activeTab, setActiveTab] =
    useState("languages");

  const [languages, setLanguages] =
    useState([]);

  const [genres, setGenres] =
    useState([]);

  const [name, setName] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {

    fetchLanguages();
    fetchGenres();

  }, []);

  const fetchLanguages = async () => {

    try {

      const res = await getLanguages();

      setLanguages(res.languages || []);

    } catch (error) {
      setError(error.message)
    }
  };

  const fetchGenres = async () => {

    try {

      const res = await getGenres();

      setGenres(res.genres || []);

    } catch (error) {

      setError(error.message)
    }
  };

  const handleCreate = async (e) => {

    e.preventDefault();
    
    try {

      setError("");

      if (!name.trim()) {

        setError(
          `${activeTab === "languages"
            ? "Language"
            : "Genre"} name required`
        );

        return;
      }

      setLoading(true);

      const res =
        activeTab === "languages"
          ? await createLanguage({
              name,
            })
          : await createGenre({
              name,
            });

      if (!res.success) {

        setError(res.message);

        return;
      }

      setName("");

      if (activeTab === "languages") {

        fetchLanguages();

      } else {

        fetchGenres();
      }

    } catch (error) {

      setError(
        error?.message ||
        "Something went wrong"
      );

    } finally {

      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
  
    try {
    
      setError("");
    
      const res =
        activeTab === "languages"
          ? await deleteLanguage(id)
          : await deleteGenre(id);
    
      if (!res.success) {
      
        setError(res.message);
      
        return;
      }
    
      if (activeTab === "languages") {
      
        fetchLanguages();
      
      } else {
      
        fetchGenres();
      }
    
    } catch (error) {
    
      setError(
        error?.message ||
        "Something went wrong"
      );
    }
};


  return (
    <div className="w-full">

      <div className="mb-8">

        <h1 className="text-2xl md:text-3xl font-bold">
          Languages & Genres 🎬
        </h1>

        <p className="text-gray-400 text-sm mt-2">
          Manage movie languages and genres
        </p>

      </div>

      <div
        className="
          bg-[#1a1a1a]
          rounded-2xl
          shadow-2xl
          overflow-hidden
        "
      >

        <div
          className="
            flex
            border-b border-gray-800
          "
        >

          <button
            onClick={() =>
              setActiveTab("languages")
            }
            className={`
              flex-1
              flex items-center justify-center gap-2
              py-4 text-sm font-medium
              transition
              ${
                activeTab === "languages"
                  ? "bg-[#8b5c76] text-white"
                  : "text-gray-400 hover:bg-[#222]"
              }
            `}
          >
            <FaGlobe />
            Languages
          </button>

          <button
            onClick={() =>
              setActiveTab("genres")
            }
            className={`
              flex-1
              flex items-center justify-center gap-2
              py-4 text-sm font-medium
              transition
              ${
                activeTab === "genres"
                  ? "bg-[#8b5c76] text-white"
                  : "text-gray-400 hover:bg-[#222]"
              }
            `}
          >
            <FaTags />
            Genres
          </button>

        </div>

        <div className="p-5 md:p-8">

          <form
            className="
              flex flex-col md:flex-row
              gap-4 mb-8
            "
            onSubmit={handleCreate}
          >

            <input
              type="text"
              value={name}
              onChange={(e) =>{
                setName(e.target.value)
                setError("")
              }
              }
              placeholder={
                activeTab === "languages"
                  ? "Enter language name"
                  : "Enter genre name"
              }
              className="
                flex-1
                bg-[#0f0f0f]
                border border-gray-700
                rounded-xl
                px-4 py-3
                outline-none
                focus:border-[#8b5c76]
              "
            />

            <button
              disabled={loading}
              className="
                flex items-center justify-center gap-2
                bg-gradient-to-r
                from-[#8b5c76]
                to-[#6f4660]
                px-6 py-3
                rounded-xl
                font-medium
                hover:opacity-90
                transition
              "
            >
              <FaPlus />

              {loading
                ? "Creating..."
                : activeTab === "languages"
                ? "Add Language"
                : "Add Genre"}
            </button>

          </form>

          {error && (
            <div
              className="
                mb-6
                bg-red-500/10
                border border-red-500
                text-red-400
                p-4 rounded-xl
              "
            >
              {error}
            </div>
          )}

          <div
            className="
              grid
              grid-cols-1 sm:grid-cols-2
              lg:grid-cols-3
              gap-4
            "
          >

            {(activeTab === "languages"
              ? languages
              : genres
            ).map((item) => (

              <div
                key={item._id}
                className="
                  bg-[#0f0f0f]
                  border border-gray-800
                  rounded-xl
                  px-5 py-4
                  flex items-center gap-3
                  hover:border-[#8b5c76]
                  transition
                "
              >

                <div
                  className="
                    w-10 h-10
                    rounded-full
                    bg-[#8b5c76]/20
                    flex items-center justify-center
                    text-[#8b5c76]
                  "
                >
                  {activeTab === "languages"
                    ? <FaGlobe />
                    : <FaTags />}
                </div>
                <div className="flex-1">

                  <h3 className="font-medium">
                    {item.name}
                  </h3>

                  <p className="text-xs text-gray-500 mt-1">
                    {activeTab === "languages"
                      ? "Language"
                      : "Genre"}
            </p>
              
          </div>

          <button
            onClick={() =>
              handleRemove(item._id)
            }
            className="
              w-9 h-9
              rounded-lg
              flex items-center justify-center
              bg-red-500/10
              text-red-400
              hover:bg-red-500
              hover:text-white
              transition
            "
          >
            <FaTrash size={13} />
          </button>
              </div>
            ))}

          </div>

          {(activeTab === "languages"
            ? languages.length === 0
            : genres.length === 0
          ) && (

            <div
              className="
                text-center
                py-14
                text-gray-500
              "
            >
              No data found
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default LanguageGenre;
