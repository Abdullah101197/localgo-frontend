import React, { useState, useEffect } from "react";
import {
    MapPin,
    Clock,
    Warehouse,
    ArrowRight,
    Search,
    Star,
    ShieldCheck,
    ChevronRight,
    ShoppingBag,
    Bike,
    Locate,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function HomePage() {
    const [address, setAddress] = useState("H-8, Islamabad");
    const [categories, setCategories] = useState([]);
    const [shops, setShops] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const [gettingLocation, setGettingLocation] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const params = { limit: 6 };

                // Add location params if available
                if (userLocation) {
                    params.latitude = userLocation.latitude;
                    params.longitude = userLocation.longitude;
                }

                const [catRes, shopRes] = await Promise.all([
                    api.get("/shops/categories"),
                    api.get("/shops", { params }),
                ]);
                setCategories(catRes.data || []);
                setShops(shopRes.data.data || []);
            } catch (error) {
                console.error("Error fetching homepage data:", error);
            }
        };
        fetchData();
    }, [userLocation]);

    const getCurrentLocation = () => {
        setGettingLocation(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const location = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    };
                    setUserLocation(location);
                    setAddress("Your current location");
                    setGettingLocation(false);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    setGettingLocation(false);
                    alert(
                        "Unable to get your location. Please enter manually.",
                    );
                },
            );
        } else {
            setGettingLocation(false);
            alert("Geolocation is not supported by your browser.");
        }
    };

    const handleSearch = () => {
        const params = new URLSearchParams({ query: address });
        if (userLocation) {
            params.append("latitude", userLocation.latitude);
            params.append("longitude", userLocation.longitude);
        }
        navigate(`/products/search?${params.toString()}`);
    };

    const handleCategoryClick = (cat) => {
        navigate(`/shops?category=${cat}`);
    };

    return (
        <div className="bg-gray-50 text-gray-800">
            {/* ================= HERO ================= */}
            <section className="relative overflow-hidden min-h-[320px] md:min-h-[400px] flex items-center bg-gray-100">
                <div className="absolute inset-0 h-full w-full">
                    <img
                        src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&q=80&w=2000"
                        alt="Islamabad"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent"></div>
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-gray-50 to-transparent"></div>
                </div>

                {/* Hero Content */}
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 grid lg:grid-cols-2 gap-10 items-center w-full">
                    <div className="max-w-xl">
                        <span className="inline-block bg-primary-100 text-primary-700 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-6">
                            🚀 Super Fast Delivery
                        </span>
                        <h1 className="text-3xl md:text-5xl font-black leading-[1.1] text-gray-900 tracking-tight">
                            Freshness Delivered <br />
                            <span className="text-primary-600">
                                from Local Shops
                            </span>
                        </h1>

                        <p className="mt-5 text-gray-600 font-medium text-sm md:text-base max-w-md">
                            Get groceries, medicine, and daily essentials
                            delivered from your favorite local stores in under
                            60 minutes.
                        </p>

                        {/* Search Bar */}
                        <div className="mt-10 flex flex-col sm:flex-row gap-3 max-w-2xl bg-white/80 backdrop-blur-xl p-2.5 rounded-[2rem] shadow-2xl shadow-primary-900/10 border border-white/50 group focus-within:bg-white transition-all duration-500">
                            <div className="relative flex-1 group/input">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center group-focus-within/input:scale-110 transition-transform">
                                    <MapPin className="h-5 w-5 text-primary-600" />
                                </div>
                                <input
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    onKeyDown={(e) =>
                                        e.key === "Enter" && handleSearch()
                                    }
                                    placeholder="Enter your delivery area..."
                                    className="w-full pl-16 pr-16 py-4 rounded-2xl border-none focus:ring-0 outline-none transition-all font-bold text-gray-800 text-base"
                                />
                                <button
                                    onClick={getCurrentLocation}
                                    disabled={gettingLocation}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-primary-50 rounded-xl transition-colors disabled:opacity-50"
                                    title="Use my current location"
                                >
                                    <Locate
                                        className={`w-5 h-5 text-primary-600 ${gettingLocation ? "animate-pulse" : ""}`}
                                    />
                                </button>
                            </div>
                            <button
                                onClick={handleSearch}
                                className="btn-primary py-4 px-10 text-base rounded-[1.5rem] flex items-center gap-2 group/btn shadow-lg shadow-primary-600/20 active:scale-95"
                            >
                                <Search className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" />
                                <span>Find Shops</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-white/40 backdrop-blur-md border-y border-gray-100 shadow-sm relative z-10 -mt-10 mx-4 md:mx-auto max-w-6xl rounded-3xl">
                <div className="max-w-7xl mx-auto px-8 py-8 grid grid-cols-1 sm:grid-cols-3 gap-10 items-center text-center">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 group cursor-default">
                        <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center group-hover:bg-orange-600 group-hover:rotate-12 transition-all duration-500">
                            <Clock className="text-orange-600 h-7 w-7 group-hover:text-white transition-colors" />
                        </div>
                        <div className="text-center md:text-left">
                            <p className="font-black text-gray-900 text-lg">
                                Fast Delivery
                            </p>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                                30–60 Minutes
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 group cursor-default sm:border-x border-gray-100">
                        <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:-rotate-12 transition-all duration-500">
                            <ShieldCheck className="text-blue-600 h-7 w-7 group-hover:text-white transition-colors" />
                        </div>
                        <div className="text-center md:text-left">
                            <p className="font-black text-gray-900 text-lg">
                                Secure Payment
                            </p>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                                Multiple Options
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 group cursor-default">
                        <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center group-hover:bg-green-600 group-hover:scale-110 transition-all duration-500">
                            <Warehouse className="text-green-600 h-7 w-7 group-hover:text-white transition-colors" />
                        </div>
                        <div className="text-center md:text-left">
                            <p className="font-black text-gray-900 text-lg">
                                Local Trusted
                            </p>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                                Handpicked Shops
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-20">
                {/* ================= POPULAR CATEGORIES ================= */}
                <section>
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                                Popular Categories
                            </h2>
                            <p className="text-gray-500 mt-2 font-medium">
                                Explore what's trending in your area
                            </p>
                        </div>
                        <button
                            onClick={() => navigate("/categories")}
                            className="hidden sm:flex btn-secondary px-6 text-sm"
                        >
                            View All <ArrowRight className="w-4 h-4 ml-2" />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                        {["Groceries", "Medicine", "Bakery", "Fast Food"].map(
                            (cat) => {
                                const images = {
                                    Groceries:
                                        "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800",
                                    Medicine:
                                        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
                                    Bakery: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800",
                                    "Fast Food":
                                        "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80&w=800",
                                };

                                return (
                                    <button
                                        key={cat}
                                        onClick={() => handleCategoryClick(cat)}
                                        className="group relative overflow-hidden rounded-[2.5rem] shadow-sm hover:shadow-2xl border border-gray-100 aspect-[4/5] flex items-end text-left transition-all duration-500 hover:-translate-y-2"
                                    >
                                        <img
                                            src={images[cat]}
                                            alt={cat}
                                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                                        <div className="relative z-10 p-6 w-full">
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <p className="text-white/80 text-xs font-bold uppercase tracking-widest mb-1">
                                                        Explore
                                                    </p>
                                                    <h3 className="font-black text-white text-2xl leading-none">
                                                        {cat}
                                                    </h3>
                                                </div>
                                                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-primary-600 transition-colors">
                                                    <ArrowRight className="w-5 h-5 text-white" />
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                );
                            },
                        )}
                    </div>

                    <div className="text-center mt-12 sm:hidden">
                        <button className="btn-secondary w-full">
                            View All Categories
                        </button>
                    </div>
                </section>

                {/* ================= NEARBY SHOPS ================= */}
                <section className="bg-white rounded-[3rem] p-8 md:p-16 border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full -mr-32 -mt-32 opacity-50"></div>

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                                Nearby Shops
                            </h2>
                            <p className="text-gray-500 mt-2 font-medium">
                                Available for instant delivery in your area
                            </p>
                        </div>
                        <button className="text-primary-600 font-bold hover:underline flex items-center gap-1">
                            Change Location <MapPin className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                        {shops.map((shop) => (
                            <Link
                                key={shop.id}
                                to={`/shops/${shop.id}`}
                                className="group bg-white rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-primary-600/10 border border-gray-100 overflow-hidden transition-all duration-700 hover:-translate-y-2 flex flex-col cursor-pointer"
                            >
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={shop.image_url}
                                        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                        alt={shop.name}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                    <div className="absolute top-4 left-4 flex gap-2">
                                        <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl text-[10px] font-black text-gray-800 flex items-center gap-1.5 shadow-lg">
                                            <Clock className="w-3 h-3 text-primary-600" />
                                            60 min
                                        </div>
                                        {shop.distance && (
                                            <div className="bg-green-500 px-3 py-1.5 rounded-xl text-[10px] font-black text-white flex items-center gap-1.5 shadow-lg">
                                                <MapPin className="w-3 h-3" />
                                                {shop.distance} km
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute top-4 right-4 bg-primary-600 px-3 py-1.5 rounded-xl text-[10px] font-black text-white flex items-center gap-1.5 shadow-lg">
                                        <MapPin className="w-3 h-3" />
                                        Islamabad
                                    </div>
                                    <div className="absolute bottom-4 left-4 text-white">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-1">
                                            {shop.category}
                                        </p>
                                        <h3 className="font-black text-xl leading-none">
                                            {shop.name}
                                        </h3>
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col justify-between">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <div className="bg-orange-50 px-2 py-1 rounded-lg flex items-center gap-1">
                                                <Star className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                                                <span className="text-sm font-black text-orange-700">
                                                    4.5
                                                </span>
                                            </div>
                                            <span className="text-xs font-bold text-gray-400">
                                                (24 reviews)
                                            </span>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-primary-600 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* ================= HOW IT WORKS ================= */}
                <section className="py-12">
                    <div className="text-center mb-16">
                        <span className="bg-primary-50 text-primary-600 text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full">
                            How it Works
                        </span>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mt-4">
                            Simple, Fast & Reliable
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            {
                                step: "01",
                                title: "Select Location",
                                desc: "Choose your area and discover shops nearby.",
                                icon: MapPin,
                                color: "bg-blue-50 text-blue-600",
                            },
                            {
                                step: "02",
                                title: "Pick Your Items",
                                desc: "Add fresh products to your cart from top stores.",
                                icon: ShoppingBag,
                                color: "bg-primary-50 text-primary-600",
                            },
                            {
                                step: "03",
                                title: "Quick Delivery",
                                desc: "Our rider brings it to your door in minutes.",
                                icon: Bike,
                                color: "bg-orange-50 text-orange-600",
                            },
                        ].map((item) => (
                            <div
                                key={item.step}
                                className="relative group text-center px-6"
                            >
                                <div
                                    className={`w-20 h-20 mx-auto rounded-[2rem] ${item.color} flex items-center justify-center mb-8 relative z-10 group-hover:scale-110 transition-transform duration-500`}
                                >
                                    <item.icon className="w-10 h-10" />
                                    <div className="absolute -top-4 -right-4 w-10 h-10 bg-white rounded-2xl flex items-center justify-center font-black text-gray-900 shadow-xl border border-gray-50">
                                        {item.step}
                                    </div>
                                </div>
                                <h3 className="text-xl font-black text-gray-900 mb-4">
                                    {item.title}
                                </h3>
                                <p className="text-gray-500 font-medium leading-relaxed">
                                    {item.desc}
                                </p>
                                {item.step !== "03" && (
                                    <div className="hidden md:block absolute top-10 left-[70%] w-full border-t-2 border-dashed border-gray-200 -z-0"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* ================= PARTNER PROMOTION ================= */}
                <section className="grid md:grid-cols-2 gap-8">
                    <div className="bg-gray-900 rounded-[3rem] p-10 md:p-16 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/10 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-1000"></div>
                        <div className="relative z-10">
                            <h3 className="text-3xl font-black text-white mb-4">
                                Partner with Us
                            </h3>
                            <p className="text-gray-400 mb-8 max-w-sm font-medium">
                                Own a shop? Reach more customers by joining
                                Pakistan's leading hyper-local marketplace.
                            </p>
                            <button className="bg-white text-gray-900 px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-primary-600 hover:text-white transition-all shadow-xl active:scale-95">
                                Register Shop <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    <div className="bg-primary-600 rounded-[3rem] p-10 md:p-16 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-1000"></div>
                        <div className="relative z-10">
                            <h3 className="text-3xl font-black text-white mb-4">
                                Become a Rider
                            </h3>
                            <p className="text-white/80 mb-8 max-w-sm font-medium">
                                Earn money on your own schedule. Join our fleet
                                of super-fast delivery heroes today.
                            </p>
                            <button className="bg-white text-primary-600 px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-gray-900 hover:text-white transition-all shadow-xl active:scale-95">
                                Start Earning <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
