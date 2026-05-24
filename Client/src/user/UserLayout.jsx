import React from "react";

import { Navigate, Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar/navbar";
import Footer from "../Components/Footer/Footer";
import { useSelector } from "react-redux";

function UserLayout() {

      const { user } = useSelector((state) => state.auth);

        // if(user.role === "admin"){
        //   return (<Navigate
        //     to="/admin"
        //     replace
        //   />)
        // }else if(user.role === "theatre_owner"){
        //   return (<Navigate
        //     to="/theatre-owner"
        //     replace
        //   />)
        // }

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