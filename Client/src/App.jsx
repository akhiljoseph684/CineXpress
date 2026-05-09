import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCredentials, logout } from "./features/authSlice";
import { refreshToken } from "./services/authApi";
import { Route, Routes } from "react-router-dom";
import RegisterLogin from "./pages/RegisterLogin";
import Home from "./pages/Home";
import ProtectedRoute from "./Components/ProtectRoute";
import Dashboard from "./admin/pages/Dashboard";
import Theatre from "./admin/pages/Theatre";
import Screens from "./admin/pages/Screens";
import Movies from "./admin/pages/Movies/Movies";
import Users from "./admin/pages/Users";
import Actors from "./admin/pages/Actors/Actors";
import Bookings from "./admin/pages/Bookings";
import AdminLayout from "./admin/AdminLayout";
import CreateMovie from "./admin/pages/Movies/CreateMovies";
import LanguageGenre from "./admin/pages/Categories";
import CreateActors from "./admin/pages/Actors/CreateActors";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await refreshToken();

        dispatch(setCredentials({
          user: null,
          accessToken: res.accessToken,
        }));

      } catch (err) {
        dispatch(logout());
      }
    };

    loadUser();
  }, []);

  return(
    <Routes>
      <Route path="/" element={
        <ProtectedRoute>
          <Home/>
        </ProtectedRoute>
      } />
      <Route path="/login" element={<RegisterLogin status="login"/>} />
      <Route path="/signup" element={<RegisterLogin status="signup"/>} />
      <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="theatre" element={<Theatre />} />
          <Route path="screens" element={<Screens />} />
          <Route path="movies" element={<Movies />} />
          <Route path="movies/create" element={<CreateMovie />} />
          <Route path="movies/edit/:id" element={<CreateMovie />} />
          <Route path="users" element={<Users />} />
          <Route path="actors" element={<Actors />} />
          <Route path="actors/create" element={<CreateActors />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="categories" element={<LanguageGenre />} />
        </Route>
    </Routes>
  );
}

export default App;