import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import {
    ShoppingBag,
    MapPin,
    Phone,
    CreditCard,
    ArrowLeft,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Truck,
    ShieldCheck,
} from "lucide-react";

export default function CheckoutPage() {
    const { cart, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        delivery_address: "",
        phone: "",
        payment_method: "cod",
        special_instructions: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (cart.length === 0) return;

        setLoading(true);
        setError("");

        try {
            // Grouping by shop - for MVP we assume first shop's ID if present
            // In a better version, we check if multiple shops are in cart
            const shopId = cart[0].shop_id;

            const orderData = {
                shop_id: shopId,
                items: cart.map((item) => ({
                    product_id: item.id,
                    quantity: item.quantity,
                })),
                delivery_address: formData.delivery_address,
                payment_method: formData.payment_method,
                // Add any other fields the backend expects
            };

            const response = await api.post("/orders", orderData);

            if (response.status === 201 || response.status === 200) {
                setSuccess(true);
                clearCart();
                setTimeout(() => {
                    navigate("/orders");
                }, 3000);
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Something went wrong while placing your order.",
            );
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 text-center shadow-2xl shadow-gray-200/50 border border-gray-100">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 mb-2">
                        Order Placed!
                    </h2>
                    <p className="text-gray-500 font-medium mb-8">
                        Your order has been successfully placed. You'll be
                        redirected to your orders shortly.
                    </p>
                    <Link
                        to="/orders"
                        className="btn-primary inline-flex items-center gap-2 px-8 py-3"
                    >
                        View My Orders <ShoppingBag className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag className="w-10 h-10 text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 mb-2">
                        Your cart is empty
                    </h2>
                    <p className="text-gray-500 font-medium mb-8">
                        Add some delicious items from local shops to start!
                    </p>
                    <Link to="/shops" className="btn-primary px-8 py-3">
                        Browse Shops
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-white rounded-xl transition-all active:scale-95 border border-transparent hover:border-gray-200"
                    >
                        <ArrowLeft className="w-6 h-6 text-gray-600" />
                    </button>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                        Checkout
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Form */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* Delivery Info */}
                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-black text-gray-900">
                                    Delivery Details
                                </h2>
                            </div>

                            <form className="space-y-4">
                                <div className="space-y-2">
                                    <label
                                        htmlFor="delivery_address"
                                        className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1"
                                    >
                                        Delivery Address
                                    </label>
                                    <textarea
                                        id="delivery_address"
                                        name="delivery_address"
                                        value={formData.delivery_address}
                                        onChange={handleChange}
                                        required
                                        placeholder="Flat 123, Green Apartments, Main Street..."
                                        rows="3"
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 text-sm font-bold focus:bg-white focus:border-primary-600 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all duration-300 resize-none"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label
                                        htmlFor="phone"
                                        className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1"
                                    >
                                        Contact Phone
                                    </label>
                                    <div className="relative group">
                                        <input
                                            id="phone"
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                            placeholder="+92 300 1234567"
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold focus:bg-white focus:border-primary-600 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all duration-300"
                                        />
                                        <Phone className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600">
                                    <CreditCard className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-black text-gray-900">
                                    Payment Method
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    {
                                        id: "cod",
                                        label: "Cash on Delivery",
                                        icon: Truck,
                                    },
                                    {
                                        id: "easypaisa",
                                        label: "Easypaisa",
                                        icon: CreditCard,
                                    },
                                ].map((method) => (
                                    <button
                                        key={method.id}
                                        onClick={() =>
                                            setFormData({
                                                ...formData,
                                                payment_method: method.id,
                                            })
                                        }
                                        className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300 ${formData.payment_method === method.id ? "border-primary-600 bg-primary-50" : "border-gray-50 bg-gray-50/50 hover:border-gray-100"}`}
                                    >
                                        <div
                                            className={`w-10 h-10 rounded-xl flex items-center justify-center ${formData.payment_method === method.id ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-400"}`}
                                        >
                                            <method.icon className="w-5 h-5" />
                                        </div>
                                        <span
                                            className={`text-sm font-black uppercase tracking-widest ${formData.payment_method === method.id ? "text-primary-600" : "text-gray-400"}`}
                                        >
                                            {method.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Summary */}
                    <div className="lg:col-span-5">
                        <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-100 sticky top-24">
                            <h2 className="text-xl font-black text-gray-900 mb-6">
                                Order Summary
                            </h2>

                            <div className="space-y-4 mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                                {cart.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex gap-4 items-center"
                                    >
                                        <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                                            {item.image ? (
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                    <ShoppingBag className="w-6 h-6" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-bold text-gray-800 line-clamp-1">
                                                {item.name}
                                            </h4>
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                                                Qty: {item.quantity}
                                            </p>
                                        </div>
                                        <p className="text-sm font-black text-gray-900">
                                            Rs.{item.price * item.quantity}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 pt-6 border-t border-gray-50 mb-8">
                                <div className="flex justify-between text-gray-500 font-medium">
                                    <span>Subtotal</span>
                                    <span>Rs.{cartTotal}</span>
                                </div>
                                <div className="flex justify-between text-gray-500 font-medium">
                                    <span>Delivery Fee</span>
                                    <span>Rs.100</span>
                                </div>
                                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                                    <span className="text-lg font-black text-gray-900">
                                        Total
                                    </span>
                                    <span className="text-2xl font-black text-primary-600">
                                        Rs.{cartTotal + 100}
                                    </span>
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl flex items-center gap-3 text-sm font-bold mb-6">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    {error}
                                </div>
                            )}

                            <button
                                onClick={handleSubmit}
                                disabled={
                                    loading ||
                                    !formData.delivery_address ||
                                    !formData.phone
                                }
                                className="w-full bg-primary-600 text-white rounded-2xl py-4 font-black flex items-center justify-center gap-2 hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        Place Order{" "}
                                        <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    </>
                                )}
                            </button>

                            <div className="mt-6 flex items-center justify-center gap-2 text-gray-400">
                                <ShieldCheck className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest">
                                    Secure Checkout
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
