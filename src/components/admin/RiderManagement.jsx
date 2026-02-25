import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { Bike, AlertCircle, Search } from "lucide-react";

export default function RiderManagement() {
  const [riders, setRiders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchRiders = async () => {
    try {
      const response = await api.get("/admin/riders");
      setRiders(response.data.data);
    } catch (err) {
      console.error("Failed to fetch riders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiders();
  }, []);

  const filteredRiders = riders.filter(
    (rider) =>
      rider.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rider.vehicle_number?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const toggleRiderStatus = async (rider) => {
    try {
      const response = await api.put(`/admin/riders/${rider.id}/toggle-status`);
      const newStatus = response.data.is_verified;
      setRiders(
        riders.map((r) =>
          r.id === rider.id ? { ...r, is_verified: newStatus } : r,
        ),
      );
    } catch (err) {
      console.error("Failed to update rider status", err);
      alert("Failed to update rider status. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search riders..."
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
                  Rider
                </th>
                <th className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-left py-5 px-8">
                  Vehicle
                </th>
                <th className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-left py-5 px-8">
                  License
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
              {filteredRiders.map((rider) => (
                <tr
                  key={rider.id}
                  className="group hover:bg-gray-50/50 transition-colors"
                >
                  <td className="py-5 px-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                        <Bike className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-900 leading-none mb-1">
                          {rider.user?.name}
                        </p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          {rider.user?.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-8 text-sm font-black text-gray-900 uppercase">
                    {rider.vehicle_type} - {rider.vehicle_number}
                  </td>
                  <td className="py-5 px-8 text-sm font-medium text-gray-600">
                    {rider.license_number}
                  </td>
                  <td className="py-5 px-8 text-sm font-medium text-gray-600">
                    <span
                      className={`px-3 py-1 ${rider.is_verified ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"} text-[10px] font-black uppercase tracking-widest rounded-lg`}
                    >
                      {rider.is_verified ? "Verified" : "Unverified"}
                    </span>
                  </td>
                  <td className="py-5 px-8 text-right">
                    <button
                      onClick={() => toggleRiderStatus(rider)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm ${
                        rider.is_verified
                          ? "bg-red-50 text-red-600 hover:bg-red-100"
                          : "bg-green-50 text-green-600 hover:bg-green-100"
                      }`}
                    >
                      {rider.is_verified ? "Reject" : "Approve"}
                    </button>
                  </td>
                </tr>
              ))}
              {filteredRiders.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-20 text-center">
                    <AlertCircle className="w-12 h-12 text-gray-100 mx-auto mb-4" />
                    <p className="text-gray-400 font-bold">
                      No riders found matching your search.
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
