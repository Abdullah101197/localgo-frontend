import React from "react";
import {
    HashRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/customer/HomePage";
import ShopsPage from "./pages/customer/ShopsPage";
import ShopDetail from "./pages/customer/ShopDetail";
import CategoriesPage from "./pages/customer/CategoriesPage";
import ProductSearchPage from "./pages/customer/ProductSearchPage";
import ShopDashboard from "./pages/shop/ShopDashboard";
import RiderDashboard from "./pages/rider/RiderDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CheckoutPage from "./pages/customer/CheckoutPage";
import OrdersPage from "./pages/customer/OrdersPage";
import OrderDetailPage from "./pages/customer/OrderDetailPage";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <Router>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Main Application Layout */}
                        <Route path="/" element={<Layout />}>
                            <Route index element={<HomePage />} />
                            <Route path="shops" element={<ShopsPage />} />
                            <Route path="shops/:id" element={<ShopDetail />} />
                            <Route
                                path="categories"
                                element={<CategoriesPage />}
                            />
                            <Route
                                path="products/search"
                                element={<ProductSearchPage />}
                            />

                            {/* Customer Protected Routes */}
                            <Route element={<ProtectedRoute />}>
                                <Route
                                    path="checkout"
                                    element={<CheckoutPage />}
                                />
                                <Route path="orders" element={<OrdersPage />} />
                                <Route
                                    path="orders/:id"
                                    element={<OrderDetailPage />}
                                />
                            </Route>

                            {/* Shop Protected Routes */}
                            <Route
                                element={
                                    <ProtectedRoute allowedRoles={["shop"]} />
                                }
                            >
                                <Route
                                    path="shop"
                                    element={<ShopDashboard />}
                                />
                            </Route>

                            {/* Rider Protected Routes */}
                            <Route
                                element={
                                    <ProtectedRoute allowedRoles={["rider"]} />
                                }
                            >
                                <Route
                                    path="rider"
                                    element={<RiderDashboard />}
                                />
                            </Route>

                            {/* Admin Protected Routes */}
                            <Route
                                element={
                                    <ProtectedRoute allowedRoles={["admin"]} />
                                }
                            >
                                <Route
                                    path="admin"
                                    element={<AdminDashboard />}
                                />
                            </Route>
                        </Route>

                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Router>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;
