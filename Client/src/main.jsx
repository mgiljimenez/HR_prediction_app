import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import router from "./router.jsx";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/auth.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);
