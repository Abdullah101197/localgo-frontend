import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import {
  Users,
  Store,
  Bike,
  TrendingUp,
  Shield,
  Bell,
  LayoutDashboard,
  ArrowUpRight,
  Search as SearchIcon,
} from "lucide-react";
import ShopManagement from "../../components/admin/ShopManagement";
import RiderManagement from "../../components/admin/RiderManagement";
import UserManagement from "../../components/admin/UserManagement";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [cancellingOrderId, setCancellingOrderId] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/admin/stats");
        setStats(response.data);
      } catch (err) {
        console.error("Failed to fetch admin stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const refreshStats = async () => {
    const response = await api.get("/admin/stats");
    setStats(response.data);
  };

  const cancelAsAdmin = async (orderId) => {
    if (!globalThis.confirm("Cancel this order as admin?")) return;
    try {
      setCancellingOrderId(orderId);
      await api.post(`/orders/${orderId}/cancel`);
      await refreshStats();
    } catch (err) {
      console.error("Failed to cancel order", err);
    } finally {
      setCancellingOrderId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4 min-h-screen bg-gray-50">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary-100 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-primary-600 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
        </div>
        <p className="text-gray-400 text-xs font-black uppercase tracking-widest">
          Securing System Access...
        </p>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Users",
      value: stats?.total_users,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
      trend: "+12%",
    },
    {
      label: "Active Shops",
      value: stats?.total_shops,
      icon: Store,
      color: "text-primary-600",
      bg: "bg-primary-50",
      trend: "+5%",
    },
    {
      label: "Delivery Fleet",
      value: stats?.total_riders,
      icon: Bike,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      trend: "+8%",
    },
    {
      label: "Total Revenue",
      value: `Rs.${stats?.total_revenue}`,
      icon: TrendingUp,
      color: "text-green-600",
      bg: "bg-green-50",
      trend: "+20%",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full lg:w-72 bg-white border-r border-gray-100 flex flex-col z-20 sticky top-0 lg:h-screen transition-all">
        <div className="p-8 border-b border-gray-50 flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white shadow-lg">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight leading-none">
              Admin Panel
            </h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
              System Control
            </p>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
          {[
            {
              id: "overview",
              label: "Overview",
              icon: LayoutDashboard,
            },
            { id: "shops", label: "Shops", icon: Store },
            { id: "riders", label: "Riders", icon: Bike },
            { id: "users", label: "Users", icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                  isActive
                    ? "bg-gray-900 text-white shadow-xl"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-400 group-hover:text-gray-900"} transition-colors`}
                />
                <span className="text-[13px] font-black uppercase tracking-wider text-left">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 lg:p-12">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">
              System Health
            </h2>
            <p className="text-gray-500 font-medium text-sm mt-1">
              Overview of your neighborhood commerce ecosystem.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Global search..."
                className="bg-white border border-gray-100 rounded-xl py-2 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-gray-100 outline-none w-64"
              />
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 group hover:shadow-xl transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 ${card.bg} rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}
                >
                  <Icon className={`w-6 h-6 ${card.color}`} />
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                      {card.label}
                    </p>
                    <p className="text-2xl font-black text-gray-900 tracking-tight">
                      {card.value}
                    </p>
                  </div>
                  <div className="flex items-center text-[10px] font-black text-green-500 bg-green-50 px-2 py-1 rounded-lg">
                    <ArrowUpRight className="w-3 h-3 mr-0.5" /> {card.trend}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Content Views */}
        <div className="transition-all duration-500">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Recent Orders */}
              <div className="xl:col-span-2 bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-black text-gray-900 tracking-tight">
                    Global Transaction Feed
                  </h3>
                  <button className="text-xs font-black text-primary-600 uppercase tracking-widest hover:underline">
                    Full Audit Logs
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-50">
                        <th className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-left pb-4 px-4">
                          Order
                        </th>
                        <th className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-left pb-4 px-4">
                          Shop
                        </th>
                        <th className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-left pb-4 px-4">
                          Customer
                        </th>
                        <th className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-left pb-4 px-4">
                          Amount
                        </th>
                        <th className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-left pb-4 px-4">
                          Status
                        </th>
                        <th className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-left pb-4 px-4">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {stats?.recent_orders?.map((order) => (
                        <tr
                          key={order.id}
                          className="group hover:bg-gray-50/50 transition-colors"
                        >
                          <td className="py-5 px-4">
                            <span className="text-sm font-bold text-gray-900">
                              #ORD-{order.id}
                            </span>
                          </td>
                          <td className="py-5 px-4">
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-gray-900">
                                {order.shop?.name}
                              </span>
                            </div>
                          </td>
                          <td className="py-5 px-4">
                            <span className="text-sm font-medium text-gray-600">
                              {order.customer?.name}
                            </span>
                          </td>
                          <td className="py-5 px-4">
                            <span className="text-sm font-black text-gray-900">
                              Rs.{order.total_amount}
                            </span>
                          </td>
                          <td className="py-5 px-4">
                            <span className="px-3 py-1 bg-primary-50 text-primary-600 text-[10px] font-black uppercase tracking-widest rounded-lg">
                              {order.status}
                            </span>
                          </td>
                          <td className="py-5 px-4">
                            {["pending", "accepted", "ready"].includes(
                              order.status,
                            ) && (
                              <button
                                onClick={() => cancelAsAdmin(order.id)}
                                disabled={cancellingOrderId === order.id}
                                className="px-3 py-1 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                              >
                                {cancellingOrderId === order.id
                                  ? "..."
                                  : "Cancel"}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Quick Actions / System Status */}
              <div className="space-y-8">
                <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                  <h3 className="text-xl font-black mb-6 relative z-10">
                    System Status
                  </h3>
                  <div className="space-y-4 relative z-10">
                    <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-bold">API Engine</span>
                      </div>
                      <span className="text-[10px] font-black text-green-400 uppercase tabular-nums">
                        99.9%
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-bold">Database</span>
                      </div>
                      <span className="text-[10px] font-black text-green-400 uppercase tabular-nums">
                        Stable
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                        <span className="text-sm font-bold">Mail Server</span>
                      </div>
                      <span className="text-[10px] font-black text-amber-400 uppercase tabular-nums">
                        Degraded
                      </span>
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600 rounded-full -mr-16 -mt-16 blur-3xl opacity-20"></div>
                </div>

                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-black text-gray-900 mb-6">
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => alert("System backup initiated...")}
                      className="p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all flex flex-col items-center gap-2 group"
                    >
                      <Shield className="w-6 h-6 text-gray-400 group-hover:text-gray-900" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                        Backup
                      </span>
                    </button>
                    <button
                      onClick={() => alert("Broadcast feature coming soon!")}
                      className="p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all flex flex-col items-center gap-2 group"
                    >
                      <Bell className="w-6 h-6 text-gray-400 group-hover:text-gray-900" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                        Broadcast
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === "shops" && <ShopManagement />}
          {activeTab === "riders" && <RiderManagement />}
          {activeTab === "users" && <UserManagement />}
        </div>
      </main>
    </div>
  );
}
