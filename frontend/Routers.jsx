import { createBrowserRouter } from "react-router-dom";
import Layout from "./src/features/Layout";
import Login from "./src/pages/Login/index";
import Register from "./src/pages/Register";
import Home from "./src/pages/Home";

export const routers = createBrowserRouter([

    {
        element: <Layout />,
        children: [
            {
                element: <Login />,
                path: "/login",
            },
            {
                element: <Register />,
                path: "/register",
            },
            {
                element: <Home />,
                path: "/",
            },
        ],
    },
]);