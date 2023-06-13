// import { createBrowserRouter } from "react-router-dom";
// import App from "./App";
// import Login from "./pages/Login";
// import Layout from "./pages/Layout";
// import ErrorPage from "./pages/ErrorPage";
// import Dashboard from "./pages/Dashboard";
// import Employee from "./pages/Employee";
// import Ranking from "./pages/Ranking";
// import LogOut from "./pages/LogOut";

// const router = createBrowserRouter([
//   {
//     path: "/login",
//     element: <Login />,
//     errorElement: <ErrorPage />,
//   },
//   {
//     path: "/",
//     element: <Layout />,
//     errorElement: <ErrorPage />,
//     children: [
//       { path: "/employee", element: <Employee /> }, 
//       { path: "/dashboard", element: <Dashboard /> },
//       { path: "/ranking", element: <Ranking /> },
//       {path:"/employee/:id", element: <Employee  />},
//       {path:'/logout', element: <LogOut />}
//     ],
//   },
// ]);

// export default router;

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
      { path: '/logout', element: <LogOut /> }
    ],
  },
]);

export default router;
