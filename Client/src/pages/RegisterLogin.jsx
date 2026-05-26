import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { login, register } from "../services/authApi.js";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../features/authSlice.js";

function RegisterLogin({ status }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { accessToken, user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",

    email: searchParams.get("email") || "",

    password: "",

    secretCode: searchParams.get("code") || "",

    role: "user",
  });

  useEffect(() => {
    if (accessToken && user) {
      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "theatre_owner") {
        navigate("/theatre-owner");
      } else {
        navigate("/");
      }
    }
  }, [accessToken, user, navigate]);

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    general: "",
  });

  useEffect(() => {
    setFormData({
      name: "",

      email: searchParams.get("email") || "",

      password: "",

      secretCode: searchParams.get("code") || "",

      role: "user",
    });

    setErrors({
      name: "",
      email: "",
      password: "",
      general: "",
    });
  }, [status]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setErrors((prev) => ({ ...prev, [name]: "", general: "" }));

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let res;

      if (status === "signup") {
        res = await register(formData);
      } else {
        const { email, password } = formData;
        res = await login({ email, password });
      }

      if (!res?.success) {
        if (!res?.field) {
          setErrors((prev) => ({
            ...prev,
            ["general"]: res?.message || "Something went wrong",
          }));
        }
        setErrors((prev) => ({
          ...prev,
          [res?.field]: res?.message || "Something went wrong",
        }));
        return;
      }

      dispatch(
        setCredentials({
          user: res.user || null,
          accessToken: res.accessToken,
        }),
      );

      if (res.user.role === "admin") {
        navigate("/admin");
      } else if (res.user.role === "theatre_owner") {
        navigate("/theatre-owner");
      } else {
        console.log(res.user);
        navigate("/");
      }
    } catch (error) {
      if (error?.field) {
        setErrors((prev) => ({
          ...prev,
          [error.field]: error.message || "Something went wrong",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          general: error?.message || "Something went wrong",
        }));
      }
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#0f0f0f] text-white font-[Poppins]">
      <div className="flex flex-col md:flex-row w-full max-w-5xl rounded-2xl overflow-hidden bg-[#1a1a1a] shadow-2xl">
        <div
          className="relative w-full md:w-[55%] h-[250px] md:h-auto flex items-end p-8 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1000&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>

          <div className="relative z-10">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Experience Movies <br /> Like Never Before 🎬
            </h1>
            <p className="text-gray-300 text-sm md:text-base">
              Book your tickets in seconds.
            </p>
          </div>
        </div>

        <div className="w-full md:w-[45%] p-8 md:p-10 flex flex-col justify-center">
          <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-semibold mb-1">
              {status === "login" ? "Welcome Back" : "Create Account"}
            </h2>

            <p className="text-gray-400 text-sm mb-8">
              Please enter your details
            </p>

            {errors.general && (
              <div className="mb-5 p-3 rounded-lg border border-red-500 bg-red-500/10 text-red-400 text-sm text-center">
                ⚠ {errors.general}
              </div>
            )}

            {status === "signup" && (
              <div className="mb-5">
                <div className="relative">
                  <FaUser
                    className={`absolute left-3 top-1/2 -translate-y-1/2 
                  ${errors.name ? "text-red-500" : "text-gray-400"}`}
                  />

                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 bg-transparent border rounded-lg outline-none
                  ${
                    errors.name
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-700 focus:ring-[#8b5c76]"
                  }
                  focus:ring-1 transition`}
                  />
                </div>

                <p className="text-red-500 text-xs mt-1 h-4">{errors.name}</p>
              </div>
            )}

            <div className="mb-5">
              <div className="relative">
                <FaEnvelope
                  className={`absolute left-3 top-1/2 -translate-y-1/2 
                ${errors.email ? "text-red-500" : "text-gray-400"}`}
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 bg-transparent border rounded-lg outline-none
                ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-700 focus:ring-[#8b5c76]"
                }
                focus:ring-1 transition`}
                />
              </div>

              <p className="text-red-500 text-xs mt-1 h-4">{errors.email}</p>
            </div>

            <div className="mb-5">
              <div className="relative">
                <FaLock
                  className={`absolute left-3 top-1/2 -translate-y-1/2 
                  ${errors.password ? "text-red-500" : "text-gray-400"}`}
                />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-10 py-3 bg-transparent border rounded-lg outline-none
                  ${
                    errors.password
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-700 focus:ring-[#8b5c76]"
                  }
                  focus:ring-1 transition`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 
                  ${errors.password ? "text-red-500" : "text-gray-400"}`}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <p className="text-red-500 text-xs mt-1 h-4">{errors.password}</p>
            </div>
            {formData.secretCode && status === "signup" && (
              <div
                className="
                  mb-5
                "
              >
                <div
                  className="
                    relative
                  "
                >
                  <FaLock
                    className="
                    absolute
                    left-3
                    top-1/2

                    -translate-y-1/2

                    text-gray-400
                  "
                  />

                  <input
                    type="text"
                    name="secretCode"
                    placeholder="
                    Secret Code
                  "
                    value={formData.secretCode}
                    onChange={handleChange}
                    className="
                    w-full

                    pl-10
                    pr-4
                    py-3

                    bg-transparent

                    border
                    border-gray-700

                    rounded-lg

                    outline-none

                    focus:ring-1
                    focus:ring-[#8b5c76]
                  "
                  />
                </div>
              </div>
            )}

            <button className="w-full bg-gradient-to-r from-[#8b5c76] to-[#6f4660] py-3 rounded-lg font-semibold mb-4">
              {status === "login" ? "Sign In" : "Sign Up"}
            </button>

            <p className="text-center text-sm text-gray-400">
              {status === "login"
                ? "Don't have an account?"
                : "Already have an account?"}{" "}
              <Link
                to={status === "login" ? "/signup" : "/login"}
                className="text-[#8b5c76] font-semibold hover:underline"
              >
                {status === "login" ? "Sign up" : "Login"}
              </Link>
            </p>
            <button
              type="button"
              onClick={() =>
                (window.location.href = "http://localhost:5000/api/auth/google")
              }
              className="w-full flex items-center justify-center gap-3 border border-gray-600 rounded-lg py-3 hover:bg-[#252525] transition mt-5"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                alt="Google"
                className="w-5"
              />
              <span>Sign {status === "login" ? "in" : "up"} with Google</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterLogin;
