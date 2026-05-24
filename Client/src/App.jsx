import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCredentials, logout } from "./features/authSlice";
import { refreshToken } from "./services/authApi";
import { Route, Routes } from "react-router-dom";
import RegisterLogin from "./pages/RegisterLogin";
import ProtectedRoute from "./Components/ProtectRoute";
import Dashboard from "./admin/pages/Dashboard";
import Theatre from "./admin/pages/Theatre";
import Screens from "./admin/pages/Screens";
import Movies from "./admin/pages/Movies/Movies";
import Users from "./admin/pages/users/Users";
import Actors from "./admin/pages/Actors/Actors";
import Bookings from "./admin/pages/Bookings";
import AdminLayout from "./admin/AdminLayout";
import CreateMovie from "./admin/pages/Movies/CreateMovies";
import LanguageGenre from "./admin/pages/Categories";
import CreateActors from "./admin/pages/Actors/CreateActors";
import MovieDetails from "./admin/pages/Movies/MovieDetails";
import UserLayout from "./user/UserLayout";
import Home from "./user/Home";
import MoviesPage from "./user/MoviePage";
import ProfilePage from "./user/ProfilePage";
import MovieDetailsPage from "./user/MovieDetialsPage";
import AdminProtectedRoute from "./Components/AdminProtectedRoute";
import TheatreOwnerLayout from "./theatre_owner/TheatreOwnerLayout";
import Show from "./theatre_owner/Show";
import Screen from "./theatre_owner/Screen";
import TheatreListPage from "./theatre_owner/Theatre/TheatreListPage";
import CreateEditTheatre from "./theatre_owner/Theatre/CreateEditTheatre";
import ScreenListPage from "./theatre_owner/Screen/ScreenListPage";
import CreateEditScreen from "./theatre_owner/Screen/CreateEditScreen";
import ScreenList from "./admin/pages/Screens/ScreenList";
import CreateShowPage from "./theatre_owner/Shows/CreateShowPage";
import MovieShowsPage from "./user/MovieShowPage";
import SeatBookingPage from "./user/SeatBookingPage";
import "./App.css"

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadUser = async () => {

      try {
        const res = await refreshToken();

        dispatch(
          setCredentials({
            user: res.user,

            accessToken: res.accessToken,
          }),
        );
      } catch (err) {
        dispatch(logout());
      }
    };

    loadUser();
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/login" element={<RegisterLogin status="login" />} />
      <Route path="/signup" element={<RegisterLogin status="signup" />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <UserLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="movies" element={<MoviesPage />}></Route>
        <Route path="profile" element={<ProfilePage />}></Route>
        <Route path="movies/:id" element={<MovieDetailsPage />}></Route>
        <Route path="shows/movie/:movieId" element={<MovieShowsPage />} />
        <Route path="booking/movie/:showId" element={<SeatBookingPage />} />
      </Route>

      <Route path="/theatre-owner" element={<TheatreOwnerLayout />}>
        <Route path="theatre" element={<TheatreListPage />} />
        <Route path="theatre/create" element={<CreateEditTheatre />} />
        <Route path="theatre/edit/:id" element={<CreateEditTheatre />} />
        <Route path="screens" element={<ScreenListPage />} />
        <Route path="screens/create/:id" element={<CreateEditScreen />} />
        <Route path="screens/edit/:screenId" element={<CreateEditScreen />} />
        <Route path="shows/create/:screenId" element={<CreateShowPage />} />
        <Route path="shows/movie/:movieId" element={<MovieShowsPage />} />
      </Route>

      <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />

        <Route path="theatre" element={<Theatre />} />

        <Route path="screens" element={<ScreenList />} />

        <Route path="movies" element={<Movies />} />
        <Route path="movies/create" element={<CreateMovie />} />
        <Route path="movies/edit/:id" element={<CreateMovie />} />
        <Route path="movies/:id" element={<MovieDetails />} />

        <Route path="users" element={<Users />} />
        <Route path="users/:id" element={<Users />} />

        <Route path="actors" element={<Actors />} />
        <Route path="actors/create" element={<CreateActors />} />
        <Route path="actors/edit/:id" element={<CreateActors />} />

        <Route path="bookings" element={<Bookings />} />

        <Route path="categories" element={<LanguageGenre />} />
      </Route>
    </Routes>
  );
}

export default App;
