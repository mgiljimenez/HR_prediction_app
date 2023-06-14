import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Login from "./pages/Login";
import Layout from "./pages/Layout";
import ErrorPage from "./pages/ErrorPage";
import Dashboard from "./pages/Dashboard";
import Employee from "./pages/Employee";
import Ranking from "./pages/Ranking";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/employee", element: <Employee /> },
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/ranking", element: <Ranking /> },
    ],
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorPage />,
  },
]);

export default router;
