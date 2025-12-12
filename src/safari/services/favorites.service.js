import { auth } from "../../firebase/config.js";
import {
  getUserFavoritesFromFirestore,
  addToFirestoreFavorites,
  removeFromFirestoreFavorites,
  clearFirestoreFavorites,
} from "../../services/firestoreFavorites.service.js";

const FAVORITES_KEY = "tmdb_favorites";


const isGuestUser = () => {
  const user = auth.currentUser;
  return !user || user.isAnonymous;
};


const getUserId = () => {
  return auth.currentUser?.uid || null;
};

// ============ LOCALSTORAGE FUNCTIONS (for guests) ============

const getLocalFavorites = () => {
  try {
    const favorites = localStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error("Error getting local favorites:", error);
    return [];
  }
};

const setLocalFavorites = (favorites) => {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    return true;
  } catch (error) {
    console.error("Error setting local favorites:", error);
    return false;
  }
};


export const getFavorites = async () => {
  try {
    if (isGuestUser()) {
      // Guest: use localStorage
      return getLocalFavorites();
    } else {
      // Authenticated: use Firestore
      const userId = getUserId();
      return await getUserFavoritesFromFirestore(userId);
    }
  } catch (error) {
    console.error("Error getting favorites:", error);
    return [];
  }
};


export const addToFavorites = async (movie) => {
  try {
    if (isGuestUser()) {
      // Guest: use localStorage
      const favorites = getLocalFavorites();
      const exists = favorites.some((fav) => fav.id === movie.id);

      if (!exists) {
        const updated = [...favorites, movie];
        return setLocalFavorites(updated);
      }
      return false;
    } else {
      
      const userId = getUserId();
      return await addToFirestoreFavorites(userId, movie);
    }
  } catch (error) {
    console.error("Error adding to favorites:", error);
    return false;
  }
};


export const removeFromFavorites = async (movieId) => {
  try {
    if (isGuestUser()) {
      // Guest: use localStorage
      const favorites = getLocalFavorites();
      const updated = favorites.filter((fav) => fav.id !== movieId);
      return setLocalFavorites(updated);
    } else {
      // Authenticated: use Firestore
      const userId = getUserId();
      return await removeFromFirestoreFavorites(userId, movieId);
    }
  } catch (error) {
    console.error("Error removing from favorites:", error);
    return false;
  }
};


export const isFavorite = async (movieId) => {
  const favorites = await getFavorites();
  return favorites.some((fav) => fav.id === movieId);
};


export const clearFavorites = async () => {
  try {
    if (isGuestUser()) {
      // Guest: clear localStorage
      localStorage.removeItem(FAVORITES_KEY);
      return true;
    } else {
      // Authenticated: clear Firestore
      const userId = getUserId();
      return await clearFirestoreFavorites(userId);
    }
  } catch (error) {
    console.error("Error clearing favorites:", error);
    return false;
  }
};


export const getLocalStorageFavorites = () => {
  return getLocalFavorites();
};


export const clearLocalStorageFavorites = () => {
  try {
    localStorage.removeItem(FAVORITES_KEY);
    return true;
  } catch (error) {
    console.error("Error clearing local storage favorites:", error);
    return false;
  }
};

export default {
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  isFavorite,
  clearFavorites,
  getLocalStorageFavorites,
  clearLocalStorageFavorites,
};
