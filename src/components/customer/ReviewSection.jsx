import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { Star, MessageSquare, Loader2, User } from "lucide-react";

export default function ReviewSection({
  productId,
  averageRating,
  reviewsCount,
}) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/products/${productId}/reviews`);
        setReviews(response.data.data || []);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };
    if (productId) fetchReviews();
  }, [productId]);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary-600" />
            Customer Reviews
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1 text-orange-500">
              <span className="text-2xl font-black">
                {averageRating || "New"}
              </span>
              <Star className="w-5 h-5 fill-orange-500" />
            </div>
            <p className="text-sm text-gray-400 font-bold">
              based on {reviewsCount || 0} reviews
            </p>
          </div>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
          <p className="text-gray-400 text-sm font-medium">
            No reviews yet. Be the first to share your experience!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-900 leading-none mb-1">
                      {review.user?.name || "Verified Customer"}
                    </p>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < review.rating ? "fill-orange-500 text-orange-500" : "text-gray-200"}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed font-medium">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
