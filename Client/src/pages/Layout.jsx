import React from "react";
import { Outlet, Link } from "react-router-dom";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";


function Layout() {
  return (
    <>
      <div>
        <NavBar />
        <br />
   
        <Outlet />
        <Footer />
      </div>
    </>
  );
}

export default Layout;
