import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import {
  ShoppingBag,
  Package,
  Calendar,
  MapPin,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
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

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/orders");
        setOrders(response.data.data || []);
      } catch (err) {
        setError("Failed to fetch your orders. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const canCancel = (order) => ["pending", "accepted"].includes(order.status);

  const cancelOrder = async (orderId) => {
    if (!globalThis.confirm("Cancel this order?")) return;
    try {
      setCancellingId(orderId);
      await api.post(`/orders/${orderId}/cancel`);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: "cancelled" } : o)),
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to cancel order.");
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 text-primary-600 animate-spin mx-auto" />
          <p className="text-sm font-black text-gray-400 uppercase tracking-widest">
            Loading orders...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
              My Orders
            </h1>
            <p className="text-gray-500 font-medium">
              Track and manage your recent neighborhood orders.
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-[1.5rem] flex items-center gap-3 text-sm font-bold mb-8">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-12 text-center shadow-xl shadow-gray-200/50 border border-gray-100">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">
              No orders yet
            </h2>
            <p className="text-gray-500 font-medium mb-8">
              Looks like you haven't placed any orders from our local shops yet.
            </p>
            <Link to="/shops" className="btn-primary px-8 py-3">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const status = statusColors[order.status] || statusColors.pending;
              const StatusIcon = status.icon;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 border border-gray-100 group"
                >
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                        <Package className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-gray-900 leading-none mb-1">
                          Order #{order.id}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-400">
                          <Calendar className="w-3.5 h-3.5" />
                          <span className="text-xs font-bold uppercase tracking-widest">
                            {new Date(order.created_at).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl ${status.bg} ${status.text}`}
                    >
                      <StatusIcon className="w-4 h-4" />
                      <span className="text-[11px] font-black uppercase tracking-widest">
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8 pb-8 border-b border-gray-50">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div className="text-left">
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
                            Delivery Address
                          </p>
                          <p className="text-sm font-bold text-gray-700 leading-tight">
                            {order.delivery_address}
                          </p>
                        </div>
                      </div>
                      {order.shop && (
                        <div className="flex items-start gap-3">
                          <ShoppingBag className="w-4 h-4 text-gray-400 mt-0.5" />
                          <div className="text-left">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
                              Ordered From
                            </p>
                            <p className="text-sm font-bold text-gray-700">
                              {order.shop.name}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="bg-gray-50/50 rounded-2xl p-4 flex flex-col justify-center items-center sm:items-end">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
                        Total Amount
                      </p>
                      <p className="text-3xl font-black text-primary-600 tracking-tighter">
                        Rs.{order.total_amount}
                      </p>
                      <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">
                        {order.payment_method}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex -space-x-2">
                      {/* Showing thumbnails of first 3 items or generic icons */}
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded-lg bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-400"
                        >
                          {i}
                        </div>
                      ))}
                      {order.items?.length > 3 && (
                        <div className="w-8 h-8 rounded-lg bg-primary-100 border-2 border-white flex items-center justify-center text-[10px] font-black text-primary-600">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>

                    <Link
                      to={`/orders/${order.id}`}
                      className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-primary-600 hover:text-primary-700 transition-colors"
                    >
                      View Details <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                  {canCancel(order) && (
                    <div className="mt-4 pt-4 border-t border-gray-50 flex justify-end">
                      <button
                        onClick={() => cancelOrder(order.id)}
                        disabled={cancellingId === order.id}
                        className="px-4 py-2 rounded-xl bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-colors disabled:opacity-50"
                      >
                        {cancellingId === order.id
                          ? "Cancelling..."
                          : "Cancel Order"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-12 text-center">
          <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
            LocalGo • Neighborhood Trusted
          </p>
        </div>
      </div>
    </div>
  );
}
