import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import {
    ShoppingBag,
    Package,
    Clock,
    CheckCircle2,
    XCircle,
    Loader2,
    Eye,
    Calendar,
    MapPin,
} from "lucide-react";

const statusColors = {
    pending: { bg: "bg-amber-50", text: "text-amber-600", icon: Clock },
    accepted: { bg: "bg-blue-50", text: "text-blue-600", icon: CheckCircle2 },
    ready: { bg: "bg-indigo-50", text: "text-indigo-600", icon: Package },
    pickup: { bg: "bg-purple-50", text: "text-purple-600", icon: ShoppingBag },
    delivered: {
        bg: "bg-green-50",
        text: "text-green-600",
        icon: CheckCircle2,
    },
    cancelled: { bg: "bg-red-50", text: "text-red-600", icon: XCircle },
};

export default function OrderManagement() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);

    const fetchOrders = async () => {
        try {
            const response = await api.get("/orders");
            // Backend already filters by user role and shop_id
            setOrders(response.data.data);
        } catch (err) {
            console.error("Failed to fetch orders", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateStatus = async (orderId, newStatus) => {
        setUpdatingId(orderId);
        try {
            await api.put(`/orders/${orderId}`, { status: newStatus });
            await fetchOrders();
        } catch (err) {
            console.error("Failed to update status", err);
            alert("Failed to update status. Please try again.");
        } finally {
            setUpdatingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-20">
                <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    Order
                                </th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    Customer
                                </th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    Total
                                </th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    Status
                                </th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {orders.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="px-8 py-20 text-center"
                                    >
                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <ShoppingBag className="w-8 h-8 text-gray-200" />
                                        </div>
                                        <p className="text-gray-500 font-bold">
                                            No orders found.
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => {
                                    const status =
                                        statusColors[order.status] ||
                                        statusColors.pending;
                                    const StatusIcon = status.icon;
                                    const isUpdating = updatingId === order.id;

                                    return (
                                        <tr
                                            key={order.id}
                                            className="hover:bg-primary-50/10 transition-colors group"
                                        >
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:shadow-sm group-hover:text-primary-600 transition-all">
                                                        <Package className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-gray-900 leading-none">
                                                            #{order.id}
                                                        </p>
                                                        <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-1 font-bold">
                                                            <Calendar className="w-3 h-3" />
                                                            {new Date(
                                                                order.created_at,
                                                            ).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div>
                                                    <p className="text-sm font-bold text-gray-700">
                                                        {order.customer?.name ||
                                                            "Customer"}
                                                    </p>
                                                    <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-1 font-bold">
                                                        <MapPin className="w-3 h-3" />
                                                        <span className="truncate max-w-[150px]">
                                                            {
                                                                order.delivery_address
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 font-black text-gray-900 text-sm">
                                                Rs.{order.total_amount}
                                            </td>
                                            <td className="px-8 py-5">
                                                <div
                                                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl ${status.bg} ${status.text}`}
                                                >
                                                    <StatusIcon className="w-3.5 h-3.5" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest leading-none mt-0.5">
                                                        {order.status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {order.status ===
                                                        "pending" && (
                                                        <button
                                                            onClick={() =>
                                                                updateStatus(
                                                                    order.id,
                                                                    "accepted",
                                                                )
                                                            }
                                                            disabled={
                                                                isUpdating
                                                            }
                                                            className="px-4 py-2 bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary-700 transition-all shadow-md shadow-primary-100 disabled:opacity-50"
                                                        >
                                                            {isUpdating
                                                                ? "..."
                                                                : "Accept"}
                                                        </button>
                                                    )}
                                                    {order.status ===
                                                        "accepted" && (
                                                        <button
                                                            onClick={() =>
                                                                updateStatus(
                                                                    order.id,
                                                                    "ready",
                                                                )
                                                            }
                                                            disabled={
                                                                isUpdating
                                                            }
                                                            className="px-4 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 disabled:opacity-50"
                                                        >
                                                            {isUpdating
                                                                ? "..."
                                                                : "Mark Ready"}
                                                        </button>
                                                    )}
                                                    <button className="p-2.5 text-gray-400 hover:text-primary-600 bg-gray-50 hover:bg-white border border-transparent hover:border-gray-100 rounded-xl transition-all">
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
