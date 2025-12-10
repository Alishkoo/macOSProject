import { useState, useEffect, useCallback } from "react";
import {
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  isFavorite,
} from "../services/favorites.service";

/**
 * Custom hook for managing favorite movies
 * 
 * Features:
 * - Tracks favorite state for a specific movie
 * - Listens to storage changes (cross-tab sync)
 * - Provides toggle function with useCallback
 * - Returns all favorites list
 * 
 * @param {number} movieId - Optional movie ID to track favorite state
 * @returns {Object} - { isFav, toggleFavorite, favorites, refreshFavorites }
 */
const useFavorites = (movieId = null) => {
  const [favorites, setFavorites] = useState([]);
  const [isFav, setIsFav] = useState(false);

  // Load favorites on mount
  const refreshFavorites = useCallback(() => {
    const favs = getFavorites();
    setFavorites(favs);
    
    if (movieId) {
      setIsFav(isFavorite(movieId));
    }
  }, [movieId]);

  // Initial load
  useEffect(() => {
    refreshFavorites();
  }, [refreshFavorites]);

  // Listen for changes (cross-tab and same-page)
  useEffect(() => {
    const handleChange = () => {
      refreshFavorites();
    };

    window.addEventListener("storage", handleChange);
    window.addEventListener("favoritesChanged", handleChange);

    return () => {
      window.removeEventListener("storage", handleChange);
      window.removeEventListener("favoritesChanged", handleChange);
    };
  }, [refreshFavorites]);

  // Toggle favorite with useCallback to prevent re-renders
  const toggleFavorite = useCallback(
    (movie) => {
      if (!movie) return false;

      let success = false;
      if (isFavorite(movie.id)) {
        success = removeFromFavorites(movie.id);
        setIsFav(false);
      } else {
        success = addToFavorites(movie);
        setIsFav(true);
      }

      if (success) {
        window.dispatchEvent(new Event("favoritesChanged"));
        refreshFavorites();
      }

      return success;
    },
    [refreshFavorites]
  );

  return {
    isFav,
    toggleFavorite,
    favorites,
    refreshFavorites,
  };
};

export default useFavorites;
