import { useNavigate } from "react-router-dom";
import { Star, Heart } from "lucide-react";
import { getPosterUrl } from "../services/tmdb.service";
import {
  isFavorite,
  addToFavorites,
  removeFromFavorites,
} from "../services/favorites.service";
import { useState, useEffect } from "react";

const MovieCard = ({ movie, onFavoriteChange }) => {
  const navigate = useNavigate();
  const [favorite, setFavorite] = useState(false);
  const [checking, setChecking] = useState(true);

  // Check favorite status on mount
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      const isFav = await isFavorite(movie.id);
      setFavorite(isFav);
      setChecking(false);
    };
    checkFavoriteStatus();
  }, [movie.id]);

  // Update favorite state when storage changes
  useEffect(() => {
    const checkFavorite = async () => {
      const isFav = await isFavorite(movie.id);
      setFavorite(isFav);
    };

    window.addEventListener("favoritesChanged", checkFavorite);
    return () => window.removeEventListener("favoritesChanged", checkFavorite);
  }, [movie.id]);

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();

    if (favorite) {
      await removeFromFavorites(movie.id);
      setFavorite(false);
    } else {
      await addToFavorites(movie);
      setFavorite(true);
    }

    // Dispatch custom event for same-page updates
    window.dispatchEvent(new Event("favoritesChanged"));

    // Call callback if provided
    if (onFavoriteChange) {
      onFavoriteChange();
    }
  };

  const handleClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer overflow-hidden group"
    >
      {/* Poster */}
      <div className="relative aspect-2/3 overflow-hidden bg-gray-200">
        <img
          src={getPosterUrl(movie.poster_path)}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${
            favorite
              ? "bg-pink-500 text-white"
              : "bg-white/80 text-gray-600 hover:bg-pink-500 hover:text-white"
          }`}
        >
          <Heart size={18} fill={favorite ? "currentColor" : "none"} />
        </button>

        {/* Rating Badge */}
        {movie.vote_average > 0 && (
          <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded-lg flex items-center gap-1">
            <Star size={14} fill="gold" className="text-yellow-400" />
            <span className="text-sm font-semibold">
              {movie.vote_average.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1 font-georama">
          {movie.title}
        </h3>
        <p className="text-sm text-gray-500 font-roboto">
          {movie.release_date
            ? new Date(movie.release_date).getFullYear()
            : "N/A"}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;
