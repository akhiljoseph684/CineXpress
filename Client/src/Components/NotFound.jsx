import React from "react";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f0f0f] text-white px-4">
      <h1 className="text-8xl font-bold text-pink-600">404</h1>

      <h2 className="text-2xl font-semibold mt-4">Page Not Found</h2>

      <p className="text-gray-400 mt-2 text-center">
        The page you are looking for does not exist.
      </p>

      <button
        onClick={() => navigate("/")}
        className="mt-6 px-6 py-3 bg-pink-600 hover:bg-pink-700 rounded-lg hover:opacity-90"
      >
        Go Home
      </button>
    </div>
  );
}

export default NotFound;
