const FAVORITES_KEY = "tmdb_favorites";


export const getFavorites = () => {
  try {
    const favorites = localStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error("Error getting favorites:", error);
    return [];
  }
};


export const addToFavorites = (movie) => {
  try {
    const favorites = getFavorites();
    const exists = favorites.some((fav) => fav.id === movie.id);
    
    if (!exists) {
      const updated = [...favorites, movie];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error adding to favorites:", error);
    return false;
  }
};


export const removeFromFavorites = (movieId) => {
  try {
    const favorites = getFavorites();
    const updated = favorites.filter((fav) => fav.id !== movieId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error("Error removing from favorites:", error);
    return false;
  }
};


export const isFavorite = (movieId) => {
  const favorites = getFavorites();
  return favorites.some((fav) => fav.id === movieId);
};


export const clearFavorites = () => {
  try {
    localStorage.removeItem(FAVORITES_KEY);
    return true;
  } catch (error) {
    console.error("Error clearing favorites:", error);
    return false;
  }
};

export default {
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  isFavorite,
  clearFavorites,
};
