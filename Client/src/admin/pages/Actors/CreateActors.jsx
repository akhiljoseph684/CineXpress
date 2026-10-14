import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaUpload,
  FaSpinner,
  FaArrowLeft,
  FaUserAlt,
  FaExclamationCircle,
  FaTimes,
} from "react-icons/fa";
import {
  createActor,
  editActor,
  getActorById,
} from "../../../services/actorsApi";
import { useNavigate, useParams } from "react-router-dom";

function CreateActor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    profileImage: "",
  });

  useEffect(() => {
    if (id) {
      fetchActorDetails();
    }
  }, [id]);

  const fetchActorDetails = async () => {
    try {
      setFetching(true);
      setErrors({});

      const res = await getActorById(id);

      if (!res.success) {
        setErrors({
          general: res.message || "Failed to fetch actor details.",
        });
        return;
      }

      const actor = res.actor;

      setFormData({
        name: actor.name || "",
        bio: actor.bio || "",
        profileImage: actor.profileImage || "",
      });
    } catch (error) {
      setErrors({
        general:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch actor details.",
      });
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      general: "",
    }));
  };

  const uploadImage = async (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        profileImage: "Please select a valid image file.",
      }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        profileImage: "Image size must be less than 5 MB.",
      }));
      return;
    }

    try {
      setLoading(true);

      setErrors((prev) => ({
        ...prev,
        profileImage: "",
        general: "",
      }));

      const data = new FormData();

      data.append("file", file);
      data.append(
        "upload_preset",
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET_ACTORS_NAME
      );

      const res = await axios.post(
        import.meta.env.VITE_CLOUDINARY_URL,
        data
      );

      setFormData((prev) => ({
        ...prev,
        profileImage: res.data.secure_url,
      }));
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        profileImage:
          error?.response?.data?.error?.message ||
          "Failed to upload image. Please try again.",
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {};

    if (!formData.name.trim()) {
      validationErrors.name = "Actor name is required.";
    }

    if (!formData.profileImage) {
      validationErrors.profileImage = "Please upload a profile image.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      const payload = {
        ...formData,
        name: formData.name.trim(),
        bio: formData.bio.trim(),
      };

      const res = isEdit
        ? await editActor(id, payload)
        : await createActor(payload);

      if (!res.success) {
        setErrors({
          [res.field || "general"]:
            res.message ||
            `Failed to ${isEdit ? "update" : "create"} actor.`,
        });
        return;
      }

      navigate("/admin/actors");
    } catch (error) {
      setErrors({
        general:
          error?.response?.data?.message ||
          error?.message ||
          `Failed to ${isEdit ? "update" : "create"} actor.`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#080808] text-white px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button
          type="button"
          onClick={() => navigate("/admin/actors")}
          className="flex items-center gap-2 text-white/50 hover:text-red-400 transition-colors mb-6"
        >
          <FaArrowLeft />
          Back to Actors
        </button>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 rounded-xl bg-red-600/10 border border-red-500/20 flex items-center justify-center">
              <FaUserAlt className="text-red-500 text-xl" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {isEdit ? "Edit Actor" : "Create Actor"}
            </h1>
          </div>

          <p className="text-white/50 text-sm sm:text-base">
            {isEdit
              ? "Update the actor's profile information."
              : "Add a new actor to your movie collection."}
          </p>
        </div>

        {errors.general && (
          <div className="mb-6 p-4 rounded-xl border border-red-500/20 bg-red-500/10 flex items-start gap-3">
            <FaExclamationCircle className="text-red-400 mt-0.5 shrink-0" />

            <p className="text-red-300 text-sm">{errors.general}</p>
          </div>
        )}

        {fetching ? (
          <div className="bg-[#111] border border-white/10 rounded-2xl flex flex-col items-center justify-center py-24 gap-4">
            <FaSpinner className="text-red-500 text-4xl animate-spin" />
            <p className="text-white/50 text-sm">
              Loading actor details...
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-[#111] border border-white/10 rounded-2xl p-5 sm:p-8 space-y-7"
          >
            <div>
              <label
                htmlFor="name"
                className="text-sm font-medium text-white/80 mb-2 block"
              >
                Actor Name <span className="text-red-400">*</span>
              </label>

              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter actor name"
                className={`w-full bg-[#080808] border ${
                  errors.name ? "border-red-500" : "border-white/10"
                } rounded-xl px-4 py-3 outline-none focus:border-red-500 transition-colors placeholder:text-white/25`}
              />

              {errors.name && (
                <p className="text-red-400 text-sm mt-2">{errors.name}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="bio"
                className="text-sm font-medium text-white/80 mb-2 block"
              >
                Biography
              </label>

              <textarea
                id="bio"
                rows={5}
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Write a short biography about the actor..."
                className={`w-full bg-[#080808] border ${
                  errors.bio ? "border-red-500" : "border-white/10"
                } rounded-xl px-4 py-3 outline-none resize-y focus:border-red-500 transition-colors placeholder:text-white/25`}
              />

              {errors.bio && (
                <p className="text-red-400 text-sm mt-2">{errors.bio}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-white/80 mb-3 block">
                Profile Image <span className="text-red-400">*</span>
              </label>

              <div
                className={`bg-[#080808] border-2 border-dashed ${
                  errors.profileImage
                    ? "border-red-500"
                    : "border-white/10 hover:border-red-500/40"
                } rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center transition-colors`}
              >
                {formData.profileImage ? (
                  <div className="relative">
                    <img
                      src={formData.profileImage}
                      alt="Actor profile preview"
                      className="w-36 h-36 rounded-full object-cover border-4 border-red-500/30"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          profileImage: "",
                        }))
                      }
                      disabled={loading}
                      aria-label="Remove profile image"
                      className="absolute top-0 right-0 w-8 h-8 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition-colors disabled:opacity-50"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ) : (
                  <div className="w-28 h-28 rounded-full bg-red-600/10 border border-red-500/20 flex items-center justify-center text-3xl text-red-400">
                    <FaUpload />
                  </div>
                )}

                <label className="mt-5 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-medium cursor-pointer transition-colors">
                  {loading ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaUpload />
                  )}

                  {loading ? "Processing..." : "Choose Image"}

                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    disabled={loading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      uploadImage(file);
                      e.target.value = "";
                    }}
                  />
                </label>

                <p className="text-white/40 text-sm mt-4">
                  Recommended dimensions: 500 × 500 px
                </p>

                <p className="text-white/30 text-xs mt-1">
                  Supported image files up to 5 MB
                </p>
              </div>

              {errors.profileImage && (
                <p className="text-red-400 text-sm mt-2">
                  {errors.profileImage}
                </p>
              )}
            </div>

            <div className="pt-5 border-t border-white/10 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate("/admin/actors")}
                disabled={loading}
                className="px-6 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 font-medium transition-colors disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                disabled={loading}
                type="submit"
                className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-red-600 hover:bg-red-700 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading && <FaSpinner className="animate-spin" />}

                {loading
                  ? "Please wait..."
                  : isEdit
                    ? "Update Actor"
                    : "Create Actor"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default CreateActor;