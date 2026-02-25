import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ChevronLeft,
  ShoppingCart,
  Star,
  ShieldCheck,
  Truck,
  Store,
  Package,
} from "lucide-react";
import api from "../../api/axios";
import { useCart } from "../../context/CartContext";
import FavoriteButton from "../../components/common/FavoriteButton";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-black mb-4">Product Not Found</h2>
        <Link to="/" className="text-primary-600 font-bold">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          to={-1}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 font-bold mb-8 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Image Section */}
          <div className="relative rounded-[3rem] overflow-hidden bg-gray-50 aspect-square group">
            <img
              src={
                product.image_url ||
                "https://images.unsplash.com/photo-1542838132-92c53300491e"
              }
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute top-6 left-6">
              <FavoriteButton productId={product.id} />
            </div>
          </div>

          {/* Info Section */}
          <div className="flex flex-col">
            <div className="mb-4">
              <Link
                to={`/shops/${product.shop_id}`}
                className="inline-flex items-center gap-2 text-primary-600 bg-primary-50 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary-600 hover:text-white transition-all"
              >
                <Store className="w-4 h-4" />
                {product.shop?.name}
              </Link>
            </div>

            <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tight leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-6 mb-8 text-sm">
              <div className="flex items-center gap-2">
                <div className="flex text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <span className="font-bold">4.8</span>
                <span className="text-gray-400 font-medium">(120 Reviews)</span>
              </div>
              <div className="w-px h-4 bg-gray-200" />
              <div className="flex items-center gap-2 text-green-600 font-black uppercase tracking-widest text-[10px]">
                <Package className="w-4 h-4" />
                {product.stock} In Stock
              </div>
            </div>

            <p className="text-lg text-gray-600 leading-relaxed mb-10 font-medium">
              {product.description}
            </p>

            <div className="bg-gray-50 rounded-[2.5rem] p-8 mb-10">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                Price
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-gray-900 tracking-tight">
                  Rs. {product.price}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-100">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Delivery
                  </p>
                  <p className="text-xs font-bold">Fast & Local</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-100">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Certified
                  </p>
                  <p className="text-xs font-bold">Verified Shop</p>
                </div>
              </div>
            </div>

            <button
              onClick={() =>
                addToCart({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.image_url,
                  shopId: product.shop_id,
                  shopName: product.shop?.name,
                })
              }
              className="w-full bg-primary-600 hover:bg-gray-900 text-white py-5 rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary-200 flex items-center justify-center gap-3 transition-all active:scale-95"
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Shopping Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
