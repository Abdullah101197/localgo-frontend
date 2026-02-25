import React, { useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import {
  Store,
  MapPin,
  Type,
  FileText,
  Navigation,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  Image as ImageIcon,
} from "lucide-react";

export default function ShopSettings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: user?.shop?.name || "",
    category: user?.shop?.category || "",
    description: user?.shop?.description || "",
    address: user?.shop?.address || "",
    latitude: user?.shop?.latitude || "",
    longitude: user?.shop?.longitude || "",
    delivery_radius: user?.shop?.delivery_radius || 5,
    image_url: user?.shop?.image_url || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      await api.put(`/shops/${user.shop.id}`, formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update shop settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 shadow-sm border border-gray-100">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">
              Shop Profile
            </h3>
            <p className="text-gray-500 text-sm font-medium">
              Update your shop details and delivery preferences.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Type className="w-3 h-3" /> Shop Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-primary-100 transition-all outline-none"
                placeholder="Enter shop name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Store className="w-3 h-3" /> Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-primary-100 transition-all outline-none appearance-none"
              >
                <option value="">Select Category</option>
                <option value="Restaurant">Restaurant</option>
                <option value="Grocery">Grocery</option>
                <option value="Pharmacy">Pharmacy</option>
                <option value="Electronic">Electronic</option>
                <option value="Clothing">Clothing</option>
                <option value="General">General</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
              <FileText className="w-3 h-3" /> Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-primary-100 transition-all outline-none resize-none"
              placeholder="Tell customers about your shop..."
            ></textarea>
          </div>

          {/* Location Info */}
          <div className="space-y-4 pt-4 border-t border-gray-50">
            <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">
              Location & Delivery
            </h4>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <MapPin className="w-3 h-3" /> Full Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-primary-100 transition-all outline-none"
                  placeholder="Complete street address"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Navigation className="w-3 h-3" /> Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-primary-100 transition-all outline-none"
                  placeholder="e.g. 33.6844"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Navigation className="w-3 h-3" /> Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-primary-100 transition-all outline-none"
                  placeholder="e.g. 73.0479"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="delivery_radius"
                  className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"
                >
                  Delivery Radius (KM)
                </label>
                <input
                  type="number"
                  id="delivery_radius"
                  name="delivery_radius"
                  value={formData.delivery_radius}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-primary-100 transition-all outline-none"
                  placeholder="e.g. 10"
                />
              </div>
            </div>
          </div>

          {/* Branding */}
          <div className="space-y-2 pt-4 border-t border-gray-50">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
              <ImageIcon className="w-3 h-3" /> Shop Image URL
            </label>
            <input
              type="url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-primary-100 transition-all outline-none"
              placeholder="https://example.com/shop.jpg"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6">
            <div className="order-2 sm:order-1">
              {success && (
                <div className="flex items-center gap-2 text-green-600 font-bold text-sm animate-bounce">
                  <CheckCircle className="w-5 h-5" /> Settings Saved!
                </div>
              )}
              {error && (
                <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
                  <AlertCircle className="w-5 h-5" /> {error}
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto order-1 sm:order-2 bg-primary-600 text-white rounded-[1.5rem] py-4 px-10 font-black uppercase tracking-widest hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-100 transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg shadow-primary-200"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
