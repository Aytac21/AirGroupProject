import { createBrowserRouter } from "react-router-dom";
// import Layout from "./src/features/Layout";
import Login from "./src/pages/Login/index";
// import RePassword from "./src/pages/RePassword/index";


export const routers = createBrowserRouter([

    {
        // element: <Layout />,
        children: [
            {
                element: <Login />,
                path: "/login",
            },
            // {
            //     element: <RePassword />,
            //     path: "/re-password",
            // },
            // {
            //     element: <OneTimePassword />,
            //     path: "/re-password-code",
            // }
        ],
    },
]);