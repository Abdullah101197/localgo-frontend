import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Star,
  Clock,
  Filter,
  ChevronRight,
  ArrowUpDown,
  SlidersHorizontal,
  ChevronLeft,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../../api/axios";
import { useLocation } from "../../context/LocationContext";

export default function ShopsPage() {
  const { location: globalLocation, address: globalAddress } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [shops, setShops] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("query") || "",
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "All",
  );
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

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
    const fetchShops = async () => {
      try {
        setLoading(true);
        const params = {
          query: searchQuery,
          category: selectedCategory,
          page: currentPage,
        };

        // Add location if available from global context
        if (globalLocation) {
          params.latitude = globalLocation.lat;
          params.longitude = globalLocation.lng;
        }

        const response = await api.get("/shops", { params });
        setShops(response.data.data || []);
        setPagination(response.data.meta || null);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching shops:", error);
        setLoading(false);
      }
    };

    fetchShops();
  }, [searchQuery, selectedCategory, globalLocation, currentPage]);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setSearchParams({ query: searchQuery, category: cat });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header / Search Area */}
      <div className="bg-white border-b border-gray-100 pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                {searchQuery
                  ? `Results for "${searchQuery}"`
                  : "Discover Local Shops"}
              </h1>
              <p className="text-gray-500 mt-2 font-medium">
                Showing top rated shops near{" "}
                <span className="text-primary-600 italic">
                  {globalAddress ? globalAddress.split(",")[0] : "Islamabad"}
                </span>
              </p>
            </div>

            <div className="w-full md:w-96">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                <input
                  type="text"
                  placeholder="Search for shops or items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary-500/10 focus:border-primary-600 outline-none transition-all font-bold text-gray-900"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Filters Sidebar */}
          <aside className="hidden lg:block space-y-8">
            <div>
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <Filter className="w-4 h-4" /> Filters
              </h3>

              <div className="space-y-6">
                <div>
                  <p className="font-black text-gray-900 text-sm mb-4">
                    Categories
                  </p>
                  <div className="space-y-3">
                    {categories.map((cat) => (
                      <label
                        key={cat}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategory === cat}
                          onChange={() => handleCategoryChange(cat)}
                          className="w-5 h-5 border-2 border-gray-200 rounded-lg checked:bg-primary-600 checked:border-primary-600 transition-all cursor-pointer"
                        />
                        <span className="text-sm font-bold text-gray-600 group-hover:text-primary-600 transition-colors">
                          {cat}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-gray-100"></div>

                <div>
                  <p className="font-black text-gray-900 text-sm mb-4">
                    Distance
                  </p>
                  <input
                    type="range"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                  />
                  <div className="flex justify-between mt-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <span>0km</span>
                    <span>10km</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary-600 rounded-[2rem] p-8 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000"></div>
              <div className="relative z-10">
                <h4 className="text-xl font-black mb-2">Free Delivery</h4>
                <p className="text-white/80 text-sm font-medium mb-6">
                  On your first 3 orders above Rs. 1000.
                </p>
                <button className="bg-white text-primary-600 px-6 py-3 rounded-xl text-xs font-black shadow-xl hover:bg-gray-900 hover:text-white transition-all">
                  Claim Now
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {/* Sort & Mobile Filter Toggle */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                <ArrowUpDown className="w-4 h-4" />
                <span>Sort by:</span>
                <select className="bg-transparent text-gray-900 outline-none font-black cursor-pointer">
                  <option>Popularity</option>
                  <option>Distance</option>
                  <option>Rating</option>
                </select>
              </div>

              <button className="lg:hidden flex items-center gap-2 bg-white px-5 py-2.5 rounded-xl border border-gray-100 shadow-sm text-sm font-bold text-gray-600">
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-[2.5rem] h-80 animate-pulse border border-gray-100"
                  ></div>
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {shops.map((shop) => (
                    <Link
                      to={`/shops/${shop.id}`}
                      key={shop.id}
                      className="group bg-white rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-primary-600/10 border border-gray-100 overflow-hidden transition-all duration-700 hover:-translate-y-2 flex flex-col"
                    >
                      <div className="relative h-56 overflow-hidden">
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

                        <div className="absolute bottom-4 left-6 right-6 text-white">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-1">
                            {shop.category}
                          </p>
                          <h3 className="font-black text-2xl leading-none">
                            {shop.name}
                          </h3>
                        </div>
                      </div>

                      <div className="p-8">
                        <div className="flex justify-between items-center mb-6">
                          <div className="flex items-center gap-2">
                            <div className="bg-orange-50 px-2.5 py-1.5 rounded-xl flex items-center gap-1.5">
                              <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
                              <span className="text-sm font-black text-orange-700">
                                {shop.rating}
                              </span>
                            </div>
                            <span className="text-xs font-bold text-gray-400">
                              ({shop.reviews} reviews)
                            </span>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary-600 group-hover:text-white transition-all duration-500">
                            <ChevronRight className="w-6 h-6" />
                          </div>
                        </div>

                        <p className="text-gray-500 text-sm font-medium line-clamp-1 mb-2">
                          {shop.description}
                        </p>
                        <div className="flex items-center gap-2 text-gray-400">
                          <MapPin className="w-3.5 h-3.5" />
                          <span className="text-xs font-bold">
                            {shop.address}
                          </span>
                        </div>
                      </div>
                    </Link>
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
            )}

            {!loading && shops.length === 0 && (
              <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-gray-200">
                <Search className="w-16 h-16 text-gray-200 mx-auto mb-6" />
                <h3 className="text-xl font-black text-gray-900 mb-2">
                  No shops found
                </h3>
                <p className="text-gray-500 font-medium">
                  Try adjusting your filters or search query.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
