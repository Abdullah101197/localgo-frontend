import {
  ShoppingCart,
  Star,
  MapPin,
  ChevronRight,
  Filter,
  CheckCircle2,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import { useCart } from "../../context/CartContext";

import ProductModal from "../../components/customer/ProductModal";
import FavoriteButton from "../../components/common/FavoriteButton";

export default function ShopDetail() {
  const { id } = useParams();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const { addToCart, cartCount, cartTotal } = useCart();

  const handleAddToCart = (product) => {
    if (!shop) return;
    addToCart({
      ...product,
      shop_id: shop.id,
      shop_name: shop.name,
    });
  };

  const handleOpenProduct = (product) => {
    setSelectedProduct(product);
    setProductModalOpen(true);
  };

  useEffect(() => {
    const fetchShop = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/shops/${id}`);
        setShop(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching shop:", error);
        setLoading(false);
      }
    };
    fetchShop();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-black text-gray-900">Shop not found</h2>
          <p className="text-gray-500 mt-2">
            The shop you are looking for does not exist.
          </p>
        </div>
      </div>
    );
  }

  const categories = [
    "All",
    ...new Set((shop.products || []).map((p) => p.category)),
  ];
  const filteredProducts = (shop.products || []).filter((p) => {
    const matchesCategory =
      activeCategory === "All" || p.category === activeCategory;
    const matchesSearch = p.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-gradient-to-br from-primary-50 via-white to-purple-50 min-h-screen py-8 md:py-12">
      {/* ================= SHOP INFO ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="bg-white rounded-[2.5rem] p-6 sm:p-10 shadow-sm border border-gray-100 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full -mr-16 -mt-16 opacity-50"></div>

          <div className="relative z-10 md:flex justify-between items-center gap-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6">
              <div className="relative">
                <img
                  src={shop.image_url || "https://i.imgur.com/3GvwNBf.png"}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl shadow-xl border-4 border-white object-cover"
                  alt={shop.name}
                />
                {shop.is_verified && (
                  <div className="absolute -bottom-2 -right-2 bg-green-500 border-4 border-white rounded-full p-2 shadow-lg">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                    {shop.name}
                  </h2>
                  {shop.is_verified && (
                    <span className="text-[10px] bg-green-500 text-white px-3 py-1 rounded-full font-black uppercase tracking-widest flex items-center gap-1.5 shadow-md shadow-green-200">
                      Verified
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-6 gap-y-2 text-sm text-gray-500 font-bold">
                  <span className="flex items-center gap-1.5 text-orange-500">
                    <Star className="w-4 h-4 fill-orange-500" />{" "}
                    {shop.average_rating || "New"} ({shop.reviews_count || 0})
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-primary-600" />{" "}
                    {shop.address}
                  </span>
                  <span className="text-green-600 flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>{" "}
                    Open Now
                  </span>
                </div>
              </div>
            </div>

            {/* <div className="flex gap-4 mt-8 md:mt-0 justify-center">
              <button className="w-14 h-14 rounded-2xl bg-gray-50 text-gray-400 hover:bg-primary-50 hover:text-primary-600 transition-all border border-gray-100 flex items-center justify-center shadow-sm" title="Chat (Coming Soon)">
                <MessageSquare className="w-6 h-6" />
              </button>
              <button className="w-14 h-14 rounded-2xl bg-gray-50 text-gray-400 hover:bg-primary-50 hover:text-primary-600 transition-all border border-gray-100 flex items-center justify-center shadow-sm" title="Notifications (Coming Soon)">
                <Bell className="w-6 h-6" />
              </button>
              <button className="btn-primary px-8" title="Follow (Coming Soon)">Follow</button>
            </div> */}
          </div>

          <div className="h-px bg-gray-50 my-10"></div>

          {/* Breadcrumbs & Sorting */}
          <div className="md:flex justify-between items-center gap-4">
            <div className="flex items-center gap-3 text-sm font-bold text-gray-400 overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
              <span className="text-primary-600 whitespace-nowrap">
                Groceries
              </span>
              <ChevronRight className="w-4 h-4 flex-shrink-0" />
              <span className="whitespace-nowrap">Fruits & Veg</span>
              <ChevronRight className="w-4 h-4 flex-shrink-0" />
              <span className="whitespace-nowrap">Snacks</span>
            </div>

            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-3 text-sm text-gray-500 font-bold bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-100">
                <span>Sort:</span>
                <select className="bg-transparent text-gray-900 outline-none cursor-pointer">
                  <option>Popular</option>
                  <option>Price: Low to High</option>
                  <option>Newest</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MAIN CONTENT ================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10 pb-32">
        {/* SIDEBAR FILTERS (Desktop) */}
        <aside className="hidden md:block space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 sticky top-28">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-black text-gray-900 flex items-center gap-2 uppercase tracking-wider text-sm">
                <Filter className="w-4 h-4 text-primary-600" /> Categories
              </h3>
              <button className="text-xs text-primary-600 font-black uppercase hover:underline">
                Clear
              </button>
            </div>

            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => setActiveCategory(cat)}
                    className={`w-full text-left px-5 py-4 rounded-2xl transition-all font-bold text-sm ${activeCategory === cat ? "bg-primary-600 text-white shadow-xl shadow-primary-200" : "text-gray-500 hover:bg-gray-50 hover:text-primary-600"}`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* MOBILE CATEGORIES (Horizontal Scroll) */}
        <div className="md:hidden -mx-4 px-4 overflow-x-auto pb-6 flex gap-3 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-6 py-3 rounded-2xl font-bold text-sm transition-all ${activeCategory === cat ? "bg-primary-600 text-white shadow-lg shadow-primary-100" : "bg-white text-gray-500 border border-gray-100 shadow-sm"}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* PRODUCTS GRID */}
        <section className="md:col-span-3">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                {activeCategory === "All" ? "All Products" : activeCategory}
              </h3>
              <p className="text-sm text-gray-400 font-bold mt-1 uppercase tracking-widest">
                {filteredProducts.length} Items Found
              </p>
            </div>

            {/* In-Shop Search */}
            <div className="relative w-full md:w-64 mb-4 md:mb-0">
              <input
                type="text"
                placeholder="Search in this shop..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 pl-10 text-sm font-bold focus:ring-2 focus:ring-primary-100 outline-none transition-all"
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
            </div>
          </div>

          {!filteredProducts.length && (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-100">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-300"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <h3 className="text-gray-900 font-bold mb-1">
                No products found
              </h3>
              <p className="text-gray-400 text-xs font-medium">
                Try searching for something else
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-4 text-xs font-black text-primary-600 uppercase tracking-widest hover:underline"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-[2rem] shadow-sm hover:shadow-2xl border border-gray-100 p-5 transition-all duration-500 relative flex flex-col"
              >
                {product.off > 0 && (
                  <span className="absolute top-6 left-6 z-10 bg-orange-500 text-white text-[10px] font-black px-3 py-1.5 rounded-xl shadow-lg shadow-orange-200 uppercase tracking-widest">
                    {product.off}% OFF
                  </span>
                )}

                <div className="relative overflow-hidden rounded-2xl h-48 mb-6 bg-gray-50">
                  <button
                    onClick={() => handleOpenProduct(product)}
                    className="w-full h-full text-left focus:outline-none focus:ring-2 focus:ring-primary-600 rounded-2xl"
                  >
                    <img
                      src={
                        product.image_url ||
                        "https://images.unsplash.com/photo-1542838132-92c53300491e"
                      }
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                      alt={product.name}
                    />
                  </button>
                  <div className="absolute top-2 right-2 z-10">
                    <FavoriteButton productId={product.id} />
                  </div>
                  {!product.is_active && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                      <span className="bg-gray-900 text-white text-xs font-black px-5 py-2.5 rounded-2xl uppercase tracking-widest shadow-2xl">
                        Sold Out
                      </span>
                    </div>
                  )}
                </div>

                <div
                  onClick={() => handleOpenProduct(product)}
                  className="space-y-2 mb-8 cursor-pointer flex-grow px-1"
                >
                  <h4 className="font-bold text-gray-900 text-lg line-clamp-2 leading-tight">
                    {product.name}
                  </h4>
                  <div className="flex items-center gap-3">
                    <p className="text-xl font-black text-primary-600 leading-none">
                      Rs.{product.price}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] font-black text-orange-500">
                      <Star className="w-3 h-3 fill-orange-500" />
                      {product.average_rating || "New"} (
                      {product.reviews_count || 0})
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={!product.is_active}
                  className={
                    product.is_active
                      ? "btn-primary w-full py-4 text-sm"
                      : "w-full py-4 rounded-2xl bg-gray-100 text-gray-400 cursor-not-allowed font-black uppercase text-xs tracking-widest"
                  }
                >
                  <ShoppingCart className="w-5 h-5" />{" "}
                  {product.is_active ? "Add to Cart" : "Unavailable"}
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* PRODUCT MODAL */}
      <ProductModal
        isOpen={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        product={selectedProduct}
        onAddToCart={handleAddToCart}
      />

      {/* MOBILE STICKY BAR */}
      {cartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-[0_-8px_30px_rgb(0,0,0,0.04)] p-4 flex justify-between items-center lg:hidden z-50 border-t border-gray-100 animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Cart Summary</p>
              <p className="text-sm font-bold text-gray-900">
                {cartCount} Items • Rs. {cartTotal}
              </p>
            </div>
          </div>
          <button
            onClick={() => (window.location.href = "/checkout")}
            className="bg-primary-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-primary-100 transition-all active:scale-95"
          >
            Checkout
          </button>
        </div>
      )}
    </div>
  );
}
