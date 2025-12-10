/**
 * Profile Service (LocalStorage version)
 * Handles profile picture upload with Web Worker compression
 * Stores images as base64 in localStorage
 */

/**
 * Compress image using Web Worker
 * @param {File} file - Image file to compress
 * @param {Object} options - Compression options
 * @returns {Promise<Blob>} Compressed image blob
 */
export const compressImage = (file, options = {}) => {
  return new Promise((resolve, reject) => {
    const worker = new Worker("/workers/imageCompressor.worker.js");

    const config = {
      maxWidth: options.maxWidth || 800,
      maxHeight: options.maxHeight || 800,
      quality: options.quality || 0.8,
    };

    worker.postMessage({ file, ...config });

    worker.onmessage = (e) => {
      const { success, blob, error, originalSize, compressedSize } = e.data;

      if (success) {
        console.log(
          `Image compressed: ${(originalSize / 1024).toFixed(2)}KB → ${(
            compressedSize / 1024
          ).toFixed(2)}KB`
        );
        resolve(blob);
      } else {
        reject(new Error(error));
      }

      worker.terminate();
    };

    worker.onerror = (error) => {
      reject(error);
      worker.terminate();
    };
  });
};

/**
 * Convert Blob to base64
 * @param {Blob} blob - Image blob
 * @returns {Promise<string>} Base64 string
 */
const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * Save profile picture to localStorage
 * @param {string} userId - User ID
 * @param {string} base64Image - Base64 image string
 */
export const saveProfilePicture = (userId, base64Image) => {
  try {
    const key = `profile_picture_${userId}`;
    localStorage.setItem(key, base64Image);
    
    // Also save metadata
    const metadata = {
      userId,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(`${key}_meta`, JSON.stringify(metadata));
    
    return true;
  } catch (error) {
    console.error("Error saving profile picture:", error);
    // Check if quota exceeded
    if (error.name === "QuotaExceededError") {
      throw new Error("Storage quota exceeded. Please try a smaller image.");
    }
    throw new Error("Failed to save profile picture");
  }
};

/**
 * Get profile picture from localStorage
 * @param {string} userId - User ID
 * @returns {string|null} Base64 image string or null
 */
export const getProfilePicture = (userId) => {
  try {
    const key = `profile_picture_${userId}`;
    return localStorage.getItem(key);
  } catch (error) {
    console.error("Error getting profile picture:", error);
    return null;
  }
};

/**
 * Delete profile picture from localStorage
 * @param {string} userId - User ID
 */
export const deleteProfilePicture = (userId) => {
  try {
    const key = `profile_picture_${userId}`;
    localStorage.removeItem(key);
    localStorage.removeItem(`${key}_meta`);
    return true;
  } catch (error) {
    console.error("Error deleting profile picture:", error);
    return false;
  }
};

/**
 * Complete profile picture upload process
 * @param {string} userId - User ID
 * @param {File} file - Image file
 * @returns {Promise<string>} Base64 image string
 */
export const uploadProfilePictureComplete = async (userId, file) => {
  try {
    // 1. Compress image in Web Worker
    const compressedBlob = await compressImage(file);

    // 2. Convert to base64
    const base64Image = await blobToBase64(compressedBlob);

    // 3. Save to localStorage
    saveProfilePicture(userId, base64Image);

    return base64Image;
  } catch (error) {
    console.error("Error in complete upload process:", error);
    throw error;
  }
};
