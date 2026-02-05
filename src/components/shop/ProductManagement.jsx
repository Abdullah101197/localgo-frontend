import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import {
    Package,
    Plus,
    Edit2,
    Trash2,
    Loader2,
    Search,
    AlertCircle,
} from "lucide-react";
import ProductModal from "./ProductModal";
import { useAuth } from "../../context/AuthContext";

export default function ProductManagement() {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [error, setError] = useState("");

    const fetchProducts = async () => {
        if (!user?.shop?.id) return;
        try {
            const response = await api.get(`/products?shop_id=${user.shop.id}`);
            setProducts(response.data.data);
        } catch (err) {
            console.error("Failed to fetch products", err);
            setError("Failed to load products.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [user?.shop?.id]);

    const handleSaveProduct = async (formData) => {
        try {
            if (editingProduct) {
                await api.put(`/products/${editingProduct.id}`, formData);
            } else {
                await api.post("/products", formData);
            }
            await fetchProducts();
            setIsModalOpen(false);
            setEditingProduct(null);
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    const handleDeleteProduct = async (id) => {
        if (
            !globalThis.confirm("Are you sure you want to delete this product?")
        )
            return;
        try {
            await api.delete(`/products/${id}`);
            await fetchProducts();
        } catch (err) {
            console.error(err);
            alert("Failed to delete product.");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-20">
                <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="w-full bg-white border border-gray-100 rounded-xl py-2.5 pl-11 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary-100 transition-all outline-none"
                    />
                </div>
                <button
                    onClick={() => {
                        setEditingProduct(null);
                        setIsModalOpen(true);
                    }}
                    className="btn-primary px-6 py-2.5 flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Add Product
                </button>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold flex items-center gap-2 border border-red-100">
                    <AlertCircle className="w-4 h-4" /> {error}
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.length === 0 ? (
                    <div className="col-span-full bg-white rounded-[2.5rem] p-12 text-center border border-gray-100">
                        <Package className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                        <p className="text-gray-500 font-bold">
                            No products found. Start by adding one!
                        </p>
                    </div>
                ) : (
                    products.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 group"
                        >
                            <div className="h-40 w-full bg-gray-50 rounded-2xl mb-4 overflow-hidden relative">
                                {product.image_url ? (
                                    <img
                                        src={product.image_url}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-200">
                                        <Package className="w-12 h-12" />
                                    </div>
                                )}
                                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => {
                                            setEditingProduct(product);
                                            setIsModalOpen(true);
                                        }}
                                        className="p-2 bg-white rounded-lg shadow-sm text-gray-600 hover:text-primary-600 transition-colors"
                                    >
                                        <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleDeleteProduct(product.id)
                                        }
                                        className="p-2 bg-white rounded-lg shadow-sm text-gray-600 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                            <h4 className="font-black text-gray-900 leading-tight mb-1">
                                {product.name}
                            </h4>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest line-clamp-1 mb-4">
                                {product.description ||
                                    "No description provided"}
                            </p>

                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                                        Price
                                    </p>
                                    <p className="text-lg font-black text-primary-600 tracking-tight">
                                        Rs.{product.price}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                                        Stock
                                    </p>
                                    <p
                                        className={`text-xs font-black ${product.stock > 10 ? "text-gray-900" : "text-amber-600"}`}
                                    >
                                        {product.stock} Units
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <ProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveProduct}
                product={editingProduct}
            />
        </div>
    );
}
