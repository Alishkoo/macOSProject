import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config.js";


export const getUserFavoritesFromFirestore = async (userId) => {
  try {
    if (!userId) {
      console.warn("No userId provided to getUserFavoritesFromFirestore");
      return [];
    }

    const favoritesRef = collection(db, "users", userId, "favorites");
    const snapshot = await getDocs(favoritesRef);

    const favorites = [];
    snapshot.forEach((doc) => {
      favorites.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return favorites;
  } catch (error) {
    console.error("Error getting favorites from Firestore:", error);
    return [];
  }
};


export const addToFirestoreFavorites = async (userId, movie) => {
  try {
    if (!userId) {
      console.error("No userId provided to addToFirestoreFavorites");
      return false;
    }

    const favoriteRef = doc(db, "users", userId, "favorites", String(movie.id));
    await setDoc(favoriteRef, {
      ...movie,
      addedAt: serverTimestamp(),
    });

    return true;
  } catch (error) {
    console.error("Error adding to Firestore favorites:", error);
    return false;
  }
};


export const removeFromFirestoreFavorites = async (userId, movieId) => {
  try {
    if (!userId) {
      console.error("No userId provided to removeFromFirestoreFavorites");
      return false;
    }

    const favoriteRef = doc(db, "users", userId, "favorites", String(movieId));
    await deleteDoc(favoriteRef);

    return true;
  } catch (error) {
    console.error("Error removing from Firestore favorites:", error);
    return false;
  }
};


export const clearFirestoreFavorites = async (userId) => {
  try {
    if (!userId) {
      console.error("No userId provided to clearFirestoreFavorites");
      return false;
    }

    const favoritesRef = collection(db, "users", userId, "favorites");
    const snapshot = await getDocs(favoritesRef);

    const deletePromises = [];
    snapshot.forEach((doc) => {
      deletePromises.push(deleteDoc(doc.ref));
    });

    await Promise.all(deletePromises);
    return true;
  } catch (error) {
    console.error("Error clearing Firestore favorites:", error);
    return false;
  }
};


export const isInFirestoreFavorites = async (userId, movieId) => {
  try {
    if (!userId) return false;

    const favorites = await getUserFavoritesFromFirestore(userId);
    return favorites.some((fav) => String(fav.id) === String(movieId));
  } catch (error) {
    console.error("Error checking Firestore favorites:", error);
    return false;
  }
};


export const mergeLocalFavoritesToFirestore = async (userId, localFavorites) => {
  try {
    if (!userId) {
      return { success: false, merged: 0, errors: 0, message: "No user ID" };
    }

    if (!localFavorites || localFavorites.length === 0) {
      return { success: true, merged: 0, errors: 0, message: "No local favorites to merge" };
    }

    // Get existing Firestore favorites
    const existingFavorites = await getUserFavoritesFromFirestore(userId);
    const existingIds = new Set(existingFavorites.map((fav) => String(fav.id)));

    let merged = 0;
    let errors = 0;

    // Add only new favorites (avoid duplicates)
    for (const movie of localFavorites) {
      if (!existingIds.has(String(movie.id))) {
        const success = await addToFirestoreFavorites(userId, movie);
        if (success) {
          merged++;
        } else {
          errors++;
        }
      }
    }

    return {
      success: true,
      merged,
      errors,
      message: `Merged ${merged} favorites to your account`,
    };
  } catch (error) {
    console.error("Error merging favorites to Firestore:", error);
    return {
      success: false,
      merged: 0,
      errors: localFavorites?.length || 0,
      message: error.message,
    };
  }
};

export default {
  getUserFavoritesFromFirestore,
  addToFirestoreFavorites,
  removeFromFirestoreFavorites,
  clearFirestoreFavorites,
  isInFirestoreFavorites,
  mergeLocalFavoritesToFirestore,
};
