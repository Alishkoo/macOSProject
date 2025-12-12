import { navLinks } from "#constants";
import { navIcons } from "#constants";
import useAuthStore from "../store/auth.js";
import useProfilePicture from "../hooks/useProfilePicture.js";
import {
  LogOut,
  User,
  Upload,
  Loader,
  Database,
  Languages,
} from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import {
  getLocalStorageFavorites,
  clearLocalStorageFavorites,
} from "../safari/services/favorites.service.js";
import { mergeLocalFavoritesToFirestore } from "../services/firestoreFavorites.service.js";

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const { t, i18n } = useTranslation();
  const { photoURL, uploading, error, uploadProfilePicture } =
    useProfilePicture(user?.uid);
  const fileInputRef = useRef(null);
  const [hasLocalFavorites, setHasLocalFavorites] = useState(false);
  const [merging, setMerging] = useState(false);
  const [mergeMessage, setMergeMessage] = useState("");

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
        clearLocalStorageFavorites();
        setHasLocalFavorites(false);
        setMergeMessage(
          result.merged > 0
            ? `✓ ${result.merged} favorites merged!`
            : "No new favorites to merge"
        );

        window.dispatchEvent(new Event("favoritesChanged"));

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

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const currentLanguage = i18n.language;

  return (
    <nav>
      <div>
        <img src="/images/logo.svg" alt="logo" />
        <p className="font-bold">{t("nav.projectTitle")}</p>

        <ul>
          {navLinks.map(({ id, translationKey, name }) => (
            <li key={id}>
              <p>{translationKey ? t(translationKey) : name}</p>
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
                  <p className="text-xs text-gray-500">
                    {t("auth.signedInAs")}
                  </p>
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
                      {t("profile.uploading")}
                    </>
                  ) : (
                    <>
                      <Upload size={14} />
                      {t("profile.uploadPhoto")}
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

                {hasLocalFavorites && (
                  <button
                    onClick={handleMergeFavorites}
                    disabled={merging}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded transition-colors mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {merging ? (
                      <>
                        <Loader size={14} className="animate-spin" />
                        {t("profile.merging")}
                      </>
                    ) : (
                      <>
                        <Database size={14} />
                        {t("profile.mergeFavorites")}
                      </>
                    )}
                  </button>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition-colors mt-1"
                >
                  <LogOut size={14} />
                  {t("auth.signOut")}
                </button>
              </div>

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

        <div className="flex items-center gap-2 mr-4">
          <Languages size={16} className="text-white/70" />
          <div className="flex gap-1">
            <button
              onClick={() => changeLanguage("en")}
              className={`px-2 py-1 text-xs font-semibold rounded transition-colors ${
                currentLanguage === "en"
                  ? "bg-white/20 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => changeLanguage("ru")}
              className={`px-2 py-1 text-xs font-semibold rounded transition-colors ${
                currentLanguage === "ru"
                  ? "bg-white/20 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              RU
            </button>
          </div>
        </div>

        <time> {dayjs().format("MMMM D, YYYY")}</time>
      </div>
    </nav>
  );
};

export default Navbar;
