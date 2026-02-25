import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  ShoppingCart,
  Store,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useCart } from "../../context/CartContext";
import { useLocation } from "../../context/LocationContext";
import FavoriteButton from "../../components/common/FavoriteButton";

export default function ProductSearchPage() {
  const navigate = useNavigate();
  const { location: globalLocation } = useLocation();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { addToCart } = useCart();

  const query = searchParams.get("query") || "";

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/shops/categories");
        const categoryNames = response.data?.data?.map((c) => c.name) || [];
        setCategories(["All", ...categoryNames]);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = { query, category: selectedCategory, page: currentPage };

        // Use global location for hyper-local search
        if (globalLocation) {
          params.latitude = globalLocation.lat;
          params.longitude = globalLocation.lng;
        } else if (
          searchParams.get("latitude") &&
          searchParams.get("longitude")
        ) {
          // Fallback to URL params if global location is not set
          params.latitude = searchParams.get("latitude");
          params.longitude = searchParams.get("longitude");
        }

        const response = await api.get("/products/search", { params });
        setProducts(response.data.data || []);
        setPagination(response.data.meta || null);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    if (query || selectedCategory !== "All") {
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, [query, selectedCategory, globalLocation, searchParams, currentPage]);

  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url,
      shopId: product.shop_id,
      shopName: product.shop?.name || "Unknown Shop",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-bold">Searching products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 shadow-sm">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900 leading-none">
                {query ? `Search Results for "${query}"` : "Product Search"}
              </h1>
              <p className="text-gray-500 font-medium mt-2">
                Found {products.length} products in your area
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filter */}
        <div className="mb-8 flex gap-3 overflow-x-auto pb-4 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest whitespace-nowrap transition-all shadow-sm ${
                selectedCategory === cat
                  ? "bg-primary-600 text-white shadow-primary-200"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="group bg-white rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-primary-600/10 border border-gray-50 overflow-hidden transition-all duration-700 hover:-translate-y-2 flex flex-col"
                >
                  {/* Product Image */}
                  <Link
                    to={`/products/${product.id}`}
                    className="relative h-56 overflow-hidden bg-gray-50 flex-shrink-0"
                  >
                    <img
                      src={
                        product.image_url ||
                        "https://images.unsplash.com/photo-1542838132-92c53300491e"
                      }
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    <div className="absolute top-4 left-4 z-10">
                      <FavoriteButton productId={product.id} />
                    </div>
                    {product.distance && (
                      <div className="absolute top-4 right-4 bg-green-500 px-3 py-1.5 rounded-xl text-[10px] font-black text-white flex items-center gap-1.5 shadow-xl">
                        <MapPin className="w-3 h-3" />
                        {product.distance} km
                      </div>
                    )}
                  </Link>

                  {/* Product Info */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex-1">
                      <Link to={`/products/${product.id}`}>
                        <h3 className="font-black text-lg text-gray-900 mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors">
                          {product.name}
                        </h3>
                      </Link>

                      {/* Shop Info */}
                      <Link
                        to={`/shops/${product.shop_id}`}
                        className="flex items-center gap-2 text-xs text-gray-400 hover:text-primary-600 mb-4 group/shop"
                      >
                        <Store className="w-3.5 h-3.5" />
                        <span className="font-black uppercase tracking-widest group-hover/shop:underline">
                          {product.shop?.name || "Unknown Shop"}
                        </span>
                      </Link>

                      <p className="text-gray-500 text-sm font-medium line-clamp-2 mb-6 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    {/* Price & Add to Cart */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                      <div>
                        <p className="text-2xl font-black text-primary-600 tracking-tight">
                          Rs. {product.price}
                        </p>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">
                          {product.stock > 0
                            ? `${product.stock} in stock`
                            : "Out of stock"}
                        </p>
                      </div>
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === 0}
                        className="w-12 h-12 bg-primary-600 hover:bg-gray-900 text-white rounded-2xl flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-primary-200 active:scale-90"
                        title="Add to Cart"
                      >
                        <ShoppingCart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.last_page > 1 && (
              <div className="mt-12 flex justify-center items-center gap-4">
                <button
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage(currentPage - 1);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="p-3 bg-white rounded-2xl border border-gray-100 shadow-sm text-gray-600 hover:text-primary-600 disabled:opacity-50 transition-all active:scale-95"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <div className="flex gap-2">
                  {[...Array(pagination.last_page)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setCurrentPage(i + 1);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className={`w-12 h-12 rounded-2xl font-black transition-all ${
                        currentPage === i + 1
                          ? "bg-primary-600 text-white shadow-lg shadow-primary-200"
                          : "bg-white text-gray-600 border border-gray-100 hover:bg-gray-50"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  disabled={currentPage === pagination.last_page}
                  onClick={() => {
                    setCurrentPage(currentPage + 1);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="p-3 bg-white rounded-2xl border border-gray-100 shadow-sm text-gray-600 hover:text-primary-600 disabled:opacity-50 transition-all active:scale-95"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-32 bg-white rounded-[4rem] border-2 border-dashed border-gray-100">
            <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-sm">
              <Search className="w-10 h-10 text-gray-200" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">
              No Products Found
            </h3>
            <p className="text-gray-500 font-medium max-w-xs mx-auto mb-8">
              {query
                ? `We couldn't find any products matching "${query}" in your current area.`
                : "Start typing to explore the best products in your neighborhood."}
            </p>
            <button
              onClick={() => navigate("/")}
              className="btn-primary px-10 py-4 rounded-2xl text-sm italic"
            >
              Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
