import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FaSearch, FaTimes } from "react-icons/fa";
import { searchActors } from "../../../services/actorsApi";
import { createMovie, editMovie, getMovieById } from "../../../services/moviesApi";
import { getGenres, getLanguages } from "../../../services/categories";
import { useNavigate, useParams } from "react-router-dom";


function CreateMovie() {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [actors, setActors] = useState([]);

  const { id } = useParams(); 
  const isEdit = Boolean(id);

  const [errors, setErrors] = useState({
    title: "",
    description: "",
    duration: "",
    releaseDate: "",
    director: "",
    producer: "",
    trailer: "",
    language: "",
    genre: "",
    general: "",
  });


  const topRef = useRef(null)
  const [actorSearch, setActorSearch] = useState("");
  const [languageOptions, setLanguageOptions] = useState([]);
  const [genreOptions, setGenreOptions] = useState([]);
  const [selectedActors, setSelectedActors] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    releaseDate: "",
    director: "",
    producer: "",
    trailer: "",
    language: [],
    genre: [],
    poster: {
      card: "",
      banner: "",
      thumbnail: "",
    },
  });

  useEffect(() => {

    const timeout = setTimeout(async () => {

      try {

        if (!actorSearch.trim()) {
          setActors([]);
          return;
        }

        const res = await searchActors("?name=" + actorSearch);

        setActors(res.actors || []);

      } catch (error) {

        setErrors(error?.message || "Something went wrong");

      }
    
    }, 500);
  
    return () => clearTimeout(timeout);
  
  }, [actorSearch]);

  useEffect(() => {

    if(id) {
      fetchMovieDetails();
    }

  }, [id]);

  const fetchMovieDetails = async () => {

      try {

        const res = await getMovieById(id);
        if (!res.success) return;

        const movie = res.movie;

        setFormData({
          title: movie.title || "",

          description: movie.description || "",

          duration: movie.duration || "",

          releaseDate: movie.releaseDate?.split("T")[0] || "",

          director: movie.director || "",

          producer: movie.producer || "",

          trailer: movie.trailer || "",

          language: movie.language?.map((item) => item._id ) || [],

          genre: movie.genre?.map((item) => item._id ) || [],

          poster: {
            card: movie.poster?.card || "",
            banner: movie.poster?.banner || "",
            thumbnail: movie.poster?.thumbnail || "",
          },
        });

    const formattedCast = movie.cast?.map((actor) => {

      if (actor.actorId) {

        return {
          _id: actor.actorId._id,
          name: actor.actorId.name,
          isCustom: false,
        };
      }

      return {

        _id: `custom-${actor.name}`,
        name: actor.name,
        isCustom: true,
      };
    }
    ) || [];


        setSelectedActors(
          formattedCast
        );

      } catch (error) {
        console.log(error)
      }
    };


  useEffect(() => {

    fetchLanguages();
    fetchGenres();

  }, []);

  const fetchLanguages = async () => {

    try {

      const res = await getLanguages();
      setLanguageOptions(res.languages || []);

    } catch (error) {

      setErrors((prev) => ({
        ...prev,
        general: error?.message || "Failed to fetch languages",
      }));
    }
  };

  const fetchGenres = async () => {

    try {

      const res = await getGenres();
      setGenreOptions(res.genres || []);

    } catch (error) {

      setErrors((prev) => ({
        ...prev,
        general:
          error?.message ||
          "Failed to fetch genres",
      }));
    }
  };


  const handleChange = (e) => {

    const { name, value } = e.target;

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      general: "",
    }));

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckbox = (type, value) => {

    setFormData((prev) => {

      const exists = prev[type].includes(value);

      return {
        ...prev,
        [type]: exists
          ? prev[type].filter((item) => item !== value)
          : [...prev[type], value],
      };
    });
  };


const uploadImage = async (file, type) => {

  try {

    setErrors({
      title: "",
      description: "",
      duration: "",
      releaseDate: "",
      director: "",
      producer: "",
      trailer: "",
      language: "",
      genre: "",
      general: "",
    });
    
    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];
    
    if (!allowedTypes.includes(file.type)) {
      
      setErrors((prev) => ({
        ...prev,
        general: `${type} image must be JPG, PNG or WEBP`,
      }));

      topRef.current?.scrollIntoView({
        behavior: "smooth",
      });
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    
    if (file.size > maxSize) {

      setErrors((prev) => ({
        ...prev,
        general: `${type} image size must be below 5MB`,
      }));

      topRef.current?.scrollIntoView({
        behavior: "smooth",
      });
      
      return;
    }
    
    const image = new Image();
    
    image.src = URL.createObjectURL(file);
    
    image.onload = async () => {

      try {

        setLoading(true);

        const data = new FormData();

        data.append("file", file);

        data.append(
          "upload_preset",
          import.meta.env
            .VITE_CLOUDINARY_UPLOAD_PRESET_MOVIES_NAME
        );

        const res = await axios.post(
          import.meta.env.VITE_CLOUDINARY_URL,
          data
        );

        const imageUrl = res.data.secure_url;

        setFormData((prev) => ({
          ...prev,
          poster: {
            ...prev.poster,
            [type]: imageUrl,
          },
        }));

      } catch (error) {

        setErrors((prev) => ({
          ...prev,
          general: "Image upload failed",
        }));

        topRef.current?.scrollIntoView({
          behavior: "smooth",
        });

      } finally {
        setLoading(false);
      }
    };

  } catch (error) {

    setErrors((prev) => ({
      ...prev,
      general: error.message,
    }));
  }
};

const handleAddActor = () => {

  const value = actorSearch.trim();

  if (!value) return;

  const existingActor = actors.find(
      (actor) =>
        actor.name
          .toLowerCase()
          .trim() ===
        value
          .toLowerCase()
          .trim()
    );

  if (existingActor) {
    handleSelectActor(existingActor);
    return;
  }

  const alreadyExists = selectedActors.find(
      (item) =>
        item.name
          ?.toLowerCase()
          .trim() ===
        value
          .toLowerCase()
          .trim()
    );

  if (alreadyExists) return;

  setSelectedActors(
    (prev) => [
      ...prev,
      {
        _id: `custom-${value}`,
        name: value,
        isCustom: true,
      },
    ]
  );

  setActorSearch("");
  setActors([]);
};

const handleSelectActor = (actor) => {

  const exists = selectedActors.find((item) => item._id === actor._id );

  if (exists) {

    setActorSearch("");
    setActors([]);

    return;
  }

  setSelectedActors(
    (prev) => [
      ...prev,
      {
        _id: actor._id,
        name: actor.name,
        isCustom: false,
      },
    ]
  );
  setActorSearch("");
  setActors([]);
};



  const removeActor = (id) => {
    setSelectedActors((prev) =>
      prev.filter((item) => item._id !== id)
    );
  };

 const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setErrors({
        title: "",
        description: "",
        duration: "",
        releaseDate: "",
        language: "",
        genre: "",
        poster: "",
        general: "",
      });

      const payload = {
        ...formData,

      cast: selectedActors.map(
        (actor) => {
        
          if (actor.isCustom) {
          
            return {
              name: actor.name,
            };
          }
        
          return {
            _id: actor._id,
            name: actor.name,
          };
        }
      ),


      };
    
      const res = isEdit ? await editMovie(id,payload) : await createMovie(payload);


      if (!res.success) {
        topRef.current?.scrollIntoView({
          behavior: "smooth",
        });

        if (res.field) {

          console.log(res)
          setErrors((prev) => ({
            ...prev,
            [res.field]: res.message,
          }));

        } else {

          setErrors((prev) => ({
            ...prev,
            general: res.message,
          }));
        }

        return;
      }

      navigate("/admin/movies")

    } catch (error) {
      topRef.current?.scrollIntoView({
        behavior: "smooth",
      });
      setErrors((prev) => ({
        ...prev,
        general: error.message,
      }));
    }
  };

  return (
    <div ref={topRef} className="w-full">

      <div className="mb-8">

        <h1 className="text-2xl md:text-3xl font-bold">
          {isEdit
          ? "Edit Movie 🎬"
          : "Create Movie 🎬"}
        </h1>

        <p className="text-gray-400 text-sm mt-2">
          Add movie details here
        </p>

      </div>

      {errors.general && (
        <div
          className="
            mb-5
            bg-red-500/10
            border border-red-500
            text-red-400
            p-4 rounded-xl
          "
        >
          {errors.general}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="
          bg-[#1a1a1a]
          rounded-2xl
          p-5 md:p-8
          shadow-2xl
          space-y-8
        "
      >

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <div>

            <label className="text-sm text-gray-300 mb-2 block">
              Movie Title
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Movie title"
              className={`
                w-full
                bg-[#0f0f0f]
                border
                ${errors.title ? "border-red-500" : "border-gray-700"}
                rounded-xl
                px-4 py-3
                outline-none
                focus:border-[#8b5c76]
              `}
            />
            <p className="text-red-500 text-sm mt-2">
              {errors.title}
            </p>
          </div>

          <div>

            <label className="text-sm text-gray-300 mb-2 block">
              Duration
            </label>

            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="180"
              className={`
                w-full
                bg-[#0f0f0f]
                border
                ${errors.duration ? "border-red-500" : "border-gray-700"}
                rounded-xl
                px-4 py-3
                outline-none
                focus:border-[#8b5c76]
              `}
            />
            <p className="text-red-500 text-sm mt-2">
              {errors.duration}
            </p>
          </div>

        </div>

        <div>

          <label className="text-sm text-gray-300 mb-2 block">
            Release Date
          </label>

          <input
            type="date"
            name="releaseDate"
            value={formData.releaseDate}
            onChange={handleChange}
            className={`
              w-full
              bg-[#0f0f0f]
              border
              ${errors.releaseDate ? "border-red-500" : "border-gray-700"}
              rounded-xl
              px-4 py-3
              outline-none
              focus:border-[#8b5c76]
            `}
          />
          <p className="text-red-500 text-sm mt-2">
            {errors.releaseDate}
          </p>
        </div>

        <div>

          <label className="text-sm text-gray-300 mb-2 block">
            Description
          </label>

          <textarea
            rows={5}
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Movie description"
            className={`
              w-full
              bg-[#0f0f0f]
              border
              ${errors.description ? "border-red-500" : "border-gray-700"}
              rounded-xl
              px-4 py-3
              outline-none
              resize-none
              focus:border-[#8b5c76]
            `}
          />
          <p className="text-red-500 text-sm mt-2">
            {errors.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          <div>

            <label className="text-sm text-gray-300 mb-2 block">
              Director
            </label>

            <input
              type="text"
              name="director"
              value={formData.director}
              onChange={handleChange}
              placeholder="Director name"
              className={`
                w-full
                bg-[#0f0f0f]
                border
                ${
                  errors.director
                    ? "border-red-500"
                    : "border-gray-700"
                }
                rounded-xl
                px-4 py-3
                outline-none
                focus:border-[#8b5c76]
              `}
            />

            {errors.director && (
              <p className="text-red-500 text-sm mt-2">
                {errors.director}
              </p>
            )}

          </div>
          
          <div>
          
            <label className="text-sm text-gray-300 mb-2 block">
              Producer
            </label>
          
            <input
              type="text"
              name="producer"
              value={formData.producer}
              onChange={handleChange}
              placeholder="Producer name"
              className={`
                w-full
                bg-[#0f0f0f]
                border
                ${
                  errors.producer
                    ? "border-red-500"
                    : "border-gray-700"
                }
                rounded-xl
                px-4 py-3
                outline-none
                focus:border-[#8b5c76]
              `}
            />

            {errors.producer && (
              <p className="text-red-500 text-sm mt-2">
                {errors.producer}
              </p>
            )}

          </div>
          
          <div>
          
            <label className="text-sm text-gray-300 mb-2 block">
              Trailer URL
            </label>
          
            <input
              type="text"
              name="trailer"
              value={formData.trailer}
              onChange={handleChange}
              placeholder="https://youtube.com/..."
              className={`
                w-full
                bg-[#0f0f0f]
                border
                ${
                  errors.trailer
                    ? "border-red-500"
                    : "border-gray-700"
                }
                rounded-xl
                px-4 py-3
                outline-none
                focus:border-[#8b5c76]
              `}
            />

            {errors.trailer && (
              <p className="text-red-500 text-sm mt-2">
                {errors.trailer}
              </p>
            )}

          </div>
          
        </div>

        <div>

          <label className="text-sm text-gray-300 mb-4 block">
            Languages
          </label>

          <div className="flex flex-wrap gap-3">

            {languageOptions.map((lang) => (

              <button
                type="button"
                key={lang._id}
                onClick={() =>
                  handleCheckbox("language", lang._id)
                }
                className={`
                  px-4 py-2 rounded-lg text-sm transition
                  ${
                    formData.language.includes(lang._id)
                      ? "bg-[#8b5c76]"
                      : "bg-[#0f0f0f] border border-gray-700"
                  }
                `}
              >
                {lang.name}
              </button>
            ))}

          </div>
        </div>

        <div>

          <label className="text-sm text-gray-300 mb-4 block">
            Genres
          </label>

          <div className="flex flex-wrap gap-3">

            {genreOptions.map((genre) => (

              <button
                type="button"
                key={genre._id}
                onClick={() =>
                  handleCheckbox("genre", genre._id)
                }
                className={`
                  px-4 py-2 rounded-lg text-sm transition
                  ${
                    formData.genre.includes(genre._id)
                      ? "bg-[#8b5c76]"
                      : "bg-[#0f0f0f] border border-gray-700"
                  }
                `}
              >
                {genre.name}
              </button>
            ))}

          </div>
        </div>

        <div className="relative">

          <label className="text-sm text-gray-300 mb-2 block">
            Add Cast
          </label>

          <div
            className="
              flex items-center gap-3
            "
          >
          
            <div className="relative flex-1">

              <FaSearch
                className="
                  absolute left-4 top-1/2
                  -translate-y-1/2 text-gray-500
                "
              />

              <input
                type="text"
                placeholder="
                  Search or add actor name...
                "
                value={actorSearch}
                onChange={(e) =>
                  setActorSearch(
                    e.target.value
                  )
                }
                onKeyDown={(e) => {
                
                  if (
                    e.key === "Enter"
                  ) {
                  
                    e.preventDefault();
                  
                    handleAddActor();
                  }
                }}
                className="
                  w-full
                  bg-[#0f0f0f]
                  border border-gray-700
                  rounded-xl
                  pl-12 pr-4 py-3
                  outline-none
                  focus:border-[#8b5c76]
                "
              />

            </div>
              
            <button
              type="button"
              onClick={handleAddActor}
              className="
                px-5 py-3
                rounded-xl
                bg-gradient-to-r
                from-[#8b5c76]
                to-[#6f4660]
                hover:opacity-90
                transition
              "
            >
            
              Add
              
            </button>
              
          </div>
              
          {actorSearch &&
            actors.length > 0 && (
            
            <div
              className="
                absolute z-20 mt-2 w-full
                bg-[#111]
                border border-gray-700
                rounded-xl
                max-h-60 overflow-y-auto
              "
            >
            
              {actors.map((actor) => (
              
                <div
                  key={actor._id}
                  onClick={() =>
                    handleSelectActor(
                      actor
                    )
                  }
                  className="
                    px-4 py-3
                    hover:bg-[#252525]
                    cursor-pointer
                    transition
                  "
                >
                
                  {actor.name}
                
                </div>
              ))}

            </div>
          )}

          <div className="flex flex-wrap gap-3 mt-5">
        
            {selectedActors.map(
              (actor) => (
              
                <div
                  key={actor._id}
                  className="
                    flex items-center gap-2
                    bg-[#8b5c76]
                    px-4 py-2 rounded-lg
                    text-sm
                  "
                >
                
                  {actor.name}
              
                  {actor.isCustom && (
                  
                    <span
                      className="
                        text-xs
                        bg-black/20
                        px-2 py-1
                        rounded-md
                      "
                    >
                    
                      Custom
                  
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      removeActor(
                        actor._id
                      )
                    }
                  >
                  
                    <FaTimes />
                  
                  </button>
                  
                </div>
              )
            )}

          </div>
          
        </div>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {["card", "banner", "thumbnail"].map((type) => (
          
            <div key={type}>
            
              <label className="text-sm text-gray-300 mb-2 block capitalize">
                {type} Image
              </label>
          
              <label
                className={`
                  relative
                  flex flex-col items-center justify-center
                  h-52
                  rounded-2xl
                  border-2 border-dashed
                  cursor-pointer
                  overflow-hidden
                  transition
                  border-gray-700 hover:border-[#8b5c76]
                  bg-[#0f0f0f]
                `}
              >
              
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    uploadImage(e.target.files[0], type)
                  }
                  className="hidden"
                />
        
                {formData.poster[type] ? (
                
                  <img
                    src={formData.poster[type]}
                    alt={type}
                    className="
                      absolute inset-0
                      w-full h-full
                      object-cover
                    "
                  />
                
                ) : (
                
                  <div className="text-center z-10">
                  
                    <p className="text-sm text-gray-400">
                      Click to Upload
                    </p>
                
                    <p className="text-xs text-gray-600 mt-2">
                      JPG, PNG, WEBP
                    </p>
                
                  </div>
                )}
        
              </label>

              
            </div>
  ))}

        </div>

        <button
          disabled={loading}
          type="submit"
          className="
            w-full md:w-auto
            bg-gradient-to-r
            from-[#8b5c76]
            to-[#6f4660]
            px-8 py-3
            rounded-xl
            font-semibold
            hover:opacity-90
            transition
          "
        >
          {loading ? 
                      "Uploading..." 
                    : 
                    isEdit
                      ? "Update Movie"
                      : "Create Movie"}
        </button>

      </form>
    </div>
  );
}

export default CreateMovie;