import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import {
    Bike,
    Package,
    CheckCircle2,
    Navigation,
    Loader2,
    Bell,
    User,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function RiderDashboard() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("available");
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            let url = "/orders";
            if (activeTab === "available") {
                url += "?available=1";
            }
            const response = await api.get(url);

            let filteredOrders = response.data.data;
            if (activeTab === "available") {
                filteredOrders = filteredOrders.filter(
                    (o) => o.status === "ready" && !o.rider_id,
                );
            } else if (activeTab === "current") {
                filteredOrders = filteredOrders.filter(
                    (o) =>
                        o.rider_id === user?.rider?.id &&
                        o.status !== "delivered",
                );
            } else if (activeTab === "history") {
                filteredOrders = filteredOrders.filter(
                    (o) =>
                        o.rider_id === user?.rider?.id &&
                        o.status === "delivered",
                );
            }

            setOrders(filteredOrders);
        } catch (err) {
            console.error("Failed to fetch orders", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [activeTab]);

    const handleAction = async (orderId, status) => {
        setUpdatingId(orderId);
        try {
            await api.put(`/orders/${orderId}`, { status });
            await fetchOrders();
        } catch (err) {
            console.error(err);
            alert("Action failed. Please try again.");
        } finally {
            setUpdatingId(null);
        }
    };

    const renderOrderActions = (order) => {
        if (activeTab === "available") {
            return (
                <button
                    onClick={() => handleAction(order.id, "ready")}
                    disabled={updatingId === order.id}
                    className="flex-1 bg-primary-600 text-white py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {updatingId === order.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        "Accept Delivery"
                    )}
                </button>
            );
        }

        if (activeTab === "current") {
            return (
                <div className="flex w-full gap-2">
                    {order.status === "ready" && (
                        <button
                            onClick={() => handleAction(order.id, "pickup")}
                            disabled={updatingId === order.id}
                            className="flex-1 bg-indigo-600 text-white py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all disabled:opacity-50"
                        >
                            Mark Picked Up
                        </button>
                    )}
                    {order.status === "pickup" && (
                        <button
                            onClick={() => handleAction(order.id, "delivered")}
                            disabled={updatingId === order.id}
                            className="flex-1 bg-green-600 text-white py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-green-700 transition-all disabled:opacity-50"
                        >
                            Mark Delivered
                        </button>
                    )}
                </div>
            );
        }

        return (
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                        Successfully Delivered
                    </span>
                </div>
                <span className="text-xs font-bold text-gray-400">
                    {new Date(order.created_at).toLocaleDateString()}
                </span>
            </div>
        );
    };

    const tabs = [
        {
            id: "available",
            label: "Available",
            icon: Navigation,
            count:
                orders.length && activeTab === "available"
                    ? orders.length
                    : null,
        },
        { id: "current", label: "My Deliveries", icon: Bike },
        { id: "history", label: "History", icon: CheckCircle2 },
    ];

    return (
        <div className="min-h-screen bg-gray-50/50 flex flex-col lg:flex-row">
            {/* Sidebar */}
            <aside className="w-full lg:w-72 bg-white border-r border-gray-100 flex flex-col z-20 sticky top-0 lg:h-screen transition-all">
                <div className="p-8 border-b border-gray-50 flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-200">
                        <Bike className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-gray-900 tracking-tight leading-none">
                            Rider Hub
                        </h1>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                            Delivery Partner
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
                                <span className="text-[13px] font-black uppercase tracking-wider flex-1 text-left">
                                    {tab.label}
                                </span>
                                {tab.count && (
                                    <span
                                        className={`text-[10px] font-black px-2 py-0.5 rounded-full ${isActive ? "bg-white text-primary-600" : "bg-primary-100 text-primary-600"}`}
                                    >
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </nav>

                <div className="p-6 border-t border-gray-50">
                    <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-gray-100 shadow-sm relative">
                            <User className="w-5 h-5 text-gray-400" />
                            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-black text-gray-900 truncate leading-none mb-1">
                                {user?.name}
                            </p>
                            <p className="text-[9px] font-bold text-gray-400 uppercase truncate">
                                Active Now
                            </p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-x-hidden pt-6 pb-20 px-4 sm:px-8 lg:px-12">
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                            {tabs.find((t) => t.id === activeTab)?.label}
                        </h2>
                        <p className="text-gray-500 font-medium text-sm mt-1">
                            {activeTab === "available"
                                ? "Grab a delivery and start earning!"
                                : "Keep the neighborhood fed."}
                        </p>
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <button className="relative p-2.5 bg-white border border-gray-100 rounded-xl text-gray-500 hover:text-primary-600 transition-all">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                    </div>
                </header>

                {loading ? (
                    <div className="flex flex-col items-center justify-center p-20 space-y-4">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-primary-100 rounded-full"></div>
                            <div className="w-16 h-16 border-4 border-primary-600 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
                        </div>
                        <p className="text-gray-400 text-xs font-black uppercase tracking-widest">
                            Scanning map...
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {orders.length === 0 ? (
                            <div className="col-span-full py-20 text-center bg-white rounded-[2.5rem] border border-gray-100 shadow-sm transition-all animate-in fade-in slide-in-from-bottom-5">
                                <Navigation className="w-16 h-16 text-gray-100 mx-auto mb-4" />
                                <h3 className="text-xl font-black text-gray-900 mb-2">
                                    Nothing here yet
                                </h3>
                                <p className="text-gray-400 font-medium max-w-xs mx-auto">
                                    Check back in a few minutes for new
                                    neighborhood deliveries.
                                </p>
                            </div>
                        ) : (
                            orders.map((order) => (
                                <div
                                    key={order.id}
                                    className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 group relative overflow-hidden flex flex-col"
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                                                <Package className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                                                    Order ID
                                                </p>
                                                <h4 className="font-black text-gray-900 tracking-tight">
                                                    #{order.id}
                                                </h4>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                                                Payout
                                            </p>
                                            <p className="text-lg font-black text-green-600 tracking-tight">
                                                Rs.
                                                {Math.round(
                                                    order.total_amount * 0.1,
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-8 flex-1">
                                        <div className="flex gap-3">
                                            <div className="flex flex-col items-center">
                                                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                                                <div className="w-0.5 h-full bg-gray-100 my-1"></div>
                                                <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                                            </div>
                                            <div className="space-y-4">
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                                                        Pick up from
                                                    </p>
                                                    <p className="text-sm font-bold text-gray-900 leading-tight">
                                                        {order.shop?.name}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                                                        Deliver to
                                                    </p>
                                                    <p className="text-sm font-bold text-gray-900 leading-tight">
                                                        {order.delivery_address}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-gray-50 flex items-center justify-between gap-3">
                                        {renderOrderActions(order)}
                                    </div>

                                    {/* Decorative map trace */}
                                    <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-primary-50/50 rounded-full blur-2xl group-hover:bg-primary-100 transition-all duration-500"></div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
