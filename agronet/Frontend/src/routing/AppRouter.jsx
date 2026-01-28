import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import ErrorBoundary from "../components/common/ErrorBoundary";
import Loader from "../components/common/Loader";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "./routes";

// Lazy Load Pages
const LandingPage = lazy(() => import("../pages/LandingPage"));
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
            {/* Public Routes */}
            <Route
                path={ROUTES.LANDING}
                element={
                    <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader /></div>}>
                        <LandingPage />
                    </Suspense>
                }
            />
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

            {/* Protected Feature Routes wrapped in Layout */}
            <Route
                path={ROUTES.HOME}
                element={
                    <ProtectedRoute>
                        <RouteWithLayout>
                            <Home />
                        </RouteWithLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path={ROUTES.RENTALS}
                element={
                    <ProtectedRoute>
                        <RouteWithLayout>
                            <Rentals />
                        </RouteWithLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path={ROUTES.MAPS}
                element={
                    <ProtectedRoute>
                        <RouteWithLayout>
                            <Maps />
                        </RouteWithLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path={ROUTES.SCHEMES}
                element={
                    <ProtectedRoute>
                        <RouteWithLayout>
                            <Schemes />
                        </RouteWithLayout>
                    </ProtectedRoute>
                }
            />
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

            {/* 404 Route - Redirect to Login */}
            <Route
                path="*"
                element={<Navigate to={ROUTES.LOGIN} replace />}
            />
        </Routes>
    );
};

export default AppRouter;
