import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCredentials, logout } from "./features/authSlice";
import { refreshToken } from "./services/authApi";
import { Route, Routes } from "react-router-dom";
import RegisterLogin from "./pages/RegisterLogin";
import Home from "./pages/Home";
import ProtectedRoute from "./Components/ProtectRoute";

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
    </Routes>
  );
}

export default App;