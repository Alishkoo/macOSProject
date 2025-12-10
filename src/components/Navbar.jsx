import { navLinks } from "#constants";
import { navIcons } from "#constants";
import useAuthStore from "../store/auth.js";
import { LogOut, User } from "lucide-react";
import dayjs from "dayjs";

const Navbar = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
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
              <div className="icon-hover flex items-center gap-2 cursor-pointer">
                <User size={16} />
              </div>

              {/* Dropdown on hover */}
              <div className="absolute right-0 top-full mt-2 bg-white/90 backdrop-blur-md rounded-lg shadow-lg p-2 min-w-[150px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="px-3 py-2 border-b border-gray-200">
                  <p className="text-xs text-gray-500">Signed in as</p>
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {user.email}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
            </li>
          )}
        </ul>

        <time> {dayjs().format("MMMM D, YYYY")}</time>
      </div>
    </nav>
  );
};

export default Navbar;
