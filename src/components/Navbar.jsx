import { navLinks } from "#constants";
import { navIcons } from "#constants";
import useAuthStore from "../store/auth.js";
import useProfilePicture from "../hooks/useProfilePicture.js";
import { LogOut, User, Upload, Loader } from "lucide-react";
import { useRef } from "react";
import dayjs from "dayjs";

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const { photoURL, uploading, error, uploadProfilePicture } =
    useProfilePicture(user?.uid);
  const fileInputRef = useRef(null);

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
