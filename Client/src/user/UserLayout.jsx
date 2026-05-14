import React from "react";

import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar/navbar";
import Footer from "../Components/Footer/Footer";

function UserLayout() {

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

        <Outlet />

      </main>

      <Footer />

    </div>
  );
}

export default UserLayout;