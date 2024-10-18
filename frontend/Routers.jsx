import { createBrowserRouter } from "react-router-dom";
import Layout from "./src/features/Layout";
import Login from "./src/pages/Login";
import Register from "./src/pages/Register";
import Home from "./src/pages/Home";
import PasswordResetRequest from "./src/pages/PasswordResetRequest";
import VerifyOTP from "./src/pages/VerifyOTP";
import PasswordResetConfirm from "./src/pages/PasswordResetConfirm";
import ResendOTP from "./src/pages/ResendOTP";


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
            {
                element: <PasswordResetRequest />,
                path: "/reset-password",
            },
            {
                element: <VerifyOTP />,
                path: "/verify-otp",
            },
            {
                element: <PasswordResetConfirm />,
                path: "/reset-password/:uidb64/:token",
            },
        ],
    },
]);