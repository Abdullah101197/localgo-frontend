import React, { useState } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Settings,
  Bell,
  Search,
  User,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import DashboardOverview from "../../components/shop/DashboardOverview";
import OrderManagement from "../../components/shop/OrderManagement";
import ProductManagement from "./ProductManagement";
import ShopSettings from "./ShopSettings";

export default function ShopDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [orderSearchQuery, setOrderSearchQuery] = useState("");

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "products", label: "Products", icon: Package },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full lg:w-72 bg-white border-r border-gray-100 flex flex-col z-20 sticky top-0 lg:h-screen">
        <div className="p-8 border-b border-gray-50 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-200">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight leading-none">
              Seller Hub
            </h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
              Shop Manager
            </p>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                  isActive
                    ? "bg-primary-600 text-white shadow-xl shadow-primary-200"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-400 group-hover:text-primary-600"} transition-colors`}
                />
                <span className="text-[13px] font-black uppercase tracking-wider">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="p-6 border-t border-gray-50">
          <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-gray-100 shadow-sm">
              <User className="w-5 h-5 text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-gray-900 truncate leading-none mb-1">
                {user?.shop?.name || "My Shop"}
              </p>
              <p className="text-[9px] font-bold text-gray-400 uppercase truncate">
                Owner Account
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden pt-6 pb-20 px-4 sm:px-8 lg:px-12">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">
              {tabs.find((t) => t.id === activeTab)?.label}
            </h2>
            <p className="text-gray-500 font-medium text-sm mt-1">
              Welcome back, {user?.name?.split(" ")[0]}! Here's what's happening
              today.
            </p>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={orderSearchQuery}
                onChange={(e) => setOrderSearchQuery(e.target.value)}
                className="w-full bg-white border border-gray-100 rounded-xl py-2.5 pl-11 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary-100 focus:border-primary-600 transition-all outline-none"
              />
            </div>
            <button className="relative p-2.5 bg-white border border-gray-100 rounded-xl text-gray-500 hover:text-primary-600 transition-all">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Tab Views */}
        <div className="transition-all duration-500">
          {activeTab === "overview" && <DashboardOverview />}
          {activeTab === "orders" && (
            <OrderManagement searchQuery={orderSearchQuery} />
          )}
          {activeTab === "products" && <ProductManagement />}
          {activeTab === "settings" && <ShopSettings />}
        </div>
      </main>
    </div>
  );
}
