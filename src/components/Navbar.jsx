import { navLinks } from "#constants";
import { navIcons } from "#constants";
import useAuthStore from "../store/auth.js";
import useProfilePicture from "../hooks/useProfilePicture.js";
import { LogOut, User, Upload, Loader, Database } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import dayjs from "dayjs";
import {
  getLocalStorageFavorites,
  clearLocalStorageFavorites,
} from "../safari/services/favorites.service.js";
import { mergeLocalFavoritesToFirestore } from "../services/firestoreFavorites.service.js";

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const { photoURL, uploading, error, uploadProfilePicture } =
    useProfilePicture(user?.uid);
  const fileInputRef = useRef(null);
  const [hasLocalFavorites, setHasLocalFavorites] = useState(false);
  const [merging, setMerging] = useState(false);
  const [mergeMessage, setMergeMessage] = useState("");

  // Check if there are local favorites to merge
  useEffect(() => {
    if (user && !user.isAnonymous) {
      const localFavs = getLocalStorageFavorites();
      setHasLocalFavorites(localFavs.length > 0);
    } else {
      setHasLocalFavorites(false);
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadProfilePicture(file);
      // Reset input
      e.target.value = "";
    }
  };

  const handleMergeFavorites = async () => {
    if (!user || user.isAnonymous) return;

    setMerging(true);
    setMergeMessage("");

    try {
      const localFavorites = getLocalStorageFavorites();
      const result = await mergeLocalFavoritesToFirestore(
        user.uid,
        localFavorites
      );

      if (result.success) {
        // Clear localStorage after successful merge
        clearLocalStorageFavorites();
        setHasLocalFavorites(false);
        setMergeMessage(
          result.merged > 0
            ? `✓ ${result.merged} favorites merged!`
            : "No new favorites to merge"
        );

        // Dispatch event to refresh favorites list
        window.dispatchEvent(new Event("favoritesChanged"));

        // Clear message after 3 seconds
        setTimeout(() => setMergeMessage(""), 3000);
      } else {
        setMergeMessage("✗ Merge failed. Please try again.");
        setTimeout(() => setMergeMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error merging favorites:", error);
      setMergeMessage("✗ Error merging favorites");
      setTimeout(() => setMergeMessage(""), 3000);
    } finally {
      setMerging(false);
    }
  };

  return (
    <nav>
      <div>
        <img src="/images/logo.svg" alt="logo" />
        <p className="font-bold">Alibek's Project</p>

        <ul>
          {navLinks.map(({ id, name }) => (
            <li key={id}>
              <p>{name}</p>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <ul>
          {navIcons.map(({ id, img }) => (
            <li key={id}>
              <img src={img} className="icon-hover" alt={`icon-${id}`} />
            </li>
          ))}

          {/* User Icon / Logout */}
          {user && (
            <li className="relative group">
              {/* Profile Picture or Default Icon */}
              <div className="icon-hover flex items-center gap-2 cursor-pointer">
                {photoURL ? (
                  <img
                    src={photoURL}
                    alt="Profile"
                    className="w-6 h-6 rounded-full object-cover border-2 border-white/50"
                  />
                ) : (
                  <User size={16} />
                )}
              </div>

              {/* Dropdown on hover */}
              <div className="absolute right-0 top-full mt-2 bg-white/90 backdrop-blur-md rounded-lg shadow-lg p-2 min-w-[200px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {/* User Info */}
                <div className="px-3 py-2 border-b border-gray-200">
                  <p className="text-xs text-gray-500">Signed in as</p>
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {user.email}
                  </p>
                </div>

                {/* Upload Photo Button */}
                <button
                  onClick={handleUploadClick}
                  disabled={uploading}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <>
                      <Loader size={14} className="animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload size={14} />
                      Upload Photo
                    </>
                  )}
                </button>

                {/* Error Message */}
                {error && (
                  <div className="px-3 py-2 text-xs text-red-600 bg-red-50 rounded mt-1">
                    {error}
                  </div>
                )}

                {/* Merge Message */}
                {mergeMessage && (
                  <div
                    className={`px-3 py-2 text-xs rounded mt-1 ${
                      mergeMessage.includes("✓")
                        ? "text-green-600 bg-green-50"
                        : "text-red-600 bg-red-50"
                    }`}
                  >
                    {mergeMessage}
                  </div>
                )}

                {/* Merge Favorites Button (only if local favorites exist) */}
                {hasLocalFavorites && (
                  <button
                    onClick={handleMergeFavorites}
                    disabled={merging}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded transition-colors mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {merging ? (
                      <>
                        <Loader size={14} className="animate-spin" />
                        Merging...
                      </>
                    ) : (
                      <>
                        <Database size={14} />
                        Merge Favourites
                      </>
                    )}
                  </button>
                )}

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition-colors mt-1"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleFileChange}
                className="hidden"
              />
            </li>
          )}
        </ul>

        <time> {dayjs().format("MMMM D, YYYY")}</time>
      </div>
    </nav>
  );
};

export default Navbar;
