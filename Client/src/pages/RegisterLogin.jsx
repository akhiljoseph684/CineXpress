import React, { useState, useEffect } from "react";
import {
  FaEye,
  FaEyeSlash,
  FaUser,
  FaEnvelope,
  FaLock,
  FaFilm,
  FaSpinner,
} from "react-icons/fa";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { login, register } from "../services/authApi.js";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../features/authSlice.js";

function RegisterLogin({ status }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { accessToken, user } = useSelector((state) => state.auth);

  const isSignup = status === "signup";

  const [formData, setFormData] = useState({
    name: "",
    email: searchParams.get("email") || "",
    password: "",
    secretCode: searchParams.get("code") || "",
    role: "user",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    general: "",
  });

  useEffect(() => {
    if (accessToken && user) {
      if (user.role === "admin") {
        navigate("/admin", { replace: true });
      } else if (user.role === "theatre_owner") {
        navigate("/theatre-owner", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [accessToken, user, navigate]);

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

    setShowPassword(false);
  }, [status, searchParams]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLoading) return;

    setIsLoading(true);
    setErrors({
      name: "",
      email: "",
      password: "",
      general: "",
    });

    try {
      let res;

      if (isSignup) {
        res = await register(formData);
      } else {
        const { email, password } = formData;
        res = await login({ email, password });
      }

      if (!res?.success) {
        const field = res?.field;
        const message = res?.message || "Something went wrong.";

        if (field && ["name", "email", "password"].includes(field)) {
          setErrors((prev) => ({ ...prev, [field]: message }));
        } else {
          setErrors((prev) => ({ ...prev, general: message }));
        }

        return;
      }

      if (!res.user || !res.accessToken) {
        setErrors((prev) => ({
          ...prev,
          general: "Invalid authentication response. Please try again.",
        }));
        return;
      }

      dispatch(
        setCredentials({
          user: res.user,
          accessToken: res.accessToken,
        })
      );

      if (res.user.role === "admin") {
        navigate("/admin", { replace: true });
      } else if (res.user.role === "theatre_owner") {
        navigate("/theatre-owner", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (error) {
      const field = error?.field;
      const message = error?.message || "Unable to complete your request.";

      if (field && ["name", "email", "password"].includes(field)) {
        setErrors((prev) => ({ ...prev, [field]: message }));
      } else {
        setErrors((prev) => ({ ...prev, general: message }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full rounded-lg border bg-[#111111] py-2.5 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-gray-500 focus:ring-2 ${
      errors[field]
        ? "border-red-500 focus:ring-red-500/20"
        : "border-white/10 focus:border-red-500 focus:ring-red-500/20"
    }`;

  return (
    <main className="box-border flex h-dvh w-full items-center justify-center overflow-hidden bg-[#080808] px-3 py-3 font-[Poppins] text-white sm:px-5">
      <div className="flex max-h-full w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-[#111111] shadow-2xl shadow-black/50">
        <section
          className="relative hidden w-1/2 shrink-0 bg-cover bg-center md:flex md:items-end"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=85')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10" />
          <div className="absolute inset-0 bg-red-950/20" />

          <div className="relative z-10 p-7 lg:p-10">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600">
                <FaFilm className="text-lg" />
              </div>
              <h1 className="text-2xl font-extrabold">
                Cine<span className="text-red-500">Xpress</span>
              </h1>
            </div>

            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-red-400">
              Your movie experience
            </p>

            <h2 className="mb-4 text-3xl font-extrabold leading-tight lg:text-4xl">
              Experience Movies
              <br />
              Like Never Before.
            </h2>

            <p className="max-w-sm text-sm leading-6 text-gray-300">
              Discover the latest releases, choose your favourite seats, and
              book your next big-screen experience in just a few clicks.
            </p>
          </div>
        </section>

        <section className="flex min-w-0 flex-1 items-center justify-center px-5 py-4 sm:px-8 md:w-1/2 md:flex-none lg:px-10">
          <div className="w-full max-w-sm">
            <div className="mb-4 flex items-center gap-2 md:hidden">
              <FaFilm className="text-xl text-red-500" />
              <h1 className="text-xl font-extrabold">
                Cine<span className="text-red-500">Xpress</span>
              </h1>
            </div>

            <div className="mb-5">
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-red-500">
                {isSignup ? "Join CineXpress" : "Welcome back"}
              </p>

              <h2 className="text-2xl font-bold sm:text-3xl">
                {isSignup ? "Create Account" : "Sign In"}
              </h2>

              <p className="mt-1.5 text-sm text-gray-400">
                {isSignup
                  ? "Create your account and get ready for your next movie."
                  : "Sign in to continue your movie booking experience."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {errors.general && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs leading-5 text-red-400"
                >
                  {errors.general}
                </div>
              )}

              {isSignup && (
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1.5 block text-xs font-medium text-gray-300"
                  >
                    Full Name
                  </label>

                  <div className="relative">
                    <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      id="name"
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      autoComplete="name"
                      required
                      aria-invalid={Boolean(errors.name)}
                      className={inputClass("name")}
                    />
                  </div>

                  {errors.name && (
                    <p className="mt-1 text-xs text-red-400">{errors.name}</p>
                  )}
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-xs font-medium text-gray-300"
                >
                  Email Address
                </label>

                <div className="relative">
                  <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                    aria-invalid={Boolean(errors.email)}
                    className={inputClass("email")}
                  />
                </div>

                {errors.email && (
                  <p className="mt-1 text-xs text-red-400">{errors.email}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-xs font-medium text-gray-300"
                >
                  Password
                </label>

                <div className="relative">
                  <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete={
                      isSignup ? "new-password" : "current-password"
                    }
                    required
                    aria-invalid={Boolean(errors.password)}
                    className={`${inputClass("password")} pr-11`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-red-500"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                {errors.password && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.password}
                  </p>
                )}
              </div>

              {isSignup && formData.secretCode && (
                <div>
                  <label
                    htmlFor="secretCode"
                    className="mb-1.5 block text-xs font-medium text-gray-300"
                  >
                    Secret Code
                  </label>

                  <div className="relative">
                    <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      id="secretCode"
                      type="text"
                      name="secretCode"
                      placeholder="Enter your secret code"
                      value={formData.secretCode}
                      onChange={handleChange}
                      className={inputClass("secretCode")}
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 py-3 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-[#111111] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Please wait...
                  </>
                ) : isSignup ? (
                  "Create Account"
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className="my-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-[10px] uppercase tracking-widest text-gray-500">
                Or continue with
              </span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <button
              type="button"
              disabled={isLoading}
              onClick={() => {
                const backendUrl = import.meta.env.VITE_BACKEND_API_URL;

                if (!backendUrl) {
                  setErrors((prev) => ({
                    ...prev,
                    general: "Google sign-in is not configured.",
                  }));
                  return;
                }

                window.location.href = `${backendUrl.replace(/\/$/, "")}/auth/google`;
              }}
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] py-2.5 text-sm font-medium text-gray-200 transition hover:border-red-500/40 hover:bg-white/[0.06] disabled:opacity-60"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                alt=""
                aria-hidden="true"
                className="h-4 w-4"
              />
              Sign {isSignup ? "up" : "in"} with Google
            </button>

            <p className="mt-4 text-center text-xs text-gray-400">
              {isSignup
                ? "Already have an account?"
                : "Don't have an account?"}{" "}
              <Link
                to={isSignup ? "/login" : "/signup"}
                className="font-semibold text-red-500 transition hover:text-red-400 hover:underline"
              >
                {isSignup ? "Sign in" : "Sign up"}
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default RegisterLogin;