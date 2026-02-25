import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import {
  User as UserIcon,
  Mail,
  Calendar,
  AlertCircle,
  Search,
} from "lucide-react";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      const response = await api.get("/admin/users");
      setUsers(response.data.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const deleteUser = async (id) => {
    if (!globalThis.confirm("Are you sure you want to delete this user?"))
      return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Failed to delete user", err);
      alert("Failed to delete user. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
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
                  User Profile
                </th>
                <th className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-left py-5 px-8">
                  Email Address
                </th>
                <th className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-left py-5 px-8">
                  Role
                </th>
                <th className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-left py-5 px-8">
                  Joined
                </th>
                <th className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-right py-5 px-8">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="group hover:bg-gray-50/50 transition-colors"
                >
                  <td className="py-5 px-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                        <UserIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-900 leading-none mb-1">
                          {user.name}
                        </p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          ID: {user.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-8 text-sm font-medium text-gray-600">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-300" />
                      {user.email}
                    </div>
                  </td>
                  <td className="py-5 px-8">
                    <span
                      className={`px-3 py-1 ${user.role === "admin" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"} text-[10px] font-black uppercase tracking-widest rounded-lg`}
                    >
                      {user.role || "Customer"}
                    </span>
                  </td>
                  <td className="py-5 px-8 text-sm font-medium text-gray-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(user.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="py-5 px-8 text-right">
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-all shadow-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-20 text-center">
                    <AlertCircle className="w-12 h-12 text-gray-100 mx-auto mb-4" />
                    <p className="text-gray-400 font-bold">
                      No users found matching your search.
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
