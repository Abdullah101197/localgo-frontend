import React, { useState } from "react";
import api from "../../api/axios";
import { X, Star, Send, Loader2, CheckCircle2 } from "lucide-react";

export default function AddReviewModal({
  isOpen,
  onClose,
  orderId,
  product,
  onReviewSubmitted,
}) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!isOpen || !product) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/reviews", {
        order_id: orderId,
        product_id: product.id,
        rating,
        comment,
      });
      setSuccess(true);
      if (onReviewSubmitted) onReviewSubmitted(product.id);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setComment("");
        setRating(5);
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to submit review. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 sm:p-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              Rate your Experience
            </h2>
            <p className="text-gray-500 font-medium mt-1">
              How was the {product.name}?
            </p>
          </div>

          {success ? (
            <div className="py-10 text-center space-y-4">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black text-gray-900">Thank You!</h3>
              <p className="text-gray-500 font-medium">
                Your review has been submitted successfully.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100">
                  {error}
                </div>
              )}

              <div className="flex flex-col items-center gap-3">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                  Overall Rating
                </p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="transition-transform active:scale-90"
                    >
                      <Star
                        className={`w-10 h-10 ${star <= rating ? "fill-orange-500 text-orange-500" : "text-gray-200"}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">
                  Your Review
                </label>
                <textarea
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us what you liked or what could be better..."
                  className="w-full h-32 px-6 py-4 bg-gray-50 border-none rounded-3xl outline-none focus:ring-2 ring-primary-500/20 text-gray-700 font-medium transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 text-white py-5 rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-primary-200 flex items-center justify-center gap-3 hover:bg-primary-700 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Review
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
