import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useMemo,
} from "react";
import PropTypes from "prop-types";
import api from "../api/axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("localgo_token"));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            if (token) {
                try {
                    const response = await api.get("/me");
                    setUser(response.data);
                } catch (error) {
                    console.error("Auth check failed:", error);
                    logout();
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, [token]);

    const login = async (email, password) => {
        try {
            const response = await api.post("/login", { email, password });
            const { user, access_token } = response.data;
            setToken(access_token);
            setUser(user);
            localStorage.setItem("localgo_token", access_token);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Login failed",
            };
        }
    };

    const register = async (userData) => {
        try {
            const response = await api.post("/register", userData);
            const { user, access_token } = response.data;
            setToken(access_token);
            setUser(user);
            localStorage.setItem("localgo_token", access_token);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Registration failed",
            };
        }
    };

    const logout = async () => {
        try {
            await api.post("/logout");
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setToken(null);
            setUser(null);
            localStorage.removeItem("localgo_token");
        }
    };

    const value = useMemo(
        () => ({
            user,
            token,
            loading,
            login,
            register,
            logout,
            isAuthenticated: !!token,
        }),
        [user, token, loading],
    );

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
