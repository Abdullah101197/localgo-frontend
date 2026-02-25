import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import {
  Store,
  User as UserIcon,
  MoreVertical,
  AlertCircle,
  Loader2,
  Search,
} from "lucide-react";

export default function ShopManagement() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchShops = async () => {
    try {
      const response = await api.get("/admin/shops");
      setShops(response.data.data);
    } catch (err) {
      console.error("Failed to fetch shops", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  const filteredShops = shops.filter(
    (shop) =>
      shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.user?.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const toggleShopStatus = async (shop) => {
    try {
      const response = await api.put(`/admin/shops/${shop.id}/toggle-status`);
      const newStatus = response.data.is_active;
      // Update local state
      setShops(
        shops.map((s) =>
          s.id === shop.id ? { ...s, is_active: newStatus } : s,
        ),
      );
    } catch (err) {
      console.error("Failed to update shop status", err);
      alert("Failed to update shop status. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search shops..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-100 rounded-xl py-2.5 pl-11 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary-100 transition-all outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50">
                <th className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-left py-5 px-8">
                  Shop Details
                </th>
                <th className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-left py-5 px-8">
                  Owner
                </th>
                <th className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-left py-5 px-8">
                  Category
                </th>
                <th className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-left py-5 px-8">
                  Status
                </th>
                <th className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-right py-5 px-8">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredShops.map((shop) => (
                <tr
                  key={shop.id}
                  className="group hover:bg-gray-50/50 transition-colors"
                >
                  <td className="py-5 px-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
                        <Store className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-900 leading-none mb-1">
                          {shop.name}
                        </p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          {shop.address}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-8 text-sm font-medium text-gray-600">
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-4 h-4 text-gray-300" />
                      {shop.user?.name || "No User"}
                    </div>
                  </td>
                  <td className="py-5 px-8">
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-[10px] font-black uppercase tracking-widest rounded-lg">
                      {shop.category || "General"}
                    </span>
                  </td>
                  <td className="py-5 px-8">
                    <span
                      className={`px-3 py-1 ${shop.is_active ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"} text-[10px] font-black uppercase tracking-widest rounded-lg`}
                    >
                      {shop.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-5 px-8 text-right">
                    <button
                      onClick={() => toggleShopStatus(shop)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm ${
                        shop.is_active
                          ? "bg-red-50 text-red-600 hover:bg-red-100"
                          : "bg-green-50 text-green-600 hover:bg-green-100"
                      }`}
                    >
                      {shop.is_active ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
              {filteredShops.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-20 text-center">
                    <AlertCircle className="w-12 h-12 text-gray-100 mx-auto mb-4" />
                    <p className="text-gray-400 font-bold">
                      No shops found matching your search.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
