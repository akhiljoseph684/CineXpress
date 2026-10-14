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

  const topRef = useRef(null);
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
        setErrors((prev) => ({
          ...prev,
          general: error?.message || "Something went wrong",
        }));
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [actorSearch]);

  useEffect(() => {
    if (id) {
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
        language: movie.language?.map((item) => item._id) || [],
        genre: movie.genre?.map((item) => item._id) || [],
        poster: {
          card: movie.poster?.card || "",
          banner: movie.poster?.banner || "",
          thumbnail: movie.poster?.thumbnail || "",
        },
      });

      const formattedCast =
        movie.cast?.map((actor) => {
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
        }) || [];

      setSelectedActors(formattedCast);
    } catch (error) {
      console.log(error);
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
        general: error?.message || "Failed to fetch genres",
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
        "image/avif",
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
            import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET_MOVIES_NAME
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
          URL.revokeObjectURL(image.src);
        }
      };

      image.onerror = () => {
        URL.revokeObjectURL(image.src);
        setErrors((prev) => ({
          ...prev,
          general: "Unable to load the selected image",
        }));
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
        actor.name.toLowerCase().trim() === value.toLowerCase().trim()
    );

    if (existingActor) {
      handleSelectActor(existingActor);
      return;
    }

    const alreadyExists = selectedActors.find(
      (item) =>
        item.name?.toLowerCase().trim() === value.toLowerCase().trim()
    );

    if (alreadyExists) return;

    setSelectedActors((prev) => [
      ...prev,
      {
        _id: `custom-${value}`,
        name: value,
        isCustom: true,
      },
    ]);

    setActorSearch("");
    setActors([]);
  };

  const handleSelectActor = (actor) => {
    const exists = selectedActors.find((item) => item._id === actor._id);

    if (exists) {
      setActorSearch("");
      setActors([]);
      return;
    }

    setSelectedActors((prev) => [
      ...prev,
      {
        _id: actor._id,
        name: actor.name,
        isCustom: false,
      },
    ]);

    setActorSearch("");
    setActors([]);
  };

  const removeActor = (id) => {
    setSelectedActors((prev) => prev.filter((item) => item._id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true)
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
        cast: selectedActors.map((actor) => {
          if (actor.isCustom) {
            return {
              name: actor.name,
            };
          }

          return {
            _id: actor._id,
            name: actor.name,
          };
        }),
      };

      const res = isEdit
        ? await editMovie(id, payload)
        : await createMovie(payload);

      if (!res.success) {
        topRef.current?.scrollIntoView({
          behavior: "smooth",
        });

        if (res.field) {
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

      navigate("/admin/movies");
    } catch (error) {
      topRef.current?.scrollIntoView({
        behavior: "smooth",
      });

      setErrors((prev) => ({
        ...prev,
        general: error.message,
      }));
    }finally{
      setLoading(false)
    }
  };

  const inputClass = (field) =>
    `w-full rounded-xl border ${
      errors[field] ? "border-red-500" : "border-white/10"
    } bg-[#080808] px-4 py-3 text-sm text-white placeholder:text-gray-600 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/10`;

  const labelClass = "mb-2 block text-sm font-medium text-gray-300";

  const selectionClass = (selected) =>
    `rounded-lg px-4 py-2 text-sm transition ${
      selected
        ? "border border-red-500 bg-red-600 text-white"
        : "border border-white/10 bg-[#080808] text-gray-400 hover:border-red-500/50 hover:text-white"
    }`;

  return (
    <div
      ref={topRef}
      className="mx-auto w-full min-w-0 max-w-7xl overflow-x-clip text-white"
    >
      <div className="mb-8">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-xl text-red-500">
            🎬
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {isEdit ? "Edit Movie" : "Create Movie"}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {isEdit
                ? "Update the movie details below"
                : "Add a new movie to your CineXpress collection"}
            </p>
          </div>
        </div>
      </div>

      {errors.general && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
          <span className="font-bold">!</span>
          <p>{errors.general}</p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-8 rounded-2xl border border-white/[0.07] bg-[#111111] p-4 shadow-2xl sm:p-6 lg:p-8"
      >
        <section className="space-y-5">
          <div className="border-b border-white/[0.06] pb-3">
            <h2 className="text-base font-semibold text-white">
              Movie Information
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              Enter the main details of the movie.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className={labelClass}>Movie Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Movie title"
                className={inputClass("title")}
              />
              {errors.title && (
                <p className="mt-2 text-sm text-red-400">{errors.title}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>Duration (minutes)</label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="180"
                className={inputClass("duration")}
              />
              {errors.duration && (
                <p className="mt-2 text-sm text-red-400">{errors.duration}</p>
              )}
            </div>
          </div>

          <div>
            <label className={labelClass}>Release Date</label>
            <input
              type="date"
              name="releaseDate"
              value={formData.releaseDate}
              onChange={handleChange}
              className={inputClass("releaseDate")}
            />
            {errors.releaseDate && (
              <p className="mt-2 text-sm text-red-400">
                {errors.releaseDate}
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              rows={5}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Movie description"
              className={`${inputClass("description")} resize-y`}
            />
            {errors.description && (
              <p className="mt-2 text-sm text-red-400">
                {errors.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div>
              <label className={labelClass}>Director</label>
              <input
                type="text"
                name="director"
                value={formData.director}
                onChange={handleChange}
                placeholder="Director name"
                className={inputClass("director")}
              />
              {errors.director && (
                <p className="mt-2 text-sm text-red-400">{errors.director}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>Producer</label>
              <input
                type="text"
                name="producer"
                value={formData.producer}
                onChange={handleChange}
                placeholder="Producer name"
                className={inputClass("producer")}
              />
              {errors.producer && (
                <p className="mt-2 text-sm text-red-400">{errors.producer}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>Trailer URL</label>
              <input
                type="text"
                name="trailer"
                value={formData.trailer}
                onChange={handleChange}
                placeholder="https://youtube.com/..."
                className={inputClass("trailer")}
              />
              {errors.trailer && (
                <p className="mt-2 text-sm text-red-400">{errors.trailer}</p>
              )}
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <div className="border-b border-white/[0.06] pb-3">
            <h2 className="text-base font-semibold text-white">
              Languages and Genres
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              Select all applicable languages and genres.
            </p>
          </div>

          <div>
            <label className={labelClass}>Languages</label>
            <div className="flex flex-wrap gap-3">
              {languageOptions.map((lang) => (
                <button
                  type="button"
                  key={lang._id}
                  onClick={() => handleCheckbox("language", lang._id)}
                  className={selectionClass(
                    formData.language.includes(lang._id)
                  )}
                >
                  {lang.name}
                </button>
              ))}
            </div>
            {errors.language && (
              <p className="mt-2 text-sm text-red-400">{errors.language}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Genres</label>
            <div className="flex flex-wrap gap-3">
              {genreOptions.map((genre) => (
                <button
                  type="button"
                  key={genre._id}
                  onClick={() => handleCheckbox("genre", genre._id)}
                  className={selectionClass(
                    formData.genre.includes(genre._id)
                  )}
                >
                  {genre.name}
                </button>
              ))}
            </div>
            {errors.genre && (
              <p className="mt-2 text-sm text-red-400">{errors.genre}</p>
            )}
          </div>
        </section>

        <section className="space-y-5">
          <div className="border-b border-white/[0.06] pb-3">
            <h2 className="text-base font-semibold text-white">Movie Cast</h2>
            <p className="mt-1 text-xs text-gray-500">
              Search existing actors or add a custom actor.
            </p>
          </div>

          <div className="relative">
            <label className={labelClass}>Add Cast</label>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative min-w-0 flex-1">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search or add actor name..."
                  value={actorSearch}
                  onChange={(e) => setActorSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddActor();
                    }
                  }}
                  className={`${inputClass("actorSearch")} pl-11`}
                />
              </div>

              <button
                type="button"
                onClick={handleAddActor}
                className="rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/40"
              >
                Add Actor
              </button>
            </div>

            {actorSearch && actors.length > 0 && (
              <div className="absolute z-20 mt-2 max-h-60 w-full overflow-y-auto rounded-xl border border-white/10 bg-[#111111] shadow-2xl">
                {actors.map((actor) => (
                  <button
                    type="button"
                    key={actor._id}
                    onClick={() => handleSelectActor(actor)}
                    className="block w-full px-4 py-3 text-left text-sm text-gray-300 transition hover:bg-red-500/10 hover:text-red-400"
                  >
                    {actor.name}
                  </button>
                ))}
              </div>
            )}

            <div className="mt-5 flex flex-wrap gap-3">
              {selectedActors.map((actor) => (
                <div
                  key={actor._id}
                  className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300"
                >
                  <span>{actor.name}</span>
                  {actor.isCustom && (
                    <span className="rounded-md bg-black/30 px-2 py-1 text-xs text-gray-400">
                      Custom
                    </span>
                  )}
                  <button
                    type="button"
                    aria-label={`Remove ${actor.name}`}
                    onClick={() => removeActor(actor._id)}
                    className="ml-1 rounded-md p-1 text-red-300 transition hover:bg-red-500/20 hover:text-white"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <div className="border-b border-white/[0.06] pb-3">
            <h2 className="text-base font-semibold text-white">
              Movie Artwork
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              Upload the card, banner, and thumbnail images. Maximum size: 5MB
              per image.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {["card", "banner", "thumbnail"].map((type) => (
              <div key={type}>
                <label className={labelClass}>{type} Image</label>

                <label className="relative flex h-52 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-white/10 bg-[#080808] transition hover:border-red-500/70">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    onChange={(e) => uploadImage(e.target.files[0], type)}
                    className="hidden"
                  />

                  {formData.poster[type] ? (
                    <img
                      src={formData.poster[type]}
                      alt={`${type} poster`}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <div className="z-10 px-4 text-center">
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-xl text-red-500">
                        +
                      </div>
                      <p className="text-sm font-medium text-gray-300">
                        Click to Upload
                      </p>
                      <p className="mt-2 text-xs text-gray-600">
                        JPG, PNG, WEBP, AVIF
                      </p>
                    </div>
                  )}
                </label>
              </div>
            ))}
          </div>
        </section>

        <div className="border-t border-white/[0.06] pt-6">
          <button
            disabled={loading}
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-red-950/20 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
          >
            {loading
              ? "Uploading..."
              : isEdit
                ? "Update Movie"
                : "Create Movie"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateMovie;