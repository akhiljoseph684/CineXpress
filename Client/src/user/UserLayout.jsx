import React, { useState } from "react";

import { Navigate, Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar/navbar";
import Footer from "../Components/Footer/Footer";
import { useSelector } from "react-redux";
import CityPopup from "../Components/cityPopup";

function UserLayout() {
  const { user } = useSelector((state) => state.auth);

  const [openCityPopup, setOpenCityPopup] = useState(!user?.preferredCity);

  const [selectedCity, setSelectedCity] = useState(user?.preferredCity || "");

  console.log(user)

  if (user.role === "admin") {
    return <Navigate to="/admin" replace />;
  } else if (user.role === "theatre_owner") {
    return <Navigate to="/theatre-owner" replace />;
  }

  return (
    <div
      className="
        min-h-screen
        bg-black
        text-white
      "
    >
      <Navbar />

      <main>
        <CityPopup
          isOpen={openCityPopup}
          onClose={() => setOpenCityPopup(false)}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
        />

        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default UserLayout;
