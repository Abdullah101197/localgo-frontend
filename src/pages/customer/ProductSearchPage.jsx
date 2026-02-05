import React, { useState, useEffect } from "react";
import { Search, MapPin, ShoppingCart, Store } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../../api/axios";
import { useCart } from "../../context/CartContext";

export default function ProductSearchPage() {
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const { addToCart } = useCart();

    const query = searchParams.get("query") || "";
    const latitude = searchParams.get("latitude");
    const longitude = searchParams.get("longitude");

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get("/shops/categories");
                setCategories(["All", ...(response.data || [])]);
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
                const params = { query, category: selectedCategory };

                if (latitude && longitude) {
                    params.latitude = latitude;
                    params.longitude = longitude;
                }

                const response = await api.get("/products/search", { params });
                setProducts(response.data.data || []);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching products:", error);
                setLoading(false);
            }
        };

        if (query) {
            fetchProducts();
        } else {
            setLoading(false);
        }
    }, [query, selectedCategory, latitude, longitude]);

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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 font-bold">
                        Searching products...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Search className="w-8 h-8 text-primary-600" />
                        <h1 className="text-3xl font-black text-gray-900">
                            {query
                                ? `Search Results for "${query}"`
                                : "Product Search"}
                        </h1>
                    </div>
                    <p className="text-gray-500 font-medium">
                        Found {products.length} products
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Category Filter */}
                <div className="mb-8 flex gap-3 overflow-x-auto pb-2">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-6 py-2.5 rounded-full font-black text-sm whitespace-nowrap transition-all ${
                                selectedCategory === cat
                                    ? "bg-primary-600 text-white shadow-lg"
                                    : "bg-white text-gray-700 hover:bg-gray-100"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Products Grid */}
                {products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="bg-white rounded-3xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-500 hover:-translate-y-1 flex flex-col"
                            >
                                {/* Product Image */}
                                <div className="relative h-48 overflow-hidden bg-gray-100">
                                    <img
                                        src={
                                            product.image_url ||
                                            "https://via.placeholder.com/400"
                                        }
                                        alt={product.name}
                                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                                    />
                                    {product.distance && (
                                        <div className="absolute top-3 right-3 bg-green-500 px-3 py-1.5 rounded-xl text-[10px] font-black text-white flex items-center gap-1.5 shadow-lg">
                                            <MapPin className="w-3 h-3" />
                                            {product.distance} km
                                        </div>
                                    )}
                                </div>

                                {/* Product Info */}
                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="flex-1">
                                        <h3 className="font-black text-lg text-gray-900 mb-2 line-clamp-2">
                                            {product.name}
                                        </h3>

                                        {/* Shop Info */}
                                        <Link
                                            to={`/shops/${product.shop_id}`}
                                            className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 mb-3 group"
                                        >
                                            <Store className="w-4 h-4" />
                                            <span className="font-bold group-hover:underline">
                                                {product.shop?.name ||
                                                    "Unknown Shop"}
                                            </span>
                                        </Link>

                                        <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                                            {product.description}
                                        </p>
                                    </div>

                                    {/* Price & Add to Cart */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                        <div>
                                            <p className="text-2xl font-black text-primary-600">
                                                Rs. {product.price}
                                            </p>
                                            <p className="text-xs text-gray-400 font-bold">
                                                Stock: {product.stock}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() =>
                                                handleAddToCart(product)
                                            }
                                            disabled={product.stock === 0}
                                            className="bg-primary-600 hover:bg-primary-700 text-white p-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                                        >
                                            <ShoppingCart className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <Search className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-2xl font-black text-gray-400 mb-2">
                            No Products Found
                        </h3>
                        <p className="text-gray-500">
                            {query
                                ? `No products match "${query}". Try a different search term.`
                                : "Enter a search term to find products"}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
