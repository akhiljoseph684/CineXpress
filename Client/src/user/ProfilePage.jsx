import React, {
  useState,
} from "react";

import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaCamera,
  FaCrown,
  FaSignOutAlt,
  FaLock,
  FaTicketAlt,
  FaHeart,
  FaArrowLeft,
} from "react-icons/fa";

import {
  useSelector,
  useDispatch,
} from "react-redux";

import {
  updateUser,
  logout,
} from "../features/authSlice";

import {
  useNavigate,
} from "react-router-dom";

import {
  updateUser as updateUserApi,
} from "../services/usersAPi";
import { logoutApi } from "../services/authApi";

function ProfilePage() {

  const navigate =
    useNavigate();

  const dispatch =
    useDispatch();

  const { user } =
    useSelector(
      (state) => state.auth
    );

  const [loading,
    setLoading] =
    useState(false);

  const [uploading,
    setUploading] =
    useState(false);

  const [formData,
    setFormData] =
    useState({

      name:
        user?.name || "",

      phone:
        user?.phone || "",

      avatar:
        user?.avatar || "",

    });

  const handleChange =
    (e) => {

      setFormData({

        ...formData,

        [e.target.name]:
          e.target.value,

      });
    };

  const uploadImage =
    async (file) => {

      try {

        setUploading(true);

        const data =
          new FormData();

        data.append(
          "file",
          file
        );

        data.append(
          "upload_preset",

          import.meta.env
            .VITE_CLOUDINARY_UPLOAD_PRESET_USERS_NAME
        );

        const res =
          await fetch(

            import.meta.env
              .VITE_CLOUDINARY_URL,

            {
              method: "POST",

              body: data,
            }

          );

        const uploadedImage =
          await res.json();

        setFormData((prev) => ({

          ...prev,

          avatar:
            uploadedImage.secure_url,

        }));

      } catch (error) {

        console.log(error);

      } finally {

        setUploading(false);

      }
    };

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        const res =
          await updateUserApi({

            name:
              formData.name,

            phone:
              formData.phone,

            avatar:
              formData.avatar,

          });

        dispatch(
          updateUser(
            res.user
          )
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }
    };

  const handleLogout =
    () => {

      try {
        dispatch(logout());
        logoutApi()
        navigate("/login");
      } catch (error) {
        console.log(error)
      }

    };

  return (
    <div
      className="
        min-h-screen
        bg-black
        text-white

        px-4 md:px-8
        py-10
      "
    >

      <div
        className="
          max-w-7xl
          mx-auto
        "
      >

        <button
          onClick={() =>
            navigate("/")
          }
          className="
            flex items-center
            gap-2

            mb-8

            bg-white/5
            hover:bg-white/10

            px-5 py-3

            rounded-2xl

            transition
          "
        >

          <FaArrowLeft />

          Back Home

        </button>

        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-3

            gap-8
          "
        >

          <div
            className="
              bg-[#111]

              border border-white/10

              rounded-3xl

              p-6

              h-fit
            "
          >

            <div
              className="
                flex flex-col
                items-center
                text-center
              "
            >

              <div
                className="
                  relative
                "
              >

                <img
                  src={
                    formData.avatar ||

                    user?.avatar ||

                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThZwd0Ar5WsR1Z-ylhArKLTDqEhKPlMqWvZw&s"
                  }

                  alt="profile"

                  className="
                    w-32 h-32

                    rounded-full

                    object-cover

                    border-4
                    border-pink-500/30
                  "
                />

                <label
                  className="
                    absolute
                    bottom-0
                    right-0

                    w-11 h-11

                    rounded-full

                    bg-pink-500

                    flex items-center
                    justify-center

                    cursor-pointer
                  "
                >

                  <FaCamera />

                  <input
                    type="file"

                    hidden

                    accept="image/*"

                    onChange={(e) => {

                      uploadImage(
                        e.target.files[0]
                      );

                    }}
                  />

                </label>

              </div>

              <h2
                className="
                  text-2xl
                  font-bold

                  mt-5
                "
              >

                {user?.name}

              </h2>

              <p
                className="
                  text-gray-400
                  mt-2
                "
              >

                {user?.email}

              </p>

              <div
                className="
                  mt-4

                  px-4 py-2

                  rounded-full

                  bg-pink-500/10

                  text-pink-400
                  text-sm

                  border
                  border-pink-500/20
                "
              >

                {
                  user?.role ===
                  "theatre_owner"

                    ? "Theatre Owner"

                    : user?.role === "admin" ? "Admin" : "User"
                }

              </div>

            </div>

            <div
              className="
                mt-8
                space-y-5
              "
            >

              <div
                className="
                  flex items-center
                  gap-4
                "
              >

                <div
                  className="
                    w-12 h-12

                    rounded-xl

                    bg-white/5

                    flex items-center
                    justify-center
                  "
                >

                  <FaEnvelope />

                </div>

                <div>

                  <p
                    className="
                      text-gray-400
                      text-sm
                    "
                  >

                    Email

                  </p>

                  <h3
                    className="
                      font-medium
                    "
                  >

                    {user?.email}

                  </h3>

                </div>

              </div>

              <div
                className="
                  flex items-center
                  gap-4
                "
              >

                <div
                  className="
                    w-12 h-12

                    rounded-xl

                    bg-white/5

                    flex items-center
                    justify-center
                  "
                >

                  <FaPhoneAlt />

                </div>

                <div>

                  <p
                    className="
                      text-gray-400
                      text-sm
                    "
                  >

                    Phone

                  </p>

                  <h3
                    className="
                      font-medium
                    "
                  >

                    {
                      user?.phone ||
                      "Not Added"
                    }

                  </h3>

                </div>

              </div>
              
              <div
                className="
                  flex items-center
                  gap-4
                "
              >

                <div
                  className="
                    w-12 h-12

                    rounded-xl

                    bg-white/5

                    flex items-center
                    justify-center
                  "
                >

                  <FaMapMarkerAlt />

                </div>

                <div>

                  <p
                    className="
                      text-gray-400
                      text-sm
                    "
                  >

                    Preferred City

                  </p>

                  <h3
                    className="
                      font-medium
                    "
                  >

                    {
                      user?.preferredCity ||
                      "Not Selected"
                    }

                  </h3>

                </div>

              </div>

            </div>

            <div
              className="
                mt-10
                space-y-4
              "
            >

              <button
                className="
                  w-full

                  flex items-center
                  gap-3

                  bg-white/5

                  hover:bg-white/10

                  rounded-2xl

                  px-5 py-4

                  transition
                "
              >

                <FaTicketAlt />

                My Bookings

              </button>

              <button
                className="
                  w-full

                  flex items-center
                  gap-3

                  bg-white/5

                  hover:bg-white/10

                  rounded-2xl

                  px-5 py-4

                  transition
                "
              >

                <FaHeart />

                Favourite Movies

              </button>

              <button
                className="
                  w-full

                  flex items-center
                  gap-3

                  bg-white/5

                  hover:bg-white/10

                  rounded-2xl

                  px-5 py-4

                  transition
                "
              >

                <FaLock />

                Change Password

              </button>

              <button
                onClick={handleLogout}
                className="
                  w-full

                  flex items-center
                  gap-3

                  bg-red-500/10

                  hover:bg-red-500/20

                  text-red-400

                  rounded-2xl

                  px-5 py-4

                  transition
                "
              >

                <FaSignOutAlt />

                Logout

              </button>

            </div>

          </div>

          <div
            className="
              lg:col-span-2
              space-y-8
            "
          >

            <div
              className="
                bg-[#111]

                border border-white/10

                rounded-3xl

                p-6 md:p-8
              "
            >

              <h2
                className="
                  text-3xl
                  font-bold

                  mb-8
                "
              >

                Edit Profile

              </h2>

              <form
                onSubmit={handleSubmit}
                className="
                  space-y-6
                "
              >

                <div>

                  <label
                    className="
                      text-sm
                      text-gray-400
                      block
                      mb-3
                    "
                  >

                    Full Name

                  </label>

                  <input
                    type="text"

                    name="name"

                    value={formData.name}

                    onChange={handleChange}

                    className="
                      w-full

                      bg-black/40

                      border border-white/10

                      rounded-2xl

                      px-5 py-4

                      outline-none

                      focus:border-pink-500/50
                    "
                  />

                </div>

                <div>

                  <label
                    className="
                      text-sm
                      text-gray-400
                      block
                      mb-3
                    "
                  >

                    Email

                  </label>

                  <input
                    type="email"

                    disabled

                    value={user?.email}

                    className="
                      w-full

                      bg-black/30

                      border border-white/10

                      rounded-2xl

                      px-5 py-4

                      opacity-70
                    "
                  />

                </div>

                <div>

                  <label
                    className="
                      text-sm
                      text-gray-400
                      block
                      mb-3
                    "
                  >

                    Phone

                  </label>

                  <input
                    type="text"

                    name="phone"

                    value={formData.phone}

                    onChange={handleChange}

                    className="
                      w-full

                      bg-black/40

                      border border-white/10

                      rounded-2xl

                      px-5 py-4

                      outline-none

                      focus:border-pink-500/50
                    "
                  />

                </div>

                <button
                  disabled={
                    loading ||
                    uploading
                  }

                  className="
                    bg-pink-600

                    hover:bg-pink-700

                    transition

                    px-8 py-4

                    rounded-2xl

                    font-semibold

                    disabled:opacity-50
                  "
                >

                  {
                    uploading

                      ? "Uploading Image..."

                      : loading

                        ? "Saving..."

                        : "Save Changes"
                  }

                </button>

              </form>

            </div>

            {
              user?.role === "user" &&
              (
                <div
                  className="
                    bg-gradient-to-r
                    from-pink-500/10
                    to-purple-500/10

                    border border-pink-500/20

                    rounded-3xl

                    p-8
                  "
                >

                  <div
                    className="
                      flex flex-col
                      md:flex-row

                      md:items-center
                      md:justify-between

                      gap-6
                    "
                  >

                    <div>

                      <div
                        className="
                          w-16 h-16

                          rounded-2xl

                          bg-pink-500/20

                          text-pink-400

                          flex items-center
                          justify-center

                          text-2xl

                          mb-5
                        "
                      >

                        <FaCrown />

                      </div>

                      <h2
                        className="
                          text-3xl
                          font-bold
                        "
                      >

                        Become Theatre Owner

                      </h2>

                      <p
                        className="
                          text-gray-300
                          mt-4
                          leading-relaxed
                        "
                      >

                        Start managing theatres,
                        screens and bookings 🎬

                      </p>

                    </div>

                    <button
                      className="
                        bg-pink-600
                        hover:bg-pink-700
                        transition
                        px-8 py-4
                        rounded-2xl
                        font-semibold
                      "
                    >

                      Apply Now

                    </button>

                  </div>

                </div>
              )
            }

          </div>

        </div>

      </div>

    </div>
  );
}

export default ProfilePage;