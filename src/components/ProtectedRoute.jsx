import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

import PropTypes from "prop-types";

const ProtectedRoute = ({ allowedRoles = [] }) => {
    const { user, isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center space-y-4">
                    <Loader2 className="w-10 h-10 text-primary-600 animate-spin mx-auto" />
                    <p className="text-sm font-black text-gray-400 uppercase tracking-widest">
                        Authenticating...
                    </p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

ProtectedRoute.propTypes = {
    allowedRoles: PropTypes.arrayOf(PropTypes.string),
};

export default ProtectedRoute;
