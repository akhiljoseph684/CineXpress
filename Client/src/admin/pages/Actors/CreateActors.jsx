import React, {
  useState,
} from "react";

import axios from "axios";

import {
  FaUpload,
} from "react-icons/fa";
import { createActor } from "../../../services/actorsApi";

function CreateActor() {

  const [loading, setLoading] =
    useState(false);

  const [errors, setErrors] =
    useState({});

  const [formData, setFormData] =
    useState({
      name: "",
      bio: "",
      profileImage: "",
    });

  // =========================
  // HANDLE CHANGE
  // =========================
  const handleChange = (e) => {

    const { name, value } =
      e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };


  const uploadImage = async (
    file
  ) => {

    try {

      setLoading(true);

      const data =
        new FormData();

      data.append(
        "file",
        file
      );

      data.append(
        "upload_preset",
        import.meta.env
          .VITE_CLOUDINARY_UPLOAD_PRESET_ACTORS_NAME
      );

      const res =
        await axios.post(
          import.meta.env
            .VITE_CLOUDINARY_URL,
          data
        );

      setFormData((prev) => ({
        ...prev,
        profileImage:
          res.data.secure_url,
      }));

      setErrors((prev) => ({
        ...prev,
        profileImage: "",
      }));

    } catch (error) {

      setErrors((prev) => ({
        ...prev,
        profileImage:
          "Failed to upload image",
      }));

    } finally {

      setLoading(false);
    }
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (
    e
  ) => {

    e.preventDefault();

    try {

      setLoading(true);

      setErrors({});

      const res =
        await createActor(
          formData
        );

      if (!res.success) {

        setErrors({
          [res.field]:
            res.message,
        });

        return;
      }

      setFormData({
        name: "",
        bio: "",
        profileImage: "",
      });

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

    } catch (error) {

      setErrors({
        general:
          error?.message ||
          "Failed to create actor",
      });

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="w-full">

      {/* HEADER */}
      <div className="mb-8">

        <h1 className="text-2xl md:text-3xl font-bold">
          Create Actor 🎭
        </h1>

        <p className="text-gray-400 text-sm mt-2">
          Add actor details here
        </p>

      </div>

      {/* ERROR */}
      {errors.general && (

        <div
          className="
            w-full
            bg-[#1a1a1a]
            border border-red-500/30
            rounded-2xl
            py-10 px-6
            flex flex-col
            items-center
            justify-center
            text-center
            mb-6
          "
        >

          <div
            className="
              w-16 h-16
              rounded-full
              bg-red-500/10
              flex items-center
              justify-center
              text-3xl
              mb-4
            "
          >

            ⚠️

          </div>

          <h2
            className="
              text-xl
              font-bold
              text-white
            "
          >
            {errors.general}
          </h2>

        </div>
      )}

      {/* FORM */}
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

        {/* NAME */}
        <div>

          <label className="text-sm text-gray-300 mb-2 block">
            Actor Name
          </label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Actor name"
            className={`
              w-full
              bg-[#0f0f0f]
              border
              ${
                errors.name
                  ? "border-red-500"
                  : "border-gray-700"
              }
              rounded-xl
              px-4 py-3
              outline-none
              focus:border-[#8b5c76]
            `}
          />

          {errors.name && (

            <p className="text-red-500 text-sm mt-2">
              {errors.name}
            </p>
          )}

        </div>

        {/* BIO */}
        <div>

          <label className="text-sm text-gray-300 mb-2 block">
            Bio
          </label>

          <textarea
            rows={5}
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Actor biography"
            className={`
              w-full
              bg-[#0f0f0f]
              border
              ${
                errors.bio
                  ? "border-red-500"
                  : "border-gray-700"
              }
              rounded-xl
              px-4 py-3
              outline-none
              resize-none
              focus:border-[#8b5c76]
            `}
          />

          {errors.bio && (

            <p className="text-red-500 text-sm mt-2">
              {errors.bio}
            </p>
          )}

        </div>

        {/* PROFILE IMAGE */}
        <div>

          <label className="text-sm text-gray-300 mb-3 block">
            Profile Image
          </label>

          <div
            className={`
              bg-[#0f0f0f]
              border-2 border-dashed
              ${
                errors.profileImage
                  ? "border-red-500"
                  : "border-gray-700"
              }
              rounded-2xl
              p-6
              flex flex-col
              items-center
              justify-center
              text-center
            `}
          >

            <label
              className="
                cursor-pointer
                flex flex-col
                items-center
              "
            >

              {formData.profileImage ? (

                <img
                  src={
                    formData.profileImage
                  }
                  alt="profile"
                  className="
                    w-36 h-36
                    rounded-full
                    object-cover
                    border-4
                    border-[#8b5c76]/30
                  "
                />

              ) : (

                <div
                  className="
                    w-28 h-28
                    rounded-full
                    bg-[#8b5c76]/10
                    flex items-center
                    justify-center
                    text-3xl
                    text-[#d6a7c1]
                  "
                >

                  <FaUpload />

                </div>
              )}

              <p className="text-sm text-gray-400 mt-4">
                Click to upload actor image
              </p>

              <p className="text-xs text-gray-500 mt-2">
                Recommended:
                500×500 (1:1)
              </p>

              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) =>
                  uploadImage(
                    e.target.files[0]
                  )
                }
              />

            </label>

          </div>

          {errors.profileImage && (

            <p className="text-red-500 text-sm mt-2">
              {errors.profileImage}
            </p>
          )}

        </div>

        {/* SUBMIT */}
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

          {loading
            ? "Creating..."
            : "Create Actor"}

        </button>

      </form>

    </div>
  );
}

export default CreateActor;