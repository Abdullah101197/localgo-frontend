import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Loader2, Lock } from "lucide-react";
import api from "../../api/axios";

export default function StripePaymentForm({
  amount,
  paymentId,
  orderId,
  onCancel,
  onSuccess,
}) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error?.type === "card_error" || error?.type === "validation_error") {
      setMessage(error.message);
      setIsLoading(false);
      return;
    }

    if (error) {
      setMessage("An unexpected error occurred.");
      setIsLoading(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      try {
        await api.post(`/payments/${paymentId}/confirm`, {
          payment_intent_id: paymentIntent.id,
          metadata: {
            source: "stripe_elements",
            order_id: orderId,
          },
        });
        onSuccess();
      } catch (confirmErr) {
        setMessage(
          confirmErr.response?.data?.message ||
            "Payment captured, but confirmation sync failed. Please refresh orders.",
        );
      }
    } else {
      setMessage("Payment is processing. Please check your orders shortly.");
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
        <PaymentElement id="payment-element" />
      </div>

      {message && (
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold flex items-center gap-2">
          {message}
        </div>
      )}

      <div className="flex flex-col gap-3">
        <button
          disabled={isLoading || !stripe || !elements}
          id="submit"
          className="w-full bg-primary-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-primary-700 transition-all shadow-xl shadow-primary-100 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Lock className="w-4 h-4" />
              Pay Rs.{amount} Securely
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="w-full text-gray-400 font-bold text-sm uppercase tracking-widest py-2"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

StripePaymentForm.propTypes = {
  amount: PropTypes.number.isRequired,
  paymentId: PropTypes.number.isRequired,
  orderId: PropTypes.number.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};
