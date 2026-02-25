import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import AddressManager from "../../components/customer/AddressManager";
import EditProfileModal from "../../components/customer/EditProfileModal";
import {
  User,
  Mail,
  Calendar,
  MapPin,
  Package,
  Settings,
  LogOut,
  ChevronRight,
  Camera,
  Edit,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function ProfilePage() {
  const { user, logout, setUser } = useAuth();
  const [activeSection, setActiveSection] = useState("profile");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const stats = [
    {
      id: "orders",
      label: "Total Orders",
      value: user?.orders_count || 0,
      icon: Package,
      color: "bg-blue-50 text-blue-600",
    },
    {
      id: "addresses",
      label: "Saved Places",
      value: user?.addresses_count || 0,
      icon: MapPin,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar */}
        <aside className="w-full lg:w-80 space-y-8">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-400 to-primary-600"></div>
            <div className="relative inline-block mb-6">
              <div className="w-24 h-24 rounded-[2rem] bg-gray-50 flex items-center justify-center text-gray-200 border-4 border-white shadow-xl overflow-hidden group-hover:scale-105 transition-all duration-500">
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12" />
                )}
              </div>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="absolute bottom-0 right-0 p-2 bg-white rounded-xl shadow-lg border border-gray-50 text-gray-400 hover:text-primary-600 transition-all hover:scale-110"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <h2 className="text-xl font-black text-gray-900 mb-1">
              {user.name}
            </h2>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
              {user.role} Account
            </p>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-xl text-xs font-bold text-gray-700 transition-colors"
            >
              <Edit className="w-3 h-3" />
              Edit Profile
            </button>
          </div>

          <nav className="bg-white rounded-[2.5rem] p-4 shadow-sm border border-gray-100 space-y-2">
            {[
              { id: "profile", label: "My Profile", icon: User },
              { id: "addresses", label: "Addresses", icon: MapPin },
              {
                id: "orders",
                label: "My Orders",
                icon: Package,
                link: "/orders",
              },
              { id: "settings", label: "Account Settings", icon: Settings },
            ].map((item) =>
              item.link ? (
                <Link
                  key={item.id}
                  to={item.link}
                  className="flex items-center justify-between w-full px-6 py-4 rounded-2xl text-[13px] font-black uppercase tracking-wider text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <item.icon className="w-5 h-5 text-gray-400 group-hover:text-primary-600" />
                    {item.label}
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
                </Link>
              ) : (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center justify-between w-full px-6 py-4 rounded-2xl text-[13px] font-black uppercase tracking-wider transition-all group ${
                    activeSection === item.id
                      ? "bg-primary-600 text-white shadow-xl shadow-primary-100"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <item.icon
                      className={`w-5 h-5 ${activeSection === item.id ? "text-white" : "text-gray-400 group-hover:text-primary-600"}`}
                    />
                    {item.label}
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 ${activeSection === item.id ? "text-white" : "opacity-0 group-hover:opacity-100"} transition-all`}
                  />
                </button>
              ),
            )}
            <button
              onClick={logout}
              className="flex items-center gap-4 w-full px-6 py-4 rounded-2xl text-[13px] font-black uppercase tracking-wider text-red-500 hover:bg-red-50 transition-all mt-4"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 space-y-8">
          {activeSection === "profile" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {stats.map((stat) => (
                  <div
                    key={stat.id}
                    className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center gap-6"
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.color}`}
                    >
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-black text-gray-900">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 lg:p-12 border-b border-gray-50">
                  <h3 className="text-xl font-black text-gray-900 tracking-tight mb-8">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">
                            Full Name
                          </p>
                          <p className="font-bold text-gray-900">{user.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
                          <Mail className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">
                            Email Address
                          </p>
                          <p className="font-bold text-gray-900">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">
                            Joined On
                          </p>
                          <p className="font-bold text-gray-900">
                            {new Date(user.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-12 bg-gray-50/50 flex flex-col md:flex-row items-center justify-between gap-6">
                  <p className="text-gray-500 font-medium text-sm">
                    Need to update your login information or password?
                  </p>
                  <button
                    onClick={() => setActiveSection("settings")}
                    className="bg-white border border-gray-100 text-gray-900 px-8 py-4 rounded-2xl text-[13px] font-black uppercase tracking-wider hover:shadow-lg transition-all"
                  >
                    Edit Settings
                  </button>
                </div>
              </div>
            </>
          )}

          {activeSection === "addresses" && (
            <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 shadow-sm border border-gray-100">
              <AddressManager />
            </div>
          )}

          {activeSection === "settings" && (
            <div className="bg-white rounded-[2.5rem] p-12 text-center shadow-sm border border-gray-100">
              <Settings className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <h3 className="text-xl font-black text-gray-900 mb-2">
                Account Settings
              </h3>
              <p className="text-gray-500">
                Update your password and notification preferences here.
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
        onUpdate={(updatedUser) => setUser(updatedUser)}
      />
    </div>
  );
}
