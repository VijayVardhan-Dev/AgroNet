import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import ErrorBoundary from "../components/common/ErrorBoundary";
import Loader from "../components/common/Loader";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "./routes";
import Chat from "../pages/chat";
import Voice from "../pages/voice";

// Lazy Load Pages
const LandingPage = lazy(() => import("../pages/LandingPage"));
const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));
const Rentals = lazy(() => import("../pages/Rentals"));
const Maps = lazy(() => import("../pages/Maps"));
const Schemes = lazy(() => import("../pages/Schemes"));
const Profile = lazy(() => import("../pages/Profile"));
const Orders = lazy(() => import("../pages/Orders"));
const Deliveries = lazy(() => import("../pages/Deliveries"));
const FarmerDashboard = lazy(() => import("../pages/FarmerDashboard"));
const ProductDetails = lazy(() => import("../pages/ProductDetails"));
const Cart = lazy(() => import("../pages/Cart"));
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
                path={ROUTES.VOICE}
                element={
                    <ProtectedRoute>
                        <RouteWithLayout>
                            <Voice />
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
                path={ROUTES.CHAT}
                element={
                    <ProtectedRoute>
                        <RouteWithLayout>
                            <Chat />
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
            <Route
                path={ROUTES.ORDERS}
                element={
                    <ProtectedRoute>
                        <RouteWithLayout>
                            <Orders />
                        </RouteWithLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path={ROUTES.DELIVERIES}
                element={
                    <ProtectedRoute>
                        <RouteWithLayout>
                            <Deliveries />
                        </RouteWithLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path={ROUTES.FARMER_DASHBOARD}
                element={
                    <ProtectedRoute>
                        <RouteWithLayout>
                            <FarmerDashboard />
                        </RouteWithLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path={ROUTES.PRODUCT_DETAILS}
                element={
                    <ProtectedRoute>
                        <RouteWithLayout>
                            <ProductDetails />
                        </RouteWithLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path={ROUTES.CART}
                element={
                    <ProtectedRoute>
                        <RouteWithLayout>
                            <Cart />
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
