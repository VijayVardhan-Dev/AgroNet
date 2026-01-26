import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";

import ErrorBoundary from "../components/common/ErrorBoundary"; // Restored import

import Loader from "../components/common/Loader";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "./routes";

// Lazy Load Pages
const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));
const Rentals = lazy(() => import("../pages/Rentals"));
const Maps = lazy(() => import("../pages/Maps"));
const Schemes = lazy(() => import("../pages/Schemes"));
const Profile = lazy(() => import("../pages/Profile"));
const NotFound = lazy(() => import("../pages/NotFound"));

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="flex h-screen items-center justify-center"><Loader /></div>;
    if (!user) return <Navigate to={ROUTES.LOGIN} replace />;
    return children;
};

// Route wrapper to include layout and cart drawer
const RouteWithLayout = ({ children }) => {
    return (
        <AppLayout>
            <ErrorBoundary>
                <Suspense fallback={<div className="flex h-[50vh] items-center justify-center"><Loader /></div>}>
                    {children}
                </Suspense>
            </ErrorBoundary>
           
        </AppLayout>
    );
};

const AppRouter = () => {
    return (
        <Routes>
            {/* Public Routes - Auth pages typically don't share the main layout */}
            <Route
                path={ROUTES.LOGIN}
                element={
                    <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader /></div>}>
                        <Login />
                    </Suspense>
                }
            />
            <Route
                path={ROUTES.REGISTER}
                element={
                    <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader /></div>}>
                        <Register />
                    </Suspense>
                }
            />

            {/* Feature Routes wrapped in Layout */}
            <Route
                path={ROUTES.HOME}
                element={
                    <RouteWithLayout>
                        <Home />
                    </RouteWithLayout>
                }
            />
            <Route
                path={ROUTES.RENTALS}
                element={
                    <RouteWithLayout>
                        <Rentals />
                    </RouteWithLayout>
                }
            />
            <Route
                path={ROUTES.MAPS}
                element={
                    <RouteWithLayout>
                        <Maps />
                    </RouteWithLayout>
                }
            />
            <Route
                path={ROUTES.SCHEMES}
                element={
                    <RouteWithLayout>
                        <Schemes />
                    </RouteWithLayout>
                }
            />

            {/* Protected Routes */}
            <Route
                path={ROUTES.PROFILE}
                element={
                    <ProtectedRoute>
                        <RouteWithLayout>
                            <Profile />
                        </RouteWithLayout>
                    </ProtectedRoute>
                }
            />

            {/* 404 Route */}
            <Route
                path="*"
                element={
                    <RouteWithLayout>
                        <NotFound />
                    </RouteWithLayout>
                }
            />
        </Routes>
    );
};

export default AppRouter;
