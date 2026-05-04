import { useDispatch } from "react-redux";
import { logout } from "../features/authSlice";
import { logoutApi } from "../services/authApi";
import { useNavigate } from "react-router-dom";

const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (err) {
      console.log(err);
    }

    dispatch(logout());
    navigate("/login");
  };

  return handleLogout;
};

export default useLogout;