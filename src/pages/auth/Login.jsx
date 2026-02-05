import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
    ShoppingBag,
    Mail,
    Lock,
    ArrowRight,
    AlertCircle,
    Loader2,
} from "lucide-react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        const result = await login(email, password);

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
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-50 rounded-full blur-[120px] opacity-60"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] opacity-60"></div>
            </div>

            <div className="w-full max-w-[440px] relative">
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
                        Welcome back!
                    </h1>
                    <p className="text-gray-500 font-medium">
                        Please enter your details to sign in.
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-white/70 backdrop-blur-xl border border-gray-100 rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-gray-200/50">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl flex items-center gap-3 text-sm font-bold animate-shake">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                {error}
                            </div>
                        )}

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
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="john@example.com"
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:bg-white focus:border-primary-600 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all duration-300"
                                />
                                <Mail className="absolute left-4 top-4 h-5 w-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label
                                    htmlFor="password"
                                    className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1"
                                >
                                    Password
                                </label>
                                <button
                                    type="button"
                                    className="text-[11px] font-black uppercase tracking-widest text-primary-600 hover:text-primary-700 transition-colors"
                                >
                                    Forgot Pwd?
                                </button>
                            </div>
                            <div className="relative group">
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
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
                                    Sign In{" "}
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-gray-50 flex items-center justify-center gap-2">
                        <span className="text-gray-400 text-sm font-bold">
                            Don't have an account?
                        </span>
                        <Link
                            to="/register"
                            className="text-primary-600 text-sm font-black hover:text-primary-700 transition-colors underline-offset-4 hover:underline"
                        >
                            Create One
                        </Link>
                    </div>
                </div>

                {/* Footer Quote */}
                <p className="mt-10 text-center text-gray-400 text-xs font-bold uppercase tracking-[0.2em]">
                    Delivering Joy to 1,000+ Neighborhoods
                </p>
            </div>
        </div>
    );
}
