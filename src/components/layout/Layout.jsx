import React from "react";
console.log("!!! LAYOUT VERSION 3 !!!");
import { Link, Outlet, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import {
  ShoppingBag,
  ShoppingCart,
  Menu,
  MessageCircle,
  Send,
  Camera,
  PlayCircle,
  Search,
  Trash2,
  Plus,
  Minus,
  X,
  User,
  LogOut,
  ChevronDown,
  Package,
  ChevronRight,
  LayoutDashboard,
  Bike,
  Shield,
  MapPin,
  Home,
  Grid,
  Heart,
  Carrot,
  Utensils,
  Shirt,
  Smartphone,
  Armchair,
  Sparkles,
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useLocation } from "../../context/LocationContext";
import LocationPicker from "../customer/LocationPicker";
import NotificationBell from "./NotificationBell";

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = React.useState(false);
  const [headerSearch, setHeaderSearch] = React.useState("");
  const [suggestions, setSuggestions] = React.useState([]);
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } =
    useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const { address } = useLocation();
  const [categories, setCategories] = React.useState([]);

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/shops/categories");
        setCategories(response.data.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleHeaderSearch = (e) => {
    if (e.key === "Enter" && headerSearch.trim()) {
      navigate(`/products/search?query=${headerSearch}`);
      setHeaderSearch("");
      setShowSuggestions(false);
    }
  };

  React.useEffect(() => {
    const fetchSuggestions = async () => {
      if (headerSearch.length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const response = await api.get(
          `/products/suggestions?query=${headerSearch}`,
        );
        setSuggestions(response.data);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    };

    const debounce = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(debounce);
  }, [headerSearch]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full overflow-x-hidden">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-xl shadow-[0_2px_20px_rgba(0,0,0,0.02)] sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center gap-4 md:gap-8">
            {/* Logo Section */}
            <div className="flex items-center gap-3 md:gap-6">
              <Link
                to="/"
                className="flex items-center gap-2 group flex-shrink-0"
              >
                <div className="w-9 h-9 md:w-10 md:h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-200 group-hover:rotate-6 transition-transform">
                  <ShoppingBag className="text-white h-5 w-5 md:h-6 md:w-6" />
                </div>
                <span className="text-xl md:text-2xl font-black text-gray-900 tracking-tighter hover:text-primary-600 transition-colors hidden sm:block">
                  LocalGo
                </span>
              </Link>

              {/* Location Display (Desktop) */}
              <button
                onClick={() => setIsLocationModalOpen(true)}
                className="hidden xl:flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-200 transition-all group"
              >
                <div className="text-left leading-tight">
                  <p className="text-[10px] text-gray-500 font-medium">
                    Deliver to
                  </p>
                  <div className="flex items-center gap-1 font-bold text-gray-900 text-sm">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="truncate max-w-[140px]">
                      {address ? address.split(",")[0] : "Select Location"}
                    </span>
                  </div>
                </div>
              </button>
            </div>

            {/* Search Section */}
            <div className="flex-1 max-w-2xl mx-2 md:mx-4">
              <div className="relative w-full group">
                <div className="flex">
                  <div className="relative flex-grow">
                    <input
                      type="text"
                      placeholder="Search..."
                      value={headerSearch}
                      onChange={(e) => {
                        setHeaderSearch(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onKeyDown={handleHeaderSearch}
                      className="w-full bg-gray-100 border border-transparent rounded-l-lg py-2.5 pl-3 pr-4 text-sm focus:bg-white focus:border-primary-600 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                    />
                  </div>
                  <button
                    onClick={() => handleHeaderSearch({ key: "Enter" })}
                    className="bg-primary-600 text-white px-3 md:px-6 rounded-r-lg hover:bg-primary-700 transition-colors flex items-center justify-center"
                  >
                    <Search className="h-5 w-5" />
                  </button>
                </div>

                {/* Autocomplete Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                    <ul className="py-2">
                      {suggestions.map((suggestion, index) => (
                        <li key={index}>
                          <button
                            onClick={() => {
                              const query =
                                typeof suggestion === "string"
                                  ? suggestion
                                  : suggestion.name;
                              navigate(`/products/search?query=${query}`);
                              setHeaderSearch("");
                              setShowSuggestions(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors flex items-center gap-3"
                          >
                            {suggestion.image_url ? (
                              <img
                                src={suggestion.image_url}
                                alt=""
                                className="w-8 h-8 rounded-lg object-cover"
                              />
                            ) : (
                              <Search className="w-4 h-4 text-gray-400" />
                            )}
                            <div className="flex flex-col">
                              <span>
                                {typeof suggestion === "string"
                                  ? suggestion
                                  : suggestion.name}
                              </span>
                              {suggestion.type && (
                                <span className="text-[10px] text-gray-400 uppercase font-black">
                                  {suggestion.type}
                                </span>
                              )}
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 md:gap-5 flex-shrink-0">
              {/* Location (Mobile Icon) - Hidden since it's in sub-header */}
              {/* <button onClick={() => setIsLocationModalOpen(true)} className="xl:hidden p-2 text-gray-600 hover:text-primary-600 transition-colors">
                <MapPin className="w-6 h-6" />
              </button> */}

              {isAuthenticated && (
                <div className="hidden md:block">
                  <NotificationBell />
                </div>
              )}

              <button
                onClick={() => setIsCartOpen(true)}
                className="hidden md:flex relative p-2 text-gray-600 hover:text-primary-600 transition-all items-center"
              >
                <div className="relative">
                  <ShoppingCart className="h-6 w-6 md:h-7 md:w-7" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1.5 bg-primary-600 text-white text-[10px] font-bold rounded-full h-4 w-4 md:h-5 md:w-5 flex items-center justify-center border-2 border-white">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="hidden md:block ml-2 text-sm font-bold text-gray-700">
                  Cart
                </span>
              </button>

              {isAuthenticated ? (
                <div className="hidden md:block relative group">
                  <button className="flex items-center gap-1 text-left">
                    <div className="text-xs">
                      <p className="text-gray-500">Hello,</p>
                      <p className="font-bold text-gray-900 truncate max-w-[80px]">
                        {user?.name?.split(" ")[0]}
                      </p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[60] overflow-hidden">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-gray-50 text-sm font-medium text-gray-700"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 hover:bg-gray-50 text-sm font-medium text-gray-700"
                    >
                      Orders
                    </Link>
                    <Link
                      to="/wishlist"
                      className="block px-4 py-2 hover:bg-gray-50 text-sm font-medium text-gray-700 flex items-center gap-2"
                    >
                      <Heart className="w-4 h-4" />
                      Wishlist
                    </Link>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 hover:bg-red-50 text-sm font-medium text-red-600"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden md:block text-sm font-bold text-gray-900 hover:text-primary-600 whitespace-nowrap"
                >
                  Log In
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Location Bar (Sub-header) */}
          <div
            className="md:hidden pb-3 -mt-2 flex items-center gap-2 text-xs text-gray-600"
            onClick={() => setIsLocationModalOpen(true)}
          >
            <MapPin className="w-3.5 h-3.5 text-gray-500" />
            <span className="truncate">
              Deliver to:{" "}
              <span className="font-bold text-gray-900">
                {address || "Select Location"}
              </span>
            </span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </div>

          {/* Categories Navigation Bar (Desktop) */}
          <div className="hidden md:block border-t border-gray-100">
            <div className="flex items-center gap-6 py-2">
              {/* All Categories Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-bold text-sm">
                  <Grid className="w-4 h-4" />
                  All Categories
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* Dropdown Menu */}
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[60] overflow-hidden">
                  <div className="p-4 grid grid-cols-2 gap-2">
                    {categories.map((category) => {
                      const categoryName =
                        typeof category === "string" ? category : category.name;
                      const iconData = {
                        Groceries: {
                          icon: Carrot,
                          color: "text-green-600 bg-green-50",
                        },
                        Food: {
                          icon: Utensils,
                          color: "text-orange-600 bg-orange-50",
                        },
                        Fashion: {
                          icon: Shirt,
                          color: "text-purple-600 bg-purple-50",
                        },
                        Electronics: {
                          icon: Smartphone,
                          color: "text-blue-600 bg-blue-50",
                        },
                        Home: {
                          icon: Armchair,
                          color: "text-rose-600 bg-rose-50",
                        },
                        Beauty: {
                          icon: Sparkles,
                          color: "text-pink-600 bg-pink-50",
                        },
                      }[categoryName] || {
                        icon: ShoppingBag,
                        color: "text-primary-600 bg-primary-50",
                      };

                      const Icon = iconData.icon;
                      return (
                        <Link
                          key={categoryName}
                          to={`/shops?category=${categoryName.toLowerCase()}`}
                          className={`flex flex-col items-center gap-2 p-3 rounded-xl hover:shadow-md transition-all ${iconData.color}`}
                        >
                          <Icon className="w-6 h-6" />
                          <span className="text-xs font-bold">
                            {categoryName}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Quick Category Links */}
              {categories.slice(0, 4).map((category) => {
                const categoryName =
                  typeof category === "string" ? category : category.name;
                return (
                  <Link
                    key={categoryName}
                    to={`/shops?category=${categoryName.toLowerCase()}`}
                    className="text-sm font-bold text-gray-700 hover:text-primary-600 transition-colors capitalize"
                  >
                    {categoryName}
                  </Link>
                );
              })}
              <Link
                to="/shops"
                className="text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors ml-auto underline"
              >
                All Shops →
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Menu Drawer Overlay */}
        <button
          className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 md:hidden w-full h-full border-none outline-none cursor-default ${isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
          onClick={() => setIsMenuOpen(false)}
          aria-label="Close menu"
        ></button>

        {/* Mobile Menu Drawer */}
        <div
          className={`fixed top-0 right-0 w-[85%] max-w-sm h-full bg-white z-[70] shadow-2xl transform transition-transform duration-500 ease-out md:hidden ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center px-6 py-6 border-b border-gray-50 bg-gray-50/50">
              <span className="text-primary-600 text-xl font-black tracking-tighter">
                LocalGo
              </span>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-900 transition-colors bg-white rounded-xl shadow-sm border border-gray-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex flex-col gap-1 px-4 py-8">
              <div className="px-4 mb-4">
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-3 pl-12 pr-4 text-sm outline-none transition-all focus:border-primary-600"
                  />
                  <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              {[
                { to: "/shops", label: "Shops" },
                { to: "/orders", label: "My Orders" },
                { to: "/profile", label: "Profile" },
              ].map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center px-4 py-4 text-base font-bold text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-2xl transition-all"
                >
                  {item.label}
                </Link>
              ))}

              <div className="mt-6 pt-6 border-t border-gray-100 px-4">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full bg-primary-600 text-white text-center py-4 rounded-2xl font-black shadow-lg shadow-primary-200 transition-all active:scale-95"
                >
                  Sign In
                </Link>
              </div>
            </nav>

            <div className="mt-auto px-8 py-8 bg-gray-50 border-t border-gray-100">
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">
                Need help? 24/7 Support
              </p>
              <p className="text-lg font-black text-gray-800">
                +92 312 3456789
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Brand Column */}
            <div className="space-y-6">
              <Link
                to="/"
                className="text-3xl font-black text-primary-600 tracking-tighter"
              >
                LocalGo
              </Link>
              <p className="text-gray-500 leading-relaxed max-w-xs">
                Your hyper-local marketplace for groceries, medicine, and daily
                essentials. Delivered from trusted local shops to your doorstep
                in minutes.
              </p>
              <div className="flex gap-4">
                {[
                  { icon: MessageCircle, label: "Facebook" },
                  { icon: Send, label: "Twitter" },
                  { icon: Camera, label: "Instagram" },
                  { icon: PlayCircle, label: "Youtube" },
                ].map(({ icon: Icon, label }) => (
                  <a
                    key={label}
                    href={`#${label.toLowerCase()}`}
                    className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-primary-600 hover:text-white transition-all duration-300 shadow-sm hover:-translate-y-1"
                  >
                    <span className="sr-only">{label}</span>
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h4 className="text-lg font-bold text-gray-900">Quick Links</h4>
              <ul className="space-y-4">
                {[
                  { label: "Browse Shops", to: "/shops" },
                  { label: "Categories", to: "/categories" },
                  { label: "Track Order", to: "/orders" },
                  { label: "My Profile", to: "/profile" },
                ].map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className="text-gray-500 hover:text-primary-600 transition-colors font-medium flex items-center gap-2 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-200 group-hover:bg-primary-600 transition-colors"></span>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-6">
              <h4 className="text-lg font-bold text-gray-900">Support</h4>
              <ul className="space-y-4">
                {[
                  "Help Center",
                  "Safety Information",
                  "Terms of Service",
                  "Privacy Policy",
                  "Refund Policy",
                ].map((item) => (
                  <li key={item}>
                    <a
                      href={`#${item}`}
                      className="text-gray-500 hover:text-primary-600 transition-colors font-medium"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* App Download / Newsletter */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-gray-900">
                  Experience LocalGo on Mobile
                </h4>
                <div className="flex flex-col gap-4">
                  <button className="bg-gray-900 text-white px-6 py-3.5 rounded-2xl flex items-center gap-4 hover:bg-black transition-all shadow-xl shadow-black/10 active:scale-[0.98] group">
                    <div className="w-8 h-8 flex items-center justify-center bg-white/10 rounded-lg group-hover:scale-110 transition-transform">
                      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                        <path d="M17.523 15.3414C16.8929 15.3414 16.3813 14.8298 16.3813 14.1997C16.3813 13.5696 16.8929 13.058 17.523 13.058C18.1531 13.058 18.6647 13.5696 18.6647 14.1997C18.6647 14.8298 18.1531 15.3414 17.523 15.3414ZM12.012 15.3414C11.3819 15.3414 10.8703 14.8298 10.8703 14.1997C10.8703 13.5696 11.3819 13.058 12.012 13.058C12.6421 13.058 13.1537 13.5696 13.1537 14.1997C13.1537 14.8298 12.6421 15.3414 12.012 15.3414ZM17.34 11.1361L18.8415 8.53612C18.9555 8.338 18.8878 8.0851 18.6908 7.9711C18.4938 7.8571 18.2409 7.9248 18.1269 8.1218L16.5921 10.7816C15.228 10.1601 13.6841 9.80781 12.012 9.80781C10.3399 9.80781 8.79603 10.1601 7.4319 10.7816L5.8971 8.1218C5.7831 7.9248 5.53023 7.8571 5.3332 7.9711C5.13617 8.0851 5.06847 8.338 5.18247 8.53612L6.68393 11.1361C4.01777 12.5714 2.19307 15.3182 2.02293 18.5262H22C21.8299 15.3182 20.0052 12.5714 17.34 11.1361Z" />
                      </svg>
                    </div>
                    <div className="text-left leading-tight">
                      <p className="text-[10px] uppercase font-black tracking-widest opacity-60">
                        GET IT ON
                      </p>
                      <p className="text-base font-black">Google Play</p>
                    </div>
                  </button>
                  <button className="bg-gray-900 text-white px-6 py-3.5 rounded-2xl flex items-center gap-4 hover:bg-black transition-all shadow-xl shadow-black/10 active:scale-[0.98] group">
                    <div className="w-8 h-8 flex items-center justify-center bg-white/10 rounded-lg group-hover:scale-110 transition-transform">
                      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.1 2.48-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .76-3.27.82-1.31.05-2.31-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.24-1.99 1.1-3.15-1.02.04-2.25.68-2.98 1.54-.66.76-1.24 1.93-1.1 3.05 1.14.09 2.25-.61 2.98-1.44z" />
                      </svg>
                    </div>
                    <div className="text-left leading-tight">
                      <p className="text-[10px] uppercase font-black tracking-widest opacity-60">
                        Download on the
                      </p>
                      <p className="text-base font-black">App Store</p>
                    </div>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest">
                  Subscribe for Deals
                </h4>
                <div className="flex gap-2 p-1 bg-white rounded-2xl border border-gray-100 shadow-sm focus-within:border-primary-600 focus-within:ring-4 focus-within:ring-primary-500/10 transition-all">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="bg-transparent px-4 py-2.5 text-sm outline-none flex-1 font-medium"
                  />
                  <button className="btn-primary py-2 px-6 rounded-xl text-xs">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-gray-400 text-sm font-medium">
              &copy; 2026 LocalGo. All rights reserved. Made in Pakistan 🇵🇰
            </p>
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                All Systems Operational
              </div>
              <div className="flex gap-4">
                {/* Payment Icons Placeholder */}
                <div className="w-8 h-5 bg-gray-100 rounded"></div>
                <div className="w-8 h-5 bg-gray-100 rounded"></div>
                <div className="w-8 h-5 bg-gray-100 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <LocationPicker
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />

      {/* Cart Drawer Overlay */}
      <button
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] transition-opacity duration-500 w-full h-full border-none outline-none cursor-default ${isCartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsCartOpen(false)}
        onKeyDown={(e) => e.key === "Escape" && setIsCartOpen(false)}
        aria-label="Close cart"
      ></button>

      {/* Cart Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white z-[80] shadow-2xl transition-transform duration-500 ease-out transform ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div>
              <h3 className="text-xl font-black text-gray-900 tracking-tight">
                Shopping Cart
              </h3>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                {cartCount} Items
              </p>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 hover:bg-white rounded-xl transition-all active:scale-95 text-gray-400 hover:text-gray-900 shadow-sm border border-transparent hover:border-gray-100"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center">
                  <ShoppingCart className="w-10 h-10 text-gray-200" />
                </div>
                <div>
                  <h4 className="font-black text-gray-900 text-lg">
                    Your cart is empty
                  </h4>
                  <p className="text-gray-400 font-bold text-sm mt-1 uppercase tracking-widest">
                    Start adding some items!
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="btn-primary px-8 py-3 text-sm rounded-xl"
                >
                  Browse Shops
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="group relative flex gap-4 p-4 rounded-3xl border border-gray-50 hover:border-primary-100 hover:bg-primary-50/20 transition-all duration-300"
                >
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={
                        item.image_url ||
                        "https://images.unsplash.com/photo-1542838132-92c53300491e"
                      }
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest mb-1">
                      {item.shop_name}
                    </p>
                    <h4 className="font-bold text-gray-900 text-sm truncate">
                      {item.name}
                    </h4>
                    <p className="text-primary-600 font-black text-sm mt-1">
                      Rs. {item.price}
                    </p>

                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-1 bg-white border border-gray-100 rounded-xl p-1 shadow-sm">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-primary-600 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-black text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-primary-600 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer / Checkout */}
          {cart.length > 0 && (
            <div className="p-8 bg-white border-t border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.03)] space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm font-bold text-gray-500">
                  <span>Subtotal</span>
                  <span>Rs. {cartTotal}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold text-gray-500">
                  <span>Delivery Fee</span>
                  <span>Rs. 100</span>
                </div>
                <div className="pt-3 border-t border-gray-50 flex justify-between items-center">
                  <span className="text-lg font-black text-gray-900">
                    Total
                  </span>
                  <span className="text-2xl font-black text-primary-600 tracking-tight">
                    Rs. {cartTotal + 100}
                  </span>
                </div>
              </div>

              <Link
                onClick={() => setIsCartOpen(false)}
                to="/checkout"
                className="btn-primary w-full py-5 text-base rounded-[1.5rem] shadow-xl shadow-primary-200 flex justify-center items-center gap-2"
              >
                Proceed to Checkout <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <div className="grid grid-cols-4 h-16">
          <Link
            to="/"
            className="flex flex-col items-center justify-center gap-1 text-gray-600 hover:text-primary-600 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-bold">Home</span>
          </Link>
          <Link
            to="/categories"
            className="flex flex-col items-center justify-center gap-1 text-gray-600 hover:text-primary-600 transition-colors"
          >
            <Grid className="w-5 h-5" />
            <span className="text-[10px] font-bold">Categories</span>
          </Link>
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex flex-col items-center justify-center gap-1 text-gray-600 hover:text-primary-600 transition-colors relative"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-[8px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold">Cart</span>
          </button>
          <Link
            to={isAuthenticated ? "/profile" : "/login"}
            className="flex flex-col items-center justify-center gap-1 text-gray-600 hover:text-primary-600 transition-colors"
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] font-bold">Account</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
