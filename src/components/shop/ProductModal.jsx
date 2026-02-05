import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { X, Loader2, Upload, Plus } from "lucide-react";

export default function ProductModal({
    isOpen,
    onClose,
    onSave,
    product = null,
}) {
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        description: "",
        price: "",
        stock: "",
        image_url: "",
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || "",
                category: product.category || "",
                description: product.description || "",
                price: product.price || "",
                stock: product.stock || "",
                image_url: product.image_url || "",
            });
        } else {
            setFormData({
                name: "",
                category: "",
                description: "",
                price: "",
                stock: "",
                image_url: "",
            });
        }
    }, [product, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await onSave(formData);
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <button
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
                onKeyDown={(e) => e.key === "Escape" && onClose()}
                aria-label="Close modal"
            ></button>

            <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h3 className="text-xl font-black text-gray-900 tracking-tight">
                            {product
                                ? "Edit Product"
                                : "New Neighborhood Product"}
                        </h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                            {product
                                ? `Editing: ${product.name}`
                                : "Add something fresh to your shop"}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2.5 hover:bg-white rounded-xl transition-all active:scale-95 text-gray-400 hover:text-gray-900 shadow-sm border border-transparent hover:border-gray-100"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label
                                htmlFor="product-name"
                                className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1"
                            >
                                Product Name
                            </label>
                            <input
                                id="product-name"
                                required
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        name: e.target.value,
                                    })
                                }
                                className="w-full bg-gray-50 border border-transparent focus:border-primary-600 focus:bg-white rounded-2xl px-5 py-3.5 text-sm font-bold transition-all outline-none"
                                placeholder="e.g. Fresh Organic Apples"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label
                                htmlFor="product-category"
                                className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1"
                            >
                                Category
                            </label>
                            <input
                                id="product-category"
                                required
                                value={formData.category}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        category: e.target.value,
                                    })
                                }
                                className="w-full bg-gray-50 border border-transparent focus:border-primary-600 focus:bg-white rounded-2xl px-5 py-3.5 text-sm font-bold transition-all outline-none"
                                placeholder="e.g. Fruits, Dairy, Snacks"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label
                                htmlFor="product-description"
                                className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1"
                            >
                                Description
                            </label>
                            <textarea
                                id="product-description"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        description: e.target.value,
                                    })
                                }
                                rows="3"
                                className="w-full bg-gray-50 border border-transparent focus:border-primary-600 focus:bg-white rounded-2xl px-5 py-3.5 text-sm font-bold transition-all outline-none resize-none"
                                placeholder="Describe the quality and freshness..."
                            ></textarea>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label
                                    htmlFor="product-price"
                                    className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1"
                                >
                                    Price (Rs.)
                                </label>
                                <input
                                    id="product-price"
                                    required
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            price: e.target.value,
                                        })
                                    }
                                    className="w-full bg-gray-50 border border-transparent focus:border-primary-600 focus:bg-white rounded-2xl px-5 py-3.5 text-sm font-bold transition-all outline-none"
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label
                                    htmlFor="product-stock"
                                    className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1"
                                >
                                    Stock Level
                                </label>
                                <input
                                    id="product-stock"
                                    required
                                    type="number"
                                    value={formData.stock}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            stock: e.target.value,
                                        })
                                    }
                                    className="w-full bg-gray-50 border border-transparent focus:border-primary-600 focus:bg-white rounded-2xl px-5 py-3.5 text-sm font-bold transition-all outline-none"
                                    placeholder="Available units"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label
                                htmlFor="product-image"
                                className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1"
                            >
                                Image URL
                            </label>
                            <div className="relative">
                                <input
                                    id="product-image"
                                    value={formData.image_url}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            image_url: e.target.value,
                                        })
                                    }
                                    className="w-full bg-gray-50 border border-transparent focus:border-primary-600 focus:bg-white rounded-2xl px-5 py-3.5 pl-12 text-sm font-bold transition-all outline-none"
                                    placeholder="https://images.unsplash.com/..."
                                />
                                <Upload className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-8 py-4 rounded-2xl bg-gray-100 text-gray-900 text-xs font-black uppercase tracking-widest hover:bg-gray-200 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={submitting}
                            className="flex-[2] bg-primary-600 text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-primary-700 transition-all shadow-xl shadow-primary-200 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {submitting && (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            )}
                            {!submitting &&
                                (product ? "Update Product" : "Add Product")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

ProductModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    product: PropTypes.object,
};
