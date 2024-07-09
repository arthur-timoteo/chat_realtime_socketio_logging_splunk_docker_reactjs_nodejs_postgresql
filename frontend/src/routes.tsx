import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";


const router = createBrowserRouter([
    {
        path: "/",
        element: <SignIn />
    },
    {
        path: "/signup",
        element: <SignUp />
    },
    {
        path: "/home",
        element: <Home />
    }
]);

function Routes(){
    return (
        <RouterProvider router={router} />
    );
}

export default Routes;