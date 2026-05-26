import React, { useEffect, useRef, useState } from "react";

import { FaPlus, FaTrash, FaPen } from "react-icons/fa";

import {
  createTheatre,
  editTheatre,
  getTheatreById,
} from "../../services/theatreApi";

import LocationPicker from "../../Components/Map/LocationPicker";

import { useNavigate, useParams } from "react-router-dom";

function TheatreOwners() {
  const navigate = useNavigate();

  const { id } = useParams();

  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",

    ownerEmail: "",

    city: "",

    address: "",
  });

  const [position, setPosition] = useState(null);

  const errorRef = useRef(null);

  const [bannerImage, setBannerImage] = useState("");

  const [bannerPreview, setBannerPreview] = useState("");

  const [gallery, setGallery] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit) {
      fetchTheatre();
    }
  }, [id]);

  const fetchTheatre = async () => {
    try {
      setLoading(true);

      const res = await getTheatreById(id);

      if (!res.success) {
        setError(res.message);

        return;
      }

      const theatre = res.theatre;

      setFormData({
        name: theatre.name || "",

        ownerEmail: theatre.ownerEmail || "",

        city: theatre.city || "",

        address: theatre.address || "",
      });

      setBannerImage(theatre.bannerImage);

      setBannerPreview(theatre.bannerImage);

      setGallery(theatre.gallery || []);

      if (theatre.location) {
        if (theatre.location) {
          // NEW FORMAT

          if (
            theatre.location.lat !== undefined &&
            theatre.location.lng !== undefined
          ) {
            setPosition([theatre.location.lat, theatre.location.lng]);
          }

          // OLD GEOJSON FORMAT
          else if (theatre.location.coordinates) {
            setPosition([
              theatre.location.coordinates[1],

              theatre.location.coordinates[0],
            ]);
          }
        }
      }
    } catch (error) {
      setError(error?.message || "Failed to fetch theatre");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  // CLOUDINARY

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();

    formData.append("file", file);

    formData.append(
      "upload_preset",

      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET_THEATRES_NAME,
    );

    const res = await fetch(
      import.meta.env.VITE_CLOUDINARY_URL,

      {
        method: "POST",

        body: formData,
      },
    );

    return await res.json();
  };

  // BANNER

  const handleBannerUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    try {
      setLoading(true);

      setBannerPreview(URL.createObjectURL(file));

      const data = await uploadToCloudinary(file);

      setBannerImage(data.secure_url);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // GALLERY

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);

    if (!files.length) return;

    try {
      setLoading(true);

      const uploaded = [];

      for (let file of files) {
        const data = await uploadToCloudinary(file);

        uploaded.push(data.secure_url);
      }

      setGallery((prev) => [...prev, ...uploaded]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const removeGalleryImage = (index) => {
    const updated = gallery.filter((_, i) => i !== index);

    setGallery(updated);
  };

  // SUBMIT

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");

      const payload = {
        name: formData.name,

        ownerEmail: formData.ownerEmail,

        city: formData.city,

        address: formData.address,

        bannerImage,

        gallery,

        location: {
          lat: position?.[0],

          lng: position?.[1],
        },
      };

      const res = isEdit
        ? await editTheatre(id, payload)
        : await createTheatre(payload);

      if (!res.success) {
        setError(res.message);

        setTimeout(() => {
          errorRef.current?.scrollIntoView({
            behavior: "smooth",

            block: "center",
          });
        }, 100);

        return;
      }

      navigate("/admin/theatre");
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          error?.message ||
          `Failed to ${isEdit ? "update" : "create"} theatre`,
      );

      setTimeout(() => {
        errorRef.current?.scrollIntoView({
          behavior: "smooth",

          block: "center",
        });
      }, 100);
    }
  };

  return (
    <div className="w-full">
      {/* HEADER */}

      <div
        className="
          mb-10
        "
      >
        <h1
          className="
            text-3xl
            font-bold
          "
        >
          {isEdit ? "Edit Theatre 🎭" : "Create Theatre 🎭"}
        </h1>

        <p
          className="
            text-gray-400
            mt-2
          "
        >
          {isEdit
            ? "Update theatre details"
            : "Create theatres and invite owners"}
        </p>
      </div>

      {/* ERROR */}

      {error && (
        <div
          ref={errorRef}
          className="
              mb-6

              bg-red-500/10

              border
              border-red-500/30

              rounded-2xl

              p-5

              text-red-400
            "
        >
          {error}
        </div>
      )}

      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="
          grid
          grid-cols-1
          md:grid-cols-2

          gap-4

          mb-10
        "
      >
        <input
          type="text"
          name="name"
          placeholder="
            Theatre Name
          "
          value={formData.name}
          onChange={handleChange}
          className="
            bg-[#1a1a1a]

            border
            border-gray-800

            rounded-2xl

            px-5
            py-4

            outline-none
          "
        />

        <input
          type="email"
          name="ownerEmail"
          placeholder="
            Owner Email
          "
          value={formData.ownerEmail}
          onChange={handleChange}
          className="
            bg-[#1a1a1a]

            border
            border-gray-800

            rounded-2xl

            px-5
            py-4

            outline-none
          "
        />

        <input
          type="text"
          name="city"
          placeholder="
            City
          "
          value={formData.city}
          onChange={handleChange}
          className="
            bg-[#1a1a1a]

            border
            border-gray-800

            rounded-2xl

            px-5
            py-4

            outline-none
          "
        />

        <input
          type="text"
          name="address"
          placeholder="
            Address
          "
          value={formData.address}
          onChange={handleChange}
          className="
            bg-[#1a1a1a]

            border
            border-gray-800

            rounded-2xl

            px-5
            py-4

            outline-none
          "
        />

        {/* BANNER */}

        <div
          className="
            md:col-span-2

            space-y-4
          "
        >
          <h2
            className="
              text-xl
              font-semibold
            "
          >
            Banner Image
          </h2>

          <input type="file" accept="image/*" onChange={handleBannerUpload} />

          {bannerPreview && (
            <img
              src={bannerPreview}
              alt=""
              className="
                  w-full
                  h-72

                  object-cover

                  rounded-2xl
                "
            />
          )}
        </div>

        {/* MAP */}

        <div
          className="
            md:col-span-2

            space-y-4
          "
        >
          <div>
            <h2
              className="
                text-xl
                font-semibold
              "
            >
              Theatre Location
            </h2>

            <p
              className="
                text-gray-400
                text-sm
                mt-2
              "
            >
              Select theatre location from map
            </p>
          </div>

          <LocationPicker position={position} setPosition={setPosition} />
        </div>

        {/* GALLERY */}

        <div
          className="
            md:col-span-2

            space-y-4
          "
        >
          <h2
            className="
              text-xl
              font-semibold
            "
          >
            Theatre Gallery
          </h2>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleGalleryUpload}
          />

          <div
            className="
              grid
              grid-cols-2
              md:grid-cols-4

              gap-4
            "
          >
            {gallery.map((img, index) => (
              <div
                key={index}
                className="
                      relative
                    "
              >
                <img
                  src={img}
                  alt=""
                  className="
                        h-40
                        w-full

                        object-cover

                        rounded-2xl
                      "
                />

                <button
                  type="button"
                  onClick={() => removeGalleryImage(index)}
                  className="
                        absolute
                        top-2
                        right-2

                        w-8
                        h-8

                        rounded-full

                        bg-red-500
                      "
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* BUTTON */}

        <button
          type="submit"
          disabled={loading}
          className="
            md:col-span-2

            flex
            items-center
            justify-center
            gap-2

            bg-gradient-to-r
            from-[#8b5c76]
            to-[#6f4660]

            px-6
            py-4

            rounded-2xl

            font-medium
          "
        >
          {isEdit ? <FaPen /> : <FaPlus />}

          {loading
            ? "Please wait..."
            : isEdit
              ? "Update Theatre"
              : "Create Theatre"}
        </button>
      </form>
    </div>
  );
}

export default TheatreOwners;
