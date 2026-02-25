import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

export default function FavoriteButton({ productId, className = "" }) {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      checkFavoriteStatus();
    }
  }, [productId, user]);

  const checkFavoriteStatus = async () => {
    try {
      const response = await api.get("/favorites");
      const favorites = response.data.data;
      setIsFavorite(favorites.some((fav) => fav.id === productId));
    } catch (error) {
      console.error("Failed to check favorite status:", error);
    }
  };

  const toggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      alert("Please login to add favorites");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/favorites", { product_id: productId });
      setIsFavorite(response.data.is_favorite);
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`p-2 rounded-full transition-all hover:scale-110 disabled:opacity-50 ${
        isFavorite
          ? "bg-red-50 text-red-500"
          : "bg-white/90 backdrop-blur text-gray-400 hover:text-red-500"
      } ${className}`}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        className={`w-4 h-4 transition-all ${isFavorite ? "fill-current" : ""}`}
      />
    </button>
  );
}
