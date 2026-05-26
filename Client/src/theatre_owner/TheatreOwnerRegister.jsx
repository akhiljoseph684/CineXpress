import React, {
  useState,
} from "react";

import {
  FaLock,
  FaEnvelope,
  FaUser,
} from "react-icons/fa";

import { Link,
  useNavigate,
} from "react-router-dom";

import API from "../../services/api";

function TheatreOwnerRegister() {

  const navigate =
    useNavigate();

  const [formData,
    setFormData] =
    useState({

      name: "",

      email: "",

      password: "",

      secretCode: "",
    });

  const [loading,
    setLoading] =
    useState(false);

  const [error,
    setError] =
    useState("");

  const handleChange =
    (e) => {

      setFormData({

        ...formData,

        [e.target.name]:
          e.target.value,
      });
    };

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        setError("");

        const res =
          await API.post(

            "/auth/register",

            formData
          );

        if (
          !res.data.success
        ) {

          setError(
            res.data.message
          );

          return;
        }

        navigate("/login");

      } catch (error) {

        setError(

          error.response
            ?.data
            ?.message ||

          "Registration failed"
        );

      } finally {

        setLoading(false);
      }
    };

  return (

    <div
      className="
        min-h-screen

        bg-[#0f0f0f]

        flex
        items-center
        justify-center

        px-5
      "
    >

      <div
        className="
          w-full
          max-w-md

          bg-[#1a1a1a]

          border
          border-gray-800

          rounded-3xl

          p-8
        "
      >

        {/* HEADER */}

        <div
          className="
            text-center
            mb-8
          "
        >

          <h1
            className="
              text-3xl
              font-bold
            "
          >

            Theatre Owner 🎭

          </h1>

          <p
            className="
              text-gray-400
              mt-2
            "
          >

            Register using
            your secret code

          </p>

        </div>

        {/* ERROR */}

        {
          error && (

            <div
              className="
                mb-5

                bg-red-500/10

                border
                border-red-500/20

                rounded-2xl

                p-4

                text-red-400
                text-sm
              "
            >

              {error}

            </div>
          )
        }

        {/* FORM */}

        <form
          onSubmit={
            handleSubmit
          }

          className="
            space-y-5
          "
        >

          {/* NAME */}

          <div
            className="
              relative
            "
          >

            <FaUser
              className="
                absolute
                left-4
                top-1/2

                -translate-y-1/2

                text-gray-500
              "
            />

            <input
              type="text"

              name="name"

              placeholder="
                Full Name
              "

              value={
                formData.name
              }

              onChange={
                handleChange
              }

              className="
                w-full

                bg-[#111]

                border
                border-gray-800

                rounded-2xl

                pl-12
                pr-4
                py-4

                outline-none

                focus:border-[#8b5c76]
              "
            />

          </div>

          {/* EMAIL */}

          <div
            className="
              relative
            "
          >

            <FaEnvelope
              className="
                absolute
                left-4
                top-1/2

                -translate-y-1/2

                text-gray-500
              "
            />

            <input
              type="email"

              name="email"

              placeholder="
                Email Address
              "

              value={
                formData.email
              }

              onChange={
                handleChange
              }

              className="
                w-full

                bg-[#111]

                border
                border-gray-800

                rounded-2xl

                pl-12
                pr-4
                py-4

                outline-none

                focus:border-[#8b5c76]
              "
            />

          </div>

          {/* PASSWORD */}

          <div
            className="
              relative
            "
          >

            <FaLock
              className="
                absolute
                left-4
                top-1/2

                -translate-y-1/2

                text-gray-500
              "
            />

            <input
              type="password"

              name="password"

              placeholder="
                Create Password
              "

              value={
                formData.password
              }

              onChange={
                handleChange
              }

              className="
                w-full

                bg-[#111]

                border
                border-gray-800

                rounded-2xl

                pl-12
                pr-4
                py-4

                outline-none

                focus:border-[#8b5c76]
              "
            />

          </div>

          {/* SECRET CODE */}

          <div
            className="
              relative
            "
          >

            <FaLock
              className="
                absolute
                left-4
                top-1/2

                -translate-y-1/2

                text-gray-500
              "
            />

            <input
              type="text"

              name="secretCode"

              placeholder="
                Secret Code
              "

              value={
                formData.secretCode
              }

              onChange={
                handleChange
              }

              className="
                w-full

                bg-[#111]

                border
                border-gray-800

                rounded-2xl

                pl-12
                pr-4
                py-4

                outline-none

                focus:border-[#8b5c76]
              "
            />

          </div>

          {/* BUTTON */}

          <button
            type="submit"

            disabled={loading}

            className="
              w-full

              bg-gradient-to-r
              from-[#8b5c76]
              to-[#6f4660]

              py-4

              rounded-2xl

              font-medium

              hover:opacity-90

              transition
            "
          >

            {
              loading

                ? "Creating Account..."

                : "Create Account"
            }

          </button>

        </form>

        {/* LOGIN */}

        <div
          className="
            mt-6

            text-center
            text-sm

            text-gray-400
          "
        >

          Already have account?

          <Link
            to="/login"

            className="
              text-[#d6a7c1]
              ml-2
            "
          >

            Login

          </Link>

        </div>

      </div>

    </div>
  );
}

export default TheatreOwnerRegister;