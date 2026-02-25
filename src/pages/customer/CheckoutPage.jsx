import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
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
  ChevronRight,
  Plus,
  X,
} from "lucide-react";
import AddressManager from "../../components/customer/AddressManager";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripePaymentForm from "../../components/customer/StripePaymentForm";

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = STRIPE_PUBLISHABLE_KEY
  ? loadStripe(STRIPE_PUBLISHABLE_KEY)
  : null;

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [stripeClientSecret, setStripeClientSecret] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [paymentId, setPaymentId] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);

  const [formData, setFormData] = useState({
    delivery_address: "",
    phone: "",
    payment_method: "cod",
    special_instructions: "",
  });

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await api.get("/addresses");
        setAddresses(response.data);
        const defaultAddr = response.data.find((a) => a.is_default);
        if (defaultAddr) {
          setFormData((prev) => ({
            ...prev,
            delivery_address: defaultAddr.address_line,
          }));
        }
      } catch (err) {
        console.error("Failed to load addresses", err);
      }
    };
    fetchAddresses();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setLoading(true);
    setError("");

    try {
      const shopId = cart[0].shop_id;

      const orderData = {
        shop_id: shopId,
        items: cart.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
        delivery_address: formData.delivery_address,
        payment_method: formData.payment_method,
      };

      const response = await api.post("/orders", orderData);
      const order = response.data.data;
      setOrderId(order.id);

      const intentResponse = await api.post("/payments/intent", {
        order_id: order.id,
        payment_method: formData.payment_method,
      });
      setPaymentId(intentResponse.data.payment?.id || null);

      if (formData.payment_method === "card") {
        if (!STRIPE_PUBLISHABLE_KEY) {
          setLoading(false);
          setError(
            "Card payments are currently disabled (Stripe Publishable Key missing). Please use Cash on Delivery.",
          );
          return;
        }
        setStripeClientSecret(intentResponse.data.client_secret);
        setLoading(false);
        return;
      }

      setSuccess(true);
      clearCart();
      setTimeout(() => {
        navigate("/orders");
      }, 3000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong while placing your order.",
      );
    } finally {
      if (formData.payment_method !== "card") {
        setLoading(false);
      }
    }
  };

  const handleCardPaymentSuccess = () => {
    clearCart();
    setSuccess(true);
    setTimeout(() => {
      navigate("/orders");
    }, 3000);
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
            Your order has been successfully placed. You'll be redirected to
            your orders shortly.
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
          <div className="lg:col-span-7 space-y-6">
            {stripeClientSecret ? (
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-black text-gray-900">
                      Card Payment
                    </h2>
                  </div>
                  <span className="text-sm font-bold text-gray-400">
                    Secure by Stripe
                  </span>
                </div>
                <Elements
                  stripe={stripePromise}
                  options={{ clientSecret: stripeClientSecret }}
                >
                  <StripePaymentForm
                    orderId={orderId}
                    paymentId={paymentId}
                    amount={cartTotal + 100}
                    onCancel={() => setStripeClientSecret(null)}
                    onSuccess={handleCardPaymentSuccess}
                  />
                </Elements>
              </div>
            ) : (
              <>
                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-black text-gray-900">
                      Delivery Details
                    </h2>
                    <button
                      type="button"
                      onClick={() => setShowAddressModal(true)}
                      className="ml-auto text-xs font-black text-primary-600 uppercase tracking-widest flex items-center gap-1 hover:underline"
                    >
                      <Plus className="w-4 h-4" /> Add New
                    </button>
                  </div>

                  <form className="space-y-4">
                    {addresses.length > 0 && (
                      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-none">
                        {addresses.map((addr) => (
                          <button
                            key={addr.id}
                            type="button"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                delivery_address: addr.address_line,
                              })
                            }
                            className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${
                              formData.delivery_address === addr.address_line
                                ? "bg-primary-600 text-white border-primary-600 shadow-lg shadow-primary-100"
                                : "bg-white text-gray-500 border-gray-100 hover:border-primary-200"
                            }`}
                          >
                            {addr.label}
                          </button>
                        ))}
                      </div>
                    )}
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
                        id: "card",
                        label: "Credit Card",
                        icon: CreditCard,
                        disabled: !STRIPE_PUBLISHABLE_KEY,
                      },
                    ].map((method) => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() =>
                          !method.disabled &&
                          setFormData({
                            ...formData,
                            payment_method: method.id,
                          })
                        }
                        disabled={method.disabled}
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
                        {method.disabled && (
                          <span className="ml-auto text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            Not configured
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Address Modal */}
            {showAddressModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <div className="bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 relative animate-in zoom-in-95 duration-200">
                  <button
                    onClick={() => setShowAddressModal(false)}
                    className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-500" />
                  </button>
                  <AddressManager
                    onUpdate={() => {
                      // Reload addresses
                      api.get("/addresses").then((response) => {
                        setAddresses(response.data);
                        const defaultAddr = response.data.find(
                          (a) => a.is_default,
                        );
                        if (defaultAddr && !formData.delivery_address) {
                          setFormData((prev) => ({
                            ...prev,
                            delivery_address: defaultAddr.address_line,
                          }));
                        }
                      });
                      setShowAddressModal(false);
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-100 sticky top-24">
              <h2 className="text-xl font-black text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                      <img
                        src={
                          item.image_url ||
                          "https://images.unsplash.com/photo-1542838132-92c53300491e"
                        }
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
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

              {!stripeClientSecret && (
                <button
                  onClick={handleSubmit}
                  disabled={
                    loading || !formData.delivery_address || !formData.phone
                  }
                  className="w-full bg-primary-600 text-white rounded-2xl py-4 font-black flex items-center justify-center gap-2 hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      {formData.payment_method === "card"
                        ? "Proceed to Payment"
                        : "Place Order"}
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              )}

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
