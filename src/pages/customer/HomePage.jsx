import React, { useState, useEffect } from "react";
import {
  MapPin,
  ArrowRight,
  Star,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Zap,
  ShoppingBag,
  Utensils,
  Carrot,
  Smartphone,
  Shirt,
  Armchair,
  AlertCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useLocation } from "../../context/LocationContext";
import LocationPicker from "../../components/customer/LocationPicker";

// Icon mapping for categories
const CATEGORY_ICONS = {
  Groceries: { icon: Carrot, color: "bg-green-100 text-green-600" },
  Food: { icon: Utensils, color: "bg-orange-100 text-orange-600" },
  Fashion: { icon: Shirt, color: "bg-purple-100 text-purple-600" },
  Electronics: { icon: Smartphone, color: "bg-blue-100 text-blue-600" },
  Home: { icon: Armchair, color: "bg-rose-100 text-rose-600" },
  Beauty: { icon: Sparkles, color: "bg-pink-100 text-pink-600" },
};

const HERO_SLIDES = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=2000",
    title: "Fresh Groceries",
    subtitle: "Delivered in 30 minutes",
    cta: "Shop Now",
    color: "text-green-900",
    bg: "from-green-50 to-transparent",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&q=80&w=2000",
    title: "Flash Sale",
    subtitle: "Up to 50% off on Electronics",
    cta: "View Offers",
    color: "text-blue-900",
    bg: "from-blue-50 to-transparent",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=2000",
    title: "New Arrivals",
    subtitle: "Trendy Fashion Collection",
    cta: "Explore",
    color: "text-purple-900",
    bg: "from-purple-50 to-transparent",
  },
];

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [flashSaleProducts, setFlashSaleProducts] = useState([]);
  const [topRatedShops, setTopRatedShops] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch all data in parallel
        const [categoriesRes, featuredRes, flashSaleRes, topRatedRes] =
          await Promise.all([
            api.get("/shops/categories"),
            api.get("/products/featured/list"),
            api.get("/products/flash-sale/list"),
            api.get("/shops/top-rated/list"),
          ]);

        // Map categories with icons
        const categoriesData = (
          Array.isArray(categoriesRes.data)
            ? categoriesRes.data
            : categoriesRes.data.data || []
        ).map((cat) => {
          const categoryName = typeof cat === "string" ? cat : cat.name;
          const iconData = CATEGORY_ICONS[categoryName] || {
            icon: ShoppingBag,
            color: "bg-gray-100 text-gray-600",
          };
          return {
            name: categoryName,
            count: cat.count || 0,
            ...iconData,
          };
        });

        setCategories(categoriesData);
        setFeaturedProducts(featuredRes.data.data || []);
        setFlashSaleProducts(flashSaleRes.data.data || []);
        setTopRatedShops(topRatedRes.data.data || []);
      } catch (error) {
        console.error("Error fetching homepage data:", error);
        setError("Failed to load homepage data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Auto-play slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleCategoryClick = (cat) => {
    navigate(`/shops?category=${cat}`);
  };

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));

  const retryFetch = () => {
    window.location.reload();
  };

  // Skeleton loader components
  const ProductSkeleton = () => (
    <div className="flex-shrink-0 w-40 md:w-48 bg-white rounded-2xl p-3 shadow-md animate-pulse">
      <div className="aspect-square bg-gray-200 rounded-xl mb-3"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      </div>
    </div>
  );

  const ShopSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
      <div className="h-40 bg-gray-200"></div>
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        <div className="flex gap-2">
          <div className="h-6 bg-gray-200 rounded w-20"></div>
          <div className="h-6 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-primary-50 via-white to-purple-50 text-gray-800 min-h-screen pb-20">
      {/* ================= HERO CAROUSEL ================= */}
      <section className="relative w-full h-[200px] md:h-[400px] overflow-hidden bg-gradient-to-r from-primary-100 to-purple-100">
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            {/* Gradient Overlay */}
            <div
              className={`absolute inset-0 bg-gradient-to-r ${slide.bg} via-white/20 to-transparent`}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent md:hidden"></div>

            {/* Content */}
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-md space-y-2 md:space-y-4 p-4 md:p-0">
                  <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur rounded-lg text-xs font-bold uppercase tracking-wider text-gray-900 shadow-sm">
                    {slide.cta}
                  </span>
                  <h2
                    className={`text-3xl md:text-6xl font-black tracking-tight ${slide.color} drop-shadow-sm`}
                  >
                    {slide.title}
                  </h2>
                  <p className="text-gray-800 md:text-gray-700 font-bold text-sm md:text-xl drop-shadow-sm">
                    {slide.subtitle}
                  </p>
                  <button
                    onClick={() => navigate("/shops")}
                    className="hidden md:inline-flex mt-4 bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition-colors shadow-lg"
                  >
                    Check it out
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Slider Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/50 hover:bg-white rounded-full backdrop-blur-sm transition-all hidden md:block"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/50 hover:bg-white rounded-full backdrop-blur-sm transition-all hidden md:block"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2 h-2 rounded-full transition-all ${idx === currentSlide ? "w-6 bg-white" : "bg-white/50"}`}
            />
          ))}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 -mt-6 relative z-30">
        {/* ================= CATEGORIES ================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h3 className="text-lg md:text-xl font-black text-gray-900 mb-4">
            Shop by Category
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6 gap-3 md:gap-4">
            {categories.map((cat) => {
              const IconComponent = cat.icon;
              return (
                <button
                  key={cat.name}
                  onClick={() => handleCategoryClick(cat.name.toLowerCase())}
                  className="group flex flex-col items-center gap-2 md:gap-3 p-3 md:p-4 bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 hover:scale-105"
                >
                  <div
                    className={`w-12 h-12 md:w-16 md:h-16 ${cat.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <IconComponent className="w-6 h-6 md:w-8 md:h-8" />
                  </div>
                  <span className="text-xs md:text-sm font-bold text-gray-900 text-center line-clamp-1">
                    {cat.name}
                  </span>
                  {cat.count > 0 && (
                    <span className="text-[10px] md:text-xs text-gray-500">
                      {cat.count} shops
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* ================= FLASH SALE (Mock) ================= */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-xl md:text-2xl font-black text-gray-900">
                Flash Sale
              </h3>
              <div className="bg-primary-100 text-primary-700 px-2 py-1 rounded text-xs font-black animate-pulse">
                ENDING SOON
              </div>
            </div>
            <Link
              to="/shops"
              className="text-sm font-bold text-primary-600 hover:text-primary-700"
            >
              See All
            </Link>
          </div>

          <div className="bg-gradient-to-r from-primary-500 to-purple-600 rounded-3xl p-1 md:p-6 shadow-lg">
            <div className="flex overflow-x-auto gap-4 p-4 no-scrollbar">
              {flashSaleProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="flex-shrink-0 w-40 md:w-48 bg-white rounded-2xl p-3 shadow-md hover:shadow-xl transition-shadow"
                >
                  <div className="relative aspect-square bg-gray-100 rounded-xl mb-3 overflow-hidden">
                    <img
                      src={product.image_url}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      alt={product.name}
                    />
                    <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-md">
                      SALE
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-gray-900 text-sm truncate">
                      {product.name}
                    </p>
                    {product.shop && (
                      <p className="text-[10px] text-gray-500 truncate">
                        {product.shop.name}
                      </p>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="text-primary-600 font-black text-sm">
                        Rs. {product.price}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ================= JUST FOR YOU ================= */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary-600" />
                Just for You
              </h2>
              <p className="text-gray-500 text-sm font-medium">
                Handpicked recommendations based on your preferences
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300"
              >
                <div className="relative aspect-square bg-gray-100 overflow-hidden">
                  <img
                    src={product.image_url}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    alt={product.name}
                  />
                  <div className="absolute top-2 right-2 bg-primary-600 text-white text-[10px] font-bold px-2 py-1 rounded-md">
                    NEW
                  </div>
                </div>
                <div className="p-3">
                  <p className="font-bold text-sm text-gray-900 line-clamp-2 mb-1">
                    {product.name}
                  </p>
                  {product.shop && (
                    <p className="text-[10px] text-gray-500 truncate mb-2">
                      {product.shop.name}
                    </p>
                  )}
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-bold text-gray-600">4.5</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-primary-600 font-black text-sm">
                      Rs. {product.price}
                    </span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        // Add to cart logic here
                      }}
                      className="w-7 h-7 bg-primary-600 hover:bg-primary-700 text-white rounded-lg flex items-center justify-center transition-colors"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ================= TOP RATED SHOPS ================= */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                <Zap className="w-6 h-6 text-primary-600" />
                Top Rated Shops
              </h2>
              <p className="text-gray-500 text-sm font-medium">
                Highest rated shops in your area
              </p>
            </div>
            <Link
              to="/shops"
              className="text-sm font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topRatedShops.map((shop) => (
              <Link
                key={shop.id}
                to={`/shops/${shop.id}`}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300"
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={shop.image_url}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    alt={shop.name}
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-black text-gray-900">
                      4.8
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">
                    {shop.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <MapPin className="w-3 h-3" />
                    <span>{shop.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-primary-50 text-primary-600 px-3 py-1 rounded-lg text-xs font-bold">
                      Fast Delivery
                    </span>
                    <span className="bg-green-50 text-green-600 px-3 py-1 rounded-lg text-xs font-bold">
                      Open Now
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <LocationPicker
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />
    </div>
  );
}
