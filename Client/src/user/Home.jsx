import React from "react";
import Banner from "../Components/Banner/Banner";
import MovieListing from "../Components/Movies/MovieListing";

function Home() {

  return (
    <>
    <Banner />
    <MovieListing title="Now Showing" query="?status=now_showing" />
    <MovieListing title="Upcoming" query="?status=upcoming"/>
    </>
  );
}

export default Home;