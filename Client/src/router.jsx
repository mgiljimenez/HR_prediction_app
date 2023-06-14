import { createBrowserRouter, Navigate } from "react-router-dom";
import React from "react";
import App from "./App";
import Layout from "./pages/Layout";
import ErrorPage from "./pages/ErrorPage";
import Dashboard from "./pages/Dashboard";
import Employee from "./pages/Employee";
import Ranking from "./pages/Ranking";
import LogOut from "./pages/LogOut";
import Login from "./pages/Login";

import Settings from "./pages/Settings";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <Login /> }, 
      { path: "/employee", element: <Employee /> }, 
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/ranking", element: <Ranking /> },
      { path: "/employee/:id", element: <Employee  /> },
      { path: '/logout', element: <LogOut /> },
      { path: '/settings', element: <Settings /> }
    ],
  },
]);

export default router;
