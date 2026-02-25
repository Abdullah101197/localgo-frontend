import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Loader2,
} from "lucide-react";

export default function DashboardOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/orders/stats");
        setStats(response.data);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  const cards = [
    {
      label: "Total Revenue",
      value: `Rs.${stats?.total_revenue || 0}`,
      icon: TrendingUp,
      color: "text-green-600",
      bg: "bg-green-50",
      growth: stats?.growth_percentage || 0,
    },
    {
      label: "Total Orders",
      value: stats?.total_orders || 0,
      icon: ShoppingBag,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Pending Orders",
      value: stats?.pending_orders || 0,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Delivered",
      value: stats?.delivered_orders || 0,
      icon: CheckCircle2,
      color: "text-primary-600",
      bg: "bg-primary-50",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div
                  className={`w-12 h-12 ${card.bg} rounded-2xl flex items-center justify-center`}
                >
                  <Icon className={`w-6 h-6 ${card.color}`} />
                </div>
                {card.growth !== undefined && (
                  <div
                    className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg ${card.growth >= 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}
                  >
                    {card.growth >= 0 ? "+" : ""}
                    {card.growth}%
                  </div>
                )}
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                {card.label}
              </p>
              <p className="text-2xl font-black text-gray-900 tracking-tight">
                {card.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Placeholder for Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
          <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
            Recent Activity
          </h3>
          <div className="space-y-6">
            {stats &&
            stats.recent_activity &&
            stats.recent_activity.length > 0 ? (
              stats.recent_activity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900">
                      {activity.title}
                    </p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                  <div className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-lg">
                    {activity.status}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-400 text-sm font-medium">
                  No recent activity found.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-primary-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-primary-200">
          <div className="relative z-10">
            <h3 className="text-xl font-black mb-2">Seller Insights</h3>
            <p className="text-primary-100 text-sm font-medium leading-relaxed mb-6">
              {stats?.growth_percentage >= 0
                ? `You've earned ${stats.growth_percentage}% more revenue this week! Keep providing great service.`
                : `Revenue is down ${Math.abs(stats.growth_percentage)}% this week. Try adding seasonal products or discounts.`}
            </p>
            <button
              onClick={() =>
                alert(
                  "Reports & Analytics are coming soon! We're building a powerful engine to help you grow your business.",
                )
              }
              className="bg-white text-primary-600 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary-50 transition-all"
            >
              View Reports
            </button>
          </div>
          {/* Decorative Blobs */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500 rounded-full -mr-16 -mt-16 blur-2xl opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-400 rounded-full -ml-12 -mb-12 blur-2xl opacity-30"></div>
        </div>
      </div>
    </div>
  );
}
