import { useState, useEffect, useCallback } from "react";
import {
  uploadProfilePictureComplete,
  getProfilePicture,
} from "../services/profileService";

/**
 * Custom hook for managing profile picture upload
 * 
 * Features:
 * - Handles file upload with validation
 * - Uses Web Worker for image compression
 * - Stores as base64 in localStorage
 * - Manages loading and error states
 * 
 * @param {string} userId - User ID
 * @returns {Object} - { photoURL, uploading, error, uploadProfilePicture, refreshProfile }
 */
const useProfilePicture = (userId) => {
  const [photoURL, setPhotoURL] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  // Load profile picture on mount
  const refreshProfile = useCallback(() => {
    if (!userId) return;

    try {
      const base64Image = getProfilePicture(userId);
      if (base64Image) {
        setPhotoURL(base64Image);
      }
    } catch (err) {
      console.error("Error loading profile:", err);
    }
  }, [userId]);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  // Upload profile picture
  const uploadProfilePicture = useCallback(
    async (file) => {
      if (!file) {
        setError("No file selected");
        return { success: false, error: "No file selected" };
      }

      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!validTypes.includes(file.type)) {
        setError("Only JPG and PNG files are allowed");
        return { success: false, error: "Invalid file type" };
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setError("File size must be less than 5MB");
        return { success: false, error: "File too large" };
      }

      setUploading(true);
      setError(null);

      try {
        const base64Image = await uploadProfilePictureComplete(userId, file);
        setPhotoURL(base64Image);
        setUploading(false);
        return { success: true, photoURL: base64Image };
      } catch (err) {
        setError(err.message);
        setUploading(false);
        return { success: false, error: err.message };
      }
    },
    [userId]
  );

  return {
    photoURL,
    uploading,
    error,
    uploadProfilePicture,
    refreshProfile,
  };
};

export default useProfilePicture;
