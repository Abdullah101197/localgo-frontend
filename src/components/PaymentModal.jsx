import React, { useState } from "react";
import { X, CreditCard, Wallet, Banknote, CheckCircle2 } from "lucide-react";
import PropTypes from "prop-types";
import api from "../api/axios";

export default function PaymentModal({ order, onClose, onSuccess }) {
    const [selectedMethod, setSelectedMethod] = useState("cod");
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);

    const paymentMethods = [
        {
            id: "cod",
            name: "Cash on Delivery",
            icon: Banknote,
            description: "Pay when your order arrives",
        },
        {
            id: "card",
            name: "Credit/Debit Card",
            icon: CreditCard,
            description: "Secure payment via card",
            disabled: true, // Enable when Stripe is integrated
        },
        {
            id: "wallet",
            name: "Mobile Wallet",
            icon: Wallet,
            description: "JazzCash, EasyPaisa",
            disabled: true, // Enable when wallet integration is ready
        },
    ];

    const handlePayment = async () => {
        try {
            setProcessing(true);
            setError(null);

            // Create payment intent
            const intentResponse = await api.post("/payments/intent", {
                order_id: order.id,
                payment_method: selectedMethod,
            });

            // For COD, payment is immediately confirmed
            if (selectedMethod === "cod") {
                onSuccess(intentResponse.data.payment);
                return;
            }

            // For card/wallet, would integrate with payment gateway here
            // Example: Stripe Elements, PayPal SDK, etc.

            // Simulate payment confirmation for demo
            const confirmResponse = await api.post(
                `/payments/${intentResponse.data.payment.id}/confirm`,
                {
                    transaction_id: `demo_txn_${Date.now()}`,
                    metadata: { demo: true },
                },
            );

            onSuccess(confirmResponse.data.payment);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Payment failed. Please try again.",
            );
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6 rounded-t-3xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-black">
                                Payment Method
                            </h2>
                            <p className="text-primary-100 text-sm mt-1">
                                Total: Rs. {order.total_amount}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="p-6 space-y-4">
                    {paymentMethods.map((method) => {
                        const Icon = method.icon;
                        return (
                            <button
                                key={method.id}
                                onClick={() =>
                                    !method.disabled &&
                                    setSelectedMethod(method.id)
                                }
                                disabled={method.disabled}
                                className={`w-full p-4 rounded-2xl border-2 transition-all text-left ${
                                    selectedMethod === method.id
                                        ? "border-primary-600 bg-primary-50"
                                        : "border-gray-200 hover:border-gray-300"
                                } ${
                                    method.disabled
                                        ? "opacity-50 cursor-not-allowed"
                                        : "cursor-pointer"
                                }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                            selectedMethod === method.id
                                                ? "bg-primary-600 text-white"
                                                : "bg-gray-100 text-gray-600"
                                        }`}
                                    >
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-black text-gray-900">
                                                {method.name}
                                            </h3>
                                            {method.disabled && (
                                                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full font-bold">
                                                    Coming Soon
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {method.description}
                                        </p>
                                    </div>
                                    {selectedMethod === method.id && (
                                        <CheckCircle2 className="w-6 h-6 text-primary-600" />
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mx-6 mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                        <p className="text-red-600 text-sm font-bold">
                            {error}
                        </p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="p-6 pt-0 space-y-3">
                    <button
                        onClick={handlePayment}
                        disabled={processing}
                        className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-4 rounded-2xl font-black text-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        {processing ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Processing...
                            </div>
                        ) : (
                            `Confirm Payment - Rs. ${order.total_amount}`
                        )}
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full bg-gray-100 text-gray-700 py-4 rounded-2xl font-black hover:bg-gray-200 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

PaymentModal.propTypes = {
    order: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
};
