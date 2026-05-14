import {
  Navigate
} from "react-router-dom";

import {
  useSelector
} from "react-redux";

function AdminProtectedRoute({
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

  if (user.role !== "admin") {

    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return children;
}

export default AdminProtectedRoute;