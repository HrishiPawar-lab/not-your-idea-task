import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import RootLayout from "./components/Layouts/RootLayout";
import Login from "./modules/Login";
import { Suspense, lazy } from "react";
import PageSkeleton from "./components/Loaders";
import Settings from "./modules/Settings";
import NotFound from "./modules/PageNotFound";
const Register = lazy(() => import("./modules/Register"));
const AuthRoute = lazy(() => import("./components/Layouts/AuthRoute"));
const Dashboard = lazy(() => import("./modules/DashBoard"));
const CreateTask = lazy(() => import("./modules/CreateTask"));
const UpdateTask = lazy(() => import("./modules/UpdateTask"));
const AuditLog = lazy(() => import("./modules/AuditLog"));


const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/register",
        element: <Register />,
    },
    {
        path: "/not-found",
        element: <NotFound />,
    },
    {
        element: <AuthRoute />,
        errorElement: <NotFound />,
        children: [
            {
                element: <RootLayout />,
                children: [
                    {
                        path: "/",
                        element: (
                            <Suspense fallback={<PageSkeleton />}>
                                <Dashboard />
                            </Suspense>
                        ),
                    },
                    {
                        path: "/settings",
                        element: (
                            <Suspense fallback={<PageSkeleton />}>
                                <Settings />
                            </Suspense>
                        ),
                    },
                    {
                        path: "/create-tasks",
                        element: (
                            <Suspense fallback={<PageSkeleton />}>
                                <CreateTask />
                            </Suspense>
                        ),
                    },
                    {
                        path: "/update-task/:id",
                        element: (
                            <Suspense fallback={<PageSkeleton />}>
                                <UpdateTask />
                            </Suspense>
                        ),
                    },
                    {
                        path: "/audit-log",
                        element: (
                            <Suspense fallback={<PageSkeleton />}>
                                <AuditLog />
                            </Suspense>
                        ),
                    },
                ]
            }
        ],
    },

]);

const Routes = () => {
    return (
        <Suspense fallback={<></>}>
            <RouterProvider router={router} />
        </Suspense>
    )
}

export default Routes;

