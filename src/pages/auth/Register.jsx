import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
    ShoppingBag,
    Mail,
    Lock,
    User,
    Store,
    Bike,
    ArrowRight,
    AlertCircle,
    Loader2,
} from "lucide-react";

export default function Register() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "customer",
    });
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleRoleSelect = (role) => {
        setFormData({ ...formData, role });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        const result = await register(formData);

        if (result.success) {
            navigate("/");
        } else {
            setError(result.message);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            {/* Background Decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-50 rounded-full blur-[120px] opacity-60"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] opacity-60"></div>
            </div>

            <div className="w-full max-w-[540px] relative">
                {/* Logo & Header */}
                <div className="text-center mb-10">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 mb-6 group"
                    >
                        <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center shadow-xl shadow-primary-200 group-hover:rotate-6 transition-transform duration-300">
                            <ShoppingBag className="text-white h-7 w-7" />
                        </div>
                        <span className="text-3xl font-black text-gray-900 tracking-tighter">
                            LocalGo
                        </span>
                    </Link>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
                        Create Account
                    </h1>
                    <p className="text-gray-500 font-medium">
                        Join thousands of locals getting things delivered fast.
                    </p>
                </div>

                {/* Register Card */}
                <div className="bg-white/70 backdrop-blur-xl border border-gray-100 rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-gray-200/50">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl flex items-center gap-3 text-sm font-bold">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">
                                Select Your Role
                            </h3>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    {
                                        id: "customer",
                                        icon: User,
                                        label: "User",
                                    },
                                    {
                                        id: "shop",
                                        icon: Store,
                                        label: "Partner",
                                    },
                                    { id: "rider", icon: Bike, label: "Rider" },
                                ].map((role) => (
                                    <button
                                        key={role.id}
                                        type="button"
                                        onClick={() =>
                                            handleRoleSelect(role.id)
                                        }
                                        className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 ${formData.role === role.id ? "border-primary-600 bg-primary-50 text-primary-600" : "border-gray-50 bg-gray-50/50 text-gray-400 hover:border-gray-100"}`}
                                    >
                                        <role.icon
                                            className={`w-6 h-6 mb-2 ${formData.role === role.id ? "text-primary-600" : "text-gray-400"}`}
                                        />
                                        <span className="text-[11px] font-black uppercase tracking-widest">
                                            {role.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="name"
                                className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1"
                            >
                                Full Name
                            </label>
                            <div className="relative group">
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="John Doe"
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:bg-white focus:border-primary-600 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all duration-300"
                                />
                                <User className="absolute left-4 top-4 h-5 w-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="email"
                                className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1"
                            >
                                Email Address
                            </label>
                            <div className="relative group">
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="john@example.com"
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:bg-white focus:border-primary-600 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all duration-300"
                                />
                                <Mail className="absolute left-4 top-4 h-5 w-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="password"
                                className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1"
                            >
                                Password
                            </label>
                            <div className="relative group">
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="••••••••"
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:bg-white focus:border-primary-600 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all duration-300"
                                />
                                <Lock className="absolute left-4 top-4 h-5 w-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-primary-600 text-white rounded-2xl py-4 font-black flex items-center justify-center gap-2 hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Create Account{" "}
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-gray-50 flex items-center justify-center gap-2">
                        <span className="text-gray-400 text-sm font-bold">
                            Already have an account?
                        </span>
                        <Link
                            to="/login"
                            className="text-primary-600 text-sm font-black hover:text-primary-700 transition-colors underline-offset-4 hover:underline"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>

                {/* Footer Quote */}
                <p className="mt-10 text-center text-gray-400 text-xs font-bold uppercase tracking-[0.2em]">
                    Trusted by 50,000+ users monthly
                </p>
            </div>
        </div>
    );
}
