import React, { useEffect, useRef, useState } from "react";
import { FaPlus, FaTrash, FaPen, FaSpinner, FaImage } from "react-icons/fa";
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
  const [fetching, setFetching] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit) {
      fetchTheatre();
    }
  }, [id]);

  const fetchTheatre = async () => {
    try {
      setFetching(true);
      setError("");

      const res = await getTheatreById(id);

      if (!res.success) {
        setError(res.message || "Failed to fetch theatre");
        return;
      }

      const theatre = res.theatre;

      setFormData({
        name: theatre.name || "",
        ownerEmail: theatre.ownerEmail || "",
        city: theatre.city || "",
        address: theatre.address || "",
      });

      setBannerImage(theatre.bannerImage || "");
      setBannerPreview(theatre.bannerImage || "");
      setGallery(theatre.gallery || []);

      if (theatre.location) {
        if (
          theatre.location.lat !== undefined &&
          theatre.location.lng !== undefined
        ) {
          setPosition([theatre.location.lat, theatre.location.lng]);
        } else if (theatre.location.coordinates) {
          setPosition([
            theatre.location.coordinates[1],
            theatre.location.coordinates[0],
          ]);
        }
      }
    } catch (error) {
      setError(error?.message || "Failed to fetch theatre");
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

    setError("");
  };

  const uploadToCloudinary = async (file) => {
    const data = new FormData();

    data.append("file", file);
    data.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET_THEATRES_NAME
    );

    const response = await fetch(import.meta.env.VITE_CLOUDINARY_URL, {
      method: "POST",
      body: data,
    });

    const result = await response.json();

    if (!response.ok || !result.secure_url) {
      throw new Error(result.error?.message || "Image upload failed");
    }

    return result;
  };

  const validateImage = (file) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Please select a JPG, PNG, WEBP, or AVIF image.");
      return false;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Each image must be smaller than 5MB.");
      return false;
    }

    return true;
  };

  const handleBannerUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setError("");

    if (!validateImage(file)) {
      e.target.value = "";
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    try {
      setUploadingBanner(true);
      setBannerPreview(previewUrl);

      const data = await uploadToCloudinary(file);
      setBannerImage(data.secure_url);
    } catch (error) {
      setError(error?.message || "Banner upload failed");
      setBannerPreview(bannerImage || "");
      URL.revokeObjectURL(previewUrl);
    } finally {
      setUploadingBanner(false);
      e.target.value = "";
    }
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    setError("");

    const validFiles = files.filter((file) => validateImage(file));

    if (validFiles.length !== files.length) {
      e.target.value = "";
      return;
    }

    try {
      setUploadingGallery(true);

      const uploaded = [];

      for (const file of validFiles) {
        const data = await uploadToCloudinary(file);
        uploaded.push(data.secure_url);
      }

      setGallery((prev) => [...prev, ...uploaded]);
    } catch (error) {
      setError(error?.message || "Gallery image upload failed");
    } finally {
      setUploadingGallery(false);
      e.target.value = "";
    }
  };

  const removeGalleryImage = (index) => {
    setGallery((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading || uploadingBanner || uploadingGallery) return;

    try {
      setLoading(true);
      setError("");

      if (!formData.name.trim()) {
        setError("Theatre name is required.");
        return;
      }

      if (!formData.ownerEmail.trim()) {
        setError("Owner email is required.");
        return;
      }

      if (!formData.city.trim()) {
        setError("City is required.");
        return;
      }

      if (!formData.address.trim()) {
        setError("Address is required.");
        return;
      }

      if (!bannerImage) {
        setError("Please upload a theatre banner image.");
        return;
      }

      if (!position) {
        setError("Please select the theatre location on the map.");
        return;
      }

      const payload = {
        name: formData.name.trim(),
        ownerEmail: formData.ownerEmail.trim(),
        city: formData.city.trim(),
        address: formData.address.trim(),
        bannerImage,
        gallery,
        location: {
          lat: position[0],
          lng: position[1],
        },
      };

      const res = isEdit
        ? await editTheatre(id, payload)
        : await createTheatre(payload);

      if (!res.success) {
        setError(res.message || `Failed to ${isEdit ? "update" : "create"} theatre`);

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
          `Failed to ${isEdit ? "update" : "create"} theatre`
      );

      setTimeout(() => {
        errorRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-[#080808] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-red-500 focus:ring-2 focus:ring-red-500/10";

  const labelClass = "mb-2 block text-sm font-medium text-gray-300";

  if (fetching) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 bg-[#080808] text-white">
        <FaSpinner className="animate-spin text-3xl text-red-500" />
        <p className="text-sm text-gray-400">Loading theatre details...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full min-w-0 max-w-7xl text-white">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-2xl">
          🎭
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {isEdit ? "Edit Theatre" : "Create Theatre"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {isEdit
              ? "Update theatre details and images"
              : "Create a theatre and invite its owner"}
          </p>
        </div>
      </div>

      {error && (
        <div
          ref={errorRef}
          className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400"
        >
          <span className="font-bold">!</span>
          <p>{error}</p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-8 rounded-2xl border border-white/[0.07] bg-[#111111] p-4 shadow-2xl sm:p-6 lg:p-8"
      >
        <section className="space-y-5">
          <div className="border-b border-white/[0.06] pb-3">
            <h2 className="text-base font-semibold">Theatre Information</h2>
            <p className="mt-1 text-xs text-gray-500">
              Enter the theatre and owner details.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className={labelClass}>Theatre Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter theatre name"
                value={formData.name}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Owner Email</label>
              <input
                type="email"
                name="ownerEmail"
                placeholder="owner@example.com"
                value={formData.ownerEmail}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>City</label>
              <input
                type="text"
                name="city"
                placeholder="Enter city"
                value={formData.city}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Address</label>
              <input
                type="text"
                name="address"
                placeholder="Enter full address"
                value={formData.address}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="border-b border-white/[0.06] pb-3">
            <h2 className="text-base font-semibold">Banner Image</h2>
            <p className="mt-1 text-xs text-gray-500">
              Upload a theatre banner image. Maximum size: 5MB.
            </p>
          </div>

          <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-white/10 bg-[#080808] p-6 text-center transition hover:border-red-500/60">
            {uploadingBanner ? (
              <>
                <FaSpinner className="animate-spin text-2xl text-red-500" />
                <span className="text-sm text-gray-400">Uploading banner...</span>
              </>
            ) : (
              <>
                <FaImage className="text-3xl text-red-500" />
                <span className="text-sm font-medium text-gray-300">
                  Click to upload banner
                </span>
                <span className="text-xs text-gray-600">
                  JPG, PNG, WEBP, AVIF
                </span>
              </>
            )}

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={handleBannerUpload}
              disabled={uploadingBanner || loading}
              className="hidden"
            />
          </label>

          {bannerPreview && (
            <div className="overflow-hidden rounded-xl border border-white/10 bg-[#080808]">
              <img
                src={bannerPreview}
                alt="Theatre banner preview"
                className="h-56 w-full object-cover sm:h-72"
              />
              <div className="border-t border-white/[0.06] px-4 py-3 text-xs text-gray-500">
                {bannerImage ? "Banner uploaded successfully" : "Banner preview"}
              </div>
            </div>
          )}
        </section>

        <section className="space-y-4">
          <div className="border-b border-white/[0.06] pb-3">
            <h2 className="text-base font-semibold">Theatre Location</h2>
            <p className="mt-1 text-xs text-gray-500">
              Select the theatre location on the map.
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-white/10 bg-[#080808] p-2 sm:p-4">
            <LocationPicker position={position} setPosition={setPosition} />
          </div>

          {position && (
            <p className="text-xs text-gray-500">
              Selected coordinates: {position[0]}, {position[1]}
            </p>
          )}
        </section>

        <section className="space-y-4">
          <div className="border-b border-white/[0.06] pb-3">
            <h2 className="text-base font-semibold">Theatre Gallery</h2>
            <p className="mt-1 text-xs text-gray-500">
              Upload multiple images. Each image must be smaller than 5MB.
            </p>
          </div>

          <label className="flex cursor-pointer items-center justify-center gap-3 rounded-xl border border-white/10 bg-[#080808] px-4 py-4 text-sm text-gray-300 transition hover:border-red-500/50 hover:text-red-400">
            {uploadingGallery ? (
              <FaSpinner className="animate-spin text-red-500" />
            ) : (
              <FaPlus className="text-red-500" />
            )}
            {uploadingGallery ? "Uploading gallery images..." : "Add Gallery Images"}
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={handleGalleryUpload}
              disabled={uploadingGallery || loading}
              className="hidden"
            />
          </label>

          {gallery.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {gallery.map((img, index) => (
                <div
                  key={`${img}-${index}`}
                  className="group relative overflow-hidden rounded-xl border border-white/10 bg-[#080808]"
                >
                  <img
                    src={img}
                    alt={`Theatre gallery ${index + 1}`}
                    className="h-36 w-full object-cover sm:h-40"
                  />

                  <button
                    type="button"
                    aria-label={`Remove gallery image ${index + 1}`}
                    onClick={() => removeGalleryImage(index)}
                    className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-lg bg-red-600 text-white shadow-lg transition hover:bg-red-700"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-white/10 bg-[#080808] px-4 py-8 text-center text-sm text-gray-600">
              No gallery images added yet.
            </div>
          )}
        </section>

        <div className="border-t border-white/[0.06] pt-6">
          <button
            type="submit"
            disabled={loading || uploadingBanner || uploadingGallery}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" />
                {isEdit ? "Updating Theatre..." : "Creating Theatre..."}
              </>
            ) : (
              <>
                {isEdit ? <FaPen /> : <FaPlus />}
                {isEdit ? "Update Theatre" : "Create Theatre"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TheatreOwners;