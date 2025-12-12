import { useState, useEffect, useCallback } from "react";
import {
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  isFavorite,
} from "../services/favorites.service";


const useFavorites = (movieId = null) => {
  const [favorites, setFavorites] = useState([]);
  const [isFav, setIsFav] = useState(false);

  // Load favorites on mount
  const refreshFavorites = useCallback(async () => {
    const favs = await getFavorites();
    setFavorites(favs);
    
    if (movieId) {
      const isFav = await isFavorite(movieId);
      setIsFav(isFav);
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
    async (movie) => {
      if (!movie) return false;

      let success = false;
      const currentlyFav = await isFavorite(movie.id);
      
      if (currentlyFav) {
        success = await removeFromFavorites(movie.id);
        setIsFav(false);
      } else {
        success = await addToFavorites(movie);
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
