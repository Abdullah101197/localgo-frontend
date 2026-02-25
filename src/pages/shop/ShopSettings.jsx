import React, { useState, useEffect } from "react";
import { Save, Store, MapPin, Image as ImageIcon, Loader2 } from "lucide-react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

export default function ShopSettings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    delivery_radius: 50,
    category: "",
    image_url: "",
    is_active: true,
  });

  useEffect(() => {
    if (user?.shop) {
      setFormData({
        name: user.shop.name,
        description: user.shop.description || "",
        address: user.shop.address,
        delivery_radius: user.shop.delivery_radius || 50,
        category: user.shop.category || "",
        image_url: user.shop.image_url || "",
        is_active: user.shop.is_active ?? true,
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/shops/${user.shop.id}`, formData);
      alert("Shop settings updated successfully!");
    } catch (error) {
      console.error("Failed to update shop", error);
      alert("Failed to update shop settings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
          Shop Settings
        </h1>
        <p className="text-gray-500 font-medium mt-1">
          Update your store preferences and details
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-8 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-primary-900/5"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest ml-1"
            >
              <Store className="w-4 h-4" /> Shop Name
            </label>
            <input
              id="name"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-bold text-gray-900 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="category"
              className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest ml-1"
            >
              Category
            </label>
            <input
              id="category"
              required
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-bold text-gray-900 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label
              htmlFor="description"
              className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1"
            >
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-bold text-gray-900 focus:ring-2 focus:ring-primary-100 outline-none transition-all min-h-[120px]"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label
              htmlFor="address"
              className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest ml-1"
            >
              <MapPin className="w-4 h-4" /> Address
            </label>
            <input
              id="address"
              required
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-bold text-gray-900 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="delivery_radius"
              className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1"
            >
              Delivery Radius (km)
            </label>
            <input
              id="delivery_radius"
              type="number"
              value={formData.delivery_radius}
              onChange={(e) =>
                setFormData({ ...formData, delivery_radius: e.target.value })
              }
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-bold text-gray-900 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="image_url"
              className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest ml-1"
            >
              <ImageIcon className="w-4 h-4" /> Cover Image URL
            </label>
            <input
              id="image_url"
              type="url"
              value={formData.image_url}
              onChange={(e) =>
                setFormData({ ...formData, image_url: e.target.value })
              }
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-bold text-gray-900 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
            />
          </div>

          <div className="space-y-2 md:col-span-2 flex items-center justify-between bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <div>
              <label
                htmlFor="is_active"
                className="text-sm font-black text-gray-900"
              >
                Store Status
              </label>
              <p className="text-xs text-gray-500">
                Enable to allow customers to place orders
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                id="is_active"
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) =>
                  setFormData({ ...formData, is_active: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              <span className="sr-only">Toggle shop status</span>
            </label>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-50">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {" "}
                <Save className="w-5 h-5" /> Save Changes{" "}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
