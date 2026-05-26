import {
  Navigate
} from "react-router-dom";

import {
  useSelector
} from "react-redux";

function TheatreOwnerProtectedRoute({
  children
}) {

  const { user, loading } = useSelector((state) => state.auth);

  if (loading) {

    return (
      <div
        className="
          min-h-screen
          bg-black
        "
      />
    );
  }

  if (!user) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (user?.role !== "theatre_owner") {

    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return children;
}

export default TheatreOwnerProtectedRoute;