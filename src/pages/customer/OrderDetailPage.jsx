import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import { ArrowLeft, Package, MapPin, Clock, Loader2 } from "lucide-react";

export default function OrderDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await api.get(`/orders/${id}`);
                setOrder(response.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <h2 className="text-2xl font-black text-gray-900 mb-4">
                    Order not found
                </h2>
                <Link to="/orders" className="btn-primary px-8 py-3">
                    Back to Orders
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold mb-8 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" /> Back to Orders
                </button>

                <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-xl shadow-gray-200/50 border border-gray-100">
                    <div className="flex flex-wrap justify-between items-start gap-6 mb-12">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
                                Order Tracking
                            </p>
                            <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                                Order #{order.id}
                            </h1>
                        </div>
                        <div className="px-6 py-3 bg-primary-50 rounded-2xl">
                            <span className="text-sm font-black text-primary-600 uppercase tracking-widest">
                                {order.status}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                        <section>
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-primary-600" />{" "}
                                Delivery Address
                            </h3>
                            <p className="text-gray-600 font-medium leading-relaxed">
                                {order.delivery_address}
                            </p>
                        </section>
                        <section>
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-primary-600" />{" "}
                                Estimated Time
                            </h3>
                            <p className="text-gray-600 font-medium">
                                30-45 minutes
                            </p>
                        </section>
                    </div>

                    <div className="border-t border-gray-100 pt-10">
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6">
                            Order Summary
                        </h3>
                        <div className="space-y-6">
                            {order.items?.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex justify-between items-center"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                                            <Package className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">
                                                {item.product?.name ||
                                                    "Product"}
                                            </p>
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                                                Qty: {item.quantity}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="font-black text-gray-900">
                                        Rs.{item.price * item.quantity}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 pt-10 border-t border-gray-100 space-y-3">
                            <div className="flex justify-between text-gray-500 font-bold">
                                <span>Subtotal</span>
                                <span>Rs.{order.total_amount}</span>
                            </div>
                            <div className="flex justify-between items-center pt-4">
                                <span className="text-xl font-black text-gray-900">
                                    Total Paid
                                </span>
                                <span className="text-3xl font-black text-primary-600">
                                    Rs.{order.total_amount}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
