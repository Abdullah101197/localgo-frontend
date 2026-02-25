import React from "react";
import { X, ShoppingCart, Star, ShieldCheck, Truck } from "lucide-react";
import ReviewSection from "./ReviewSection";

export default function ProductModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
}) {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-[2.5rem] shadow-2xl shadow-gray-900/20 overflow-hidden flex flex-col md:flex-row relative animate-in zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-20 w-10 h-10 bg-white/80 backdrop-blur-md rounded-2xl flex items-center justify-center text-gray-400 hover:text-gray-900 hover:scale-110 transition-all shadow-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Image & Quick Info */}
        <div className="w-full md:w-1/2 bg-gray-50 relative overflow-y-auto scrollbar-hide">
          <img
            src={
              product.image_url ||
              "https://images.unsplash.com/photo-1542838132-92c53300491e"
            }
            className="w-full h-80 md:h-[500px] object-cover"
            alt={product.name}
          />
          <div className="p-8 space-y-8">
            <div>
              <span className="text-[10px] bg-primary-100 text-primary-600 px-3 py-1 rounded-full font-black uppercase tracking-widest">
                {product.category}
              </span>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight mt-3">
                {product.name}
              </h2>
              <div className="flex items-center gap-4 mt-4">
                <p className="text-4xl font-black text-primary-600 tracking-tighter">
                  Rs.{product.price}
                </p>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-600 rounded-xl">
                  <Star className="w-4 h-4 fill-orange-600" />
                  <span className="text-sm font-black">
                    {product.average_rating || "New"} (
                    {product.reviews_count || 0} reviews)
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">
                Description
              </h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                {product.description ||
                  "No description provided for this product. High-quality and fresh for you."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-xs font-black text-gray-700 uppercase leading-none">
                  Fresh & Safe
                </span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <Truck className="w-5 h-5" />
                </div>
                <span className="text-xs font-black text-gray-700 uppercase leading-none">
                  Fast Delivery
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Reviews & Action */}
        <div className="w-full md:w-1/2 flex flex-col p-8 md:p-12 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
          <div className="flex-1">
            <ReviewSection
              productId={product.id}
              averageRating={product.average_rating}
              reviewsCount={product.reviews_count}
            />
          </div>

          <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => {
                onAddToCart(product);
                onClose();
              }}
              disabled={!product.is_active}
              className={`flex-[2] py-5 rounded-[1.5rem] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
                product.is_active
                  ? "bg-primary-600 text-white shadow-xl shadow-primary-200 hover:bg-primary-700 hover:-translate-y-1 active:scale-95"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              <ShoppingCart className="w-6 h-6" />
              {product.is_active ? "Add to Cart" : "Currently Unavailable"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
