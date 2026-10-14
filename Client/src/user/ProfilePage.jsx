import React, { useEffect, useState } from "react";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaCamera,
  FaSignOutAlt,
  FaTicketAlt,
  FaArrowLeft,
  FaUser,
  FaCheckCircle,
} from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { updateUser, logout } from "../features/authSlice";
import { useNavigate } from "react-router-dom";
import { updateUser as updateUserApi } from "../services/usersAPi";
import { logoutApi } from "../services/authApi";

function ProfilePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    avatar: user?.avatar || "",
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    setFormData({
      name: user?.name || "",
      phone: user?.phone || "",
      avatar: user?.avatar || "",
    });
  }, [user]);

  useEffect(() => {
    if (!toast) return undefined;

    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const uploadImage = async (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please select a valid image.", "error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast("Image size must be less than 5 MB.", "error");
      return;
    }

    const uploadUrl = import.meta.env.VITE_CLOUDINARY_URL;
    const uploadPreset =
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET_USERS_NAME;

    if (!uploadUrl || !uploadPreset) {
      showToast("Image upload configuration is missing.", "error");
      return;
    }

    try {
      setUploading(true);

      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", uploadPreset);

      const res = await fetch(uploadUrl, {
        method: "POST",
        body: data,
      });

      const uploadedImage = await res.json();

      if (!res.ok || !uploadedImage.secure_url) {
        throw new Error(uploadedImage.error?.message || "Image upload failed.");
      }

      setFormData((prev) => ({
        ...prev,
        avatar: uploadedImage.secure_url,
      }));

      showToast("Profile image uploaded successfully.");
    } catch (error) {
      console.error(error);
      showToast(error?.message || "Failed to upload image.", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showToast("Name cannot be empty.", "error");
      return;
    }

    try {
      setLoading(true);

      const res = await updateUserApi({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        avatar: formData.avatar,
      });

      if (res?.user) {
        dispatch(updateUser(res.user));
        showToast("Profile updated successfully.");
      } else {
        throw new Error("Unable to update profile.");
      }
    } catch (error) {
      console.error(error);
      showToast(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update profile.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(logout());
      navigate("/login", { replace: true });
    }
  };

  const fallbackImage =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThZwd0Ar5WsR1Z-ylhArKLTDqEhKPlMqWvZw&s";

  return (
    <div className="min-h-screen bg-black px-4 py-8 text-white sm:px-6 sm:py-10 md:px-8">
      <div className="mx-auto max-w-7xl">
        <button
          onClick={() => navigate("/")}
          className="mb-8 flex items-center gap-2 rounded-xl border border-gray-800 bg-[#111111] px-5 py-3 text-gray-300 transition hover:border-red-600/50 hover:text-red-400"
        >
          <FaArrowLeft />
          Back Home
        </button>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="h-fit rounded-3xl border border-gray-800 bg-[#111111] p-6 sm:p-8">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <img
                  src={formData.avatar || user?.avatar || fallbackImage}
                  alt="Profile"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = fallbackImage;
                  }}
                  className="h-32 w-32 rounded-full border-4 border-red-600/40 object-cover"
                />

                <label className="absolute bottom-0 right-0 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition hover:bg-red-700">
                  {uploading ? (
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <FaCamera />
                  )}

                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    disabled={uploading}
                    onChange={(e) => {
                      uploadImage(e.target.files?.[0]);
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>

              <h2 className="mt-5 text-2xl font-bold">
                {user?.name || "User"}
              </h2>

              <p className="mt-2 break-all text-sm text-gray-400">
                {user?.email}
              </p>

              <div className="mt-4 rounded-full border border-red-600/30 bg-red-600/10 px-4 py-2 text-sm text-red-400">
                {user?.role === "theatre_owner"
                  ? "Theatre Owner"
                  : user?.role === "admin"
                    ? "Admin"
                    : "User"}
              </div>
            </div>

            <div className="mt-8 space-y-5 border-t border-gray-800 pt-7">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-600/10 text-red-400">
                  <FaEnvelope />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-gray-500">Email</p>
                  <h3 className="break-all font-medium">{user?.email || "-"}</h3>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-600/10 text-red-400">
                  <FaPhoneAlt />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <h3 className="font-medium">{user?.phone || "Not Added"}</h3>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-600/10 text-red-400">
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Preferred City</p>
                  <h3 className="font-medium">
                    {user?.preferredCity || "Not Selected"}
                  </h3>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-4 border-t border-gray-800 pt-7">
              {user?.role === "user" && (
                <button
                  onClick={() => navigate("/my-bookings")}
                  className="flex w-full items-center gap-3 rounded-2xl border border-gray-800 bg-black px-5 py-4 transition hover:border-red-600/50 hover:bg-red-600/5"
                >
                  <FaTicketAlt className="text-red-500" />
                  My Bookings
                </button>
              )}

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-2xl border border-red-600/20 bg-red-600/10 px-5 py-4 text-red-400 transition hover:bg-red-600/20"
              >
                <FaSignOutAlt />
                Logout
              </button>
            </div>
          </div>

          <div className="space-y-8 lg:col-span-2">
            <div className="rounded-3xl border border-gray-800 bg-[#111111] p-6 sm:p-8">
              <div className="mb-8 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600/10 text-red-500">
                  <FaUser />
                </div>

                <div>
                  <h2 className="text-2xl font-bold sm:text-3xl">
                    Edit <span className="text-red-500">Profile</span>
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Manage your personal information
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-3 block text-sm text-gray-400"
                  >
                    Full Name
                  </label>

                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    maxLength={100}
                    className="w-full rounded-2xl border border-gray-800 bg-black px-5 py-4 outline-none transition focus:border-red-600 focus:ring-1 focus:ring-red-600"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-3 block text-sm text-gray-400"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    type="email"
                    disabled
                    value={user?.email || ""}
                    className="w-full cursor-not-allowed rounded-2xl border border-gray-800 bg-black/50 px-5 py-4 text-gray-500 opacity-80"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-3 block text-sm text-gray-400"
                  >
                    Phone
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    maxLength={20}
                    className="w-full rounded-2xl border border-gray-800 bg-black px-5 py-4 outline-none transition focus:border-red-600 focus:ring-1 focus:ring-red-600"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="mb-3 block text-sm text-gray-400">
                    Profile Image
                  </label>

                  <p className="text-sm text-gray-500">
                    {uploading
                      ? "Uploading your image..."
                      : formData.avatar
                        ? "Image selected. Save changes to update your profile."
                        : "Choose an image using the camera icon above."}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading || uploading}
                  className="flex items-center justify-center gap-3 rounded-2xl bg-red-600 px-8 py-4 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaCheckCircle />
                      Save Changes
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <div
          role="status"
          className={`fixed right-4 top-5 z-50 flex max-w-[calc(100%-2rem)] items-center gap-3 rounded-2xl border px-5 py-4 font-semibold shadow-2xl sm:right-6 sm:top-6 ${
            toast.type === "error"
              ? "border-red-500/40 bg-[#260b0b] text-red-300"
              : "border-green-500/30 bg-[#0b2115] text-green-300"
          }`}
        >
          {toast.type === "error" ? <FaCamera /> : <FaCheckCircle />}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;