import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import api from "../../api/axios";
import {
  MapPin,
  Home,
  Briefcase,
  Plus,
  Trash2,
  Check,
  Loader2,
  AlertCircle,
  CheckCircle,
  Map as MapIcon,
} from "lucide-react";
import LocationPicker from "./LocationPicker";

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

export default function AddressManager({ onUpdate }) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    label: "Home",
    address_line: "",
    latitude: null,
    longitude: null,
    is_default: false,
  });
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await api.get("/addresses");
        setAddresses(response.data);
      } catch (err) {
        console.error("Fetch addresses error:", err);
        setError("Failed to load addresses");
      } finally {
        setLoading(false);
      }
    };
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await api.get("/addresses");
      setAddresses(response.data);
    } catch (err) {
      console.error("Fetch addresses error:", err);
      setError("Failed to load addresses");
    }
  };

  const handleToggleDefault = async (address) => {
    if (address.is_default) return;
    setActionLoading(address.id);
    try {
      await api.put(`/addresses/${address.id}`, { is_default: true });
      await fetchAddresses();
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error("Toggle default address error:", err);
      setError("Failed to update default address");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!globalThis.confirm("Are you sure you want to delete this address?"))
      return;
    setActionLoading(id);
    try {
      await api.delete(`/addresses/${id}`);
      await fetchAddresses();
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error("Delete address error:", err);
      setError("Failed to delete address");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading("form");
    try {
      await api.post("/addresses", formData);
      setShowForm(false);
      setFormData({
        label: "Home",
        address_line: "",
        latitude: null,
        longitude: null,
        is_default: false,
      });
      await fetchAddresses();
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error("Submit address error:", err);
      setError("Failed to save address");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-black text-gray-900 tracking-tight">
          Saved Addresses
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-2xl text-[13px] font-black uppercase tracking-wider shadow-lg shadow-primary-100 hover:bg-primary-700 transition-all font-sans"
        >
          {showForm ? (
            <Trash2 className="w-4 h-4" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          {showForm ? "Cancel" : "Add New"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold">
          <AlertCircle className="w-5 h-5" /> {error}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-50 rounded-3xl p-8 border border-gray-100 space-y-6 animate-in slide-in-from-top duration-500"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                Label
              </h4>
              <div className="flex gap-2">
                {["Home", "Work", "Other"].map((label) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setFormData({ ...formData, label })}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                      formData.label === label
                        ? "bg-primary-600 text-white shadow-md shadow-primary-100"
                        : "bg-white text-gray-500 border border-gray-100"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                Default
              </h4>
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, is_default: !formData.is_default })
                }
                className={`w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  formData.is_default
                    ? "bg-green-600 text-white shadow-md shadow-green-100"
                    : "bg-white text-gray-500 border border-gray-100"
                }`}
              >
                {formData.is_default && <Check className="w-4 h-4" />}
                Set as Default
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="address_line"
              className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex justify-between items-center"
            >
              Full Address
              <button
                type="button"
                onClick={() => setIsPickerOpen(true)}
                className="text-primary-600 hover:text-gray-900 transition-colors flex items-center gap-1 normal-case font-bold"
              >
                <MapIcon className="w-3.5 h-3.5" />
                Pick on Map
              </button>
            </label>
            <input
              id="address_line"
              type="text"
              required
              value={formData.address_line}
              onChange={(e) =>
                setFormData({ ...formData, address_line: e.target.value })
              }
              placeholder="Enter your street address, building, floor etc."
              className="w-full bg-white border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-primary-100 outline-none transition-all"
            />
          </div>

          <LocationPicker
            isOpen={isPickerOpen}
            onClose={() => setIsPickerOpen(false)}
            onSelect={(loc, addr) => {
              setFormData({
                ...formData,
                address_line: addr,
                latitude: loc.lat,
                longitude: loc.lng,
              });
              setIsPickerOpen(false);
            }}
          />

          <button
            type="submit"
            disabled={actionLoading === "form"}
            className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {actionLoading === "form" ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Save Address"
            )}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4">
        {addresses.length === 0 && !showForm && (
          <div className="text-center py-12 bg-gray-50 rounded-[2.5rem] border border-dashed border-gray-200">
            <MapPin className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No saved addresses yet.</p>
          </div>
        )}
        {addresses.map((address) => (
          <div
            key={address.id}
            className={`group bg-white p-6 rounded-3xl border transition-all hover:shadow-xl hover:shadow-gray-100/50 flex items-center justify-between ${
              address.is_default
                ? "border-primary-600 ring-4 ring-primary-50"
                : "border-gray-100"
            }`}
          >
            <div className="flex items-center gap-6">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center ${getAddressStyles(address.label)}`}
              >
                <AddressIcon label={address.label} className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-black text-gray-900">{address.label}</h4>
                  {address.is_default && (
                    <span className="bg-green-100 text-green-700 text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-md">
                  {address.address_line}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all">
              {!address.is_default && (
                <button
                  onClick={() => handleToggleDefault(address)}
                  disabled={actionLoading === address.id}
                  className="p-3 bg-gray-50 text-gray-400 hover:bg-green-50 hover:text-green-600 rounded-xl transition-all"
                  title="Set as Default"
                >
                  <CheckCircle className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={() => handleDelete(address.id)}
                disabled={actionLoading === address.id}
                className="p-3 bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"
                title="Delete"
              >
                {actionLoading === address.id ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Trash2 className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

AddressManager.propTypes = {
  onUpdate: PropTypes.func,
};
