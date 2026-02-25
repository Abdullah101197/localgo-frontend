import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";

import PropTypes from "prop-types";

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(() => {
    const saved = localStorage.getItem("user_location");
    return saved ? JSON.parse(saved) : null;
  });

  const [address, setAddress] = useState(() => {
    return localStorage.getItem("user_address") || "";
  });

  const { isAuthenticated } = useAuth();

  // Load default address or fetch GPS if no location set
  useEffect(() => {
    // Helper to fetch GPS location
    const fetchGPSLocation = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              // Reverse geocode to get a readable address
              const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
              );
              const data = await res.json();
              updateLocation(
                { lat: latitude, lng: longitude },
                data.display_name,
              );
            } catch (error) {
              console.error("Reverse geocoding failed:", error);
              // Fallback to just coordinates if geocoding fails
              updateLocation(
                { lat: latitude, lng: longitude },
                "Current Location",
              );
            }
          },
          (error) => {
            console.error("GPS Access denied or failed:", error);
          },
        );
      }
    };

    if (!location) {
      if (isAuthenticated) {
        const loadDefaultAddress = async () => {
          try {
            const res = await api.get("/addresses");
            const defaultAddr = res.data.find((a) => a.is_default);
            if (defaultAddr) {
              updateLocation(
                {
                  lat: Number.parseFloat(defaultAddr.latitude),
                  lng: Number.parseFloat(defaultAddr.longitude),
                },
                defaultAddr.address_line,
              );
            } else {
              // Authenticated but no default address -> Try GPS
              fetchGPSLocation();
            }
          } catch (err) {
            console.error("Failed to load default address:", err);
            // API error -> Try GPS
            fetchGPSLocation();
          }
        };
        loadDefaultAddress();
      } else {
        // Guest user -> Try GPS immediately
        fetchGPSLocation();
      }
    }
  }, [isAuthenticated]); // Removed 'location' from dependency to avoid loop, though !location check handles it. Better to keep it clean.

  useEffect(() => {
    if (location) {
      localStorage.setItem("user_location", JSON.stringify(location));
    } else {
      localStorage.removeItem("user_location");
    }
  }, [location]);

  useEffect(() => {
    if (address) {
      localStorage.setItem("user_address", address);
    } else {
      localStorage.removeItem("user_address");
    }
  }, [address]);

  const updateLocation = (coords, addr) => {
    setLocation(coords);
    setAddress(addr);
  };

  const clearLocation = () => {
    setLocation(null);
    setAddress("");
  };

  const value = useMemo(
    () => ({
      location,
      address,
      updateLocation,
      clearLocation,
    }),
    [location, address],
  );

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

LocationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};
