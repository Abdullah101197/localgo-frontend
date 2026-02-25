import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useLocation } from "../../context/LocationContext";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { Search, MapPin, X, Loader2, Home, Briefcase } from "lucide-react";

// Fix for default marker icons in Leaflet with Webpack/Vite
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const getAddressStyles = (label) => {
  switch (label) {
    case "Home":
      return "bg-blue-50 text-blue-600";
    case "Work":
      return "bg-purple-50 text-purple-600";
    default:
      return "bg-orange-50 text-orange-600";
  }
};

const AddressIcon = ({ label, className }) => {
  switch (label) {
    case "Home":
      return <Home className={className} />;
    case "Work":
      return <Briefcase className={className} />;
    default:
      return <MapPin className={className} />;
  }
};

AddressIcon.propTypes = {
  label: PropTypes.string,
  className: PropTypes.string,
};

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : <Marker position={position} />;
}

LocationMarker.propTypes = {
  position: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }),
  setPosition: PropTypes.func.isRequired,
};

function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
}

ChangeView.propTypes = {
  center: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }).isRequired,
};

export default function LocationPicker({ isOpen, onClose, onSelect }) {
  const { location, updateLocation } = useLocation();
  const { isAuthenticated } = useAuth();
  const [position, setPosition] = useState(
    location || { lat: 33.6844, lng: 73.0479 },
  ); // Default to Islamabad
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [addressText, setAddressText] = useState("");
  const [savedAddresses, setSavedAddresses] = useState([]);

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      const fetchSaved = async () => {
        try {
          const res = await api.get("/addresses");
          setSavedAddresses(res.data);
        } catch (err) {
          console.error("Failed to fetch saved addresses:", err);
        }
      };
      fetchSaved();
    }
  }, [isOpen, isAuthenticated]);

  // Reverse Geocoding using Nominatim (free)
  const getAddress = async (pos) => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${pos.lat}&lon=${pos.lng}`,
      );
      const data = await res.json();
      setAddressText(data.display_name);
    } catch (error) {
      console.error("Geocoding error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (position) {
      getAddress(position);
    }
  }, [position]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) return;
    setIsLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(searchQuery)}`,
      );
      const data = await res.json();
      if (data.length > 0) {
        const newPos = {
          lat: Number.parseFloat(data[0].lat),
          lng: Number.parseFloat(data[0].lon),
        };
        setPosition(newPos);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = () => {
    if (onSelect) {
      onSelect(position, addressText);
    } else {
      updateLocation(position, addressText);
    }
    onClose();
  };

  const selectSaved = (addr) => {
    const pos = {
      lat: Number.parseFloat(addr.latitude),
      lng: Number.parseFloat(addr.longitude),
    };
    setPosition(pos);
    setAddressText(addr.address_line);
    // If we're in the global picker (no onSelect), confirm immediately
    if (!onSelect) {
      updateLocation(pos, addr.address_line);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      ></div>

      <div className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="flex flex-col md:flex-row h-[80vh]">
          {/* Sidebar / Controls */}
          <div className="w-full md:w-80 p-8 border-r border-gray-100 flex flex-col space-y-6">
            <div className="flex justify-between items-center md:hidden mb-4">
              <h3 className="text-xl font-black text-gray-900 tracking-tight">
                Set Location
              </h3>
              <button onClick={onClose} className="p-2 text-gray-400">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div>
              <h3 className="hidden md:block text-2xl font-black text-gray-900 tracking-tight mb-2">
                Delivery Area
              </h3>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                Pick a spot on the map to see stores near you
              </p>
            </div>

            <form onSubmit={handleSearch} className="relative group">
              <input
                type="text"
                placeholder="Search neighborhood..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:bg-white focus:border-primary-600 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all duration-300"
              />
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
              {isLoading && (
                <Loader2 className="absolute right-4 top-3.5 h-5 w-5 text-primary-600 animate-spin" />
              )}
            </form>

            <div className="flex-grow overflow-y-auto space-y-6 pr-2">
              <div className="bg-primary-50/50 rounded-2xl p-5 border border-primary-100 flex gap-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary-600 shadow-sm flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest mb-1">
                    Current Selection
                  </p>
                  <p className="text-xs font-bold text-gray-700 leading-relaxed line-clamp-3">
                    {isLoading
                      ? "Fetching address..."
                      : addressText || "Select a point on the map"}
                  </p>
                </div>
              </div>

              {savedAddresses.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                    Saved Places
                  </h4>
                  <div className="space-y-2">
                    {savedAddresses.map((addr) => (
                      <button
                        key={addr.id}
                        onClick={() => selectSaved(addr)}
                        className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-all text-left border border-transparent hover:border-gray-100 group"
                      >
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform ${getAddressStyles(addr.label)}`}
                        >
                          <AddressIcon label={addr.label} className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-black text-gray-900 truncate">
                            {addr.label}
                          </p>
                          <p className="text-[10px] font-medium text-gray-400 truncate">
                            {addr.address_line}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3 pt-4 border-t border-gray-100">
              <button
                onClick={handleConfirm}
                disabled={!position || isLoading}
                className="w-full btn-primary py-4 text-sm font-black uppercase tracking-widest shadow-xl shadow-primary-200"
              >
                Confirm Location
              </button>
              <button
                onClick={onClose}
                className="w-full py-4 text-sm font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Map Area */}
          <div className="flex-1 relative bg-gray-50">
            <MapContainer
              center={[position.lat, position.lng]}
              zoom={13}
              className="h-full w-full"
              zoomControl={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <ChangeView center={position} />
              <LocationMarker position={position} setPosition={setPosition} />
            </MapContainer>

            <div className="absolute top-6 right-6 z-[400] bg-white rounded-2xl p-2 shadow-xl border border-gray-100 hidden md:block">
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

LocationPicker.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSelect: PropTypes.func,
};
