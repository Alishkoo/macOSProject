import {
  MemoryRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
  Link,
} from "react-router-dom";
import { Home, ChevronLeft, ChevronRight, Lock } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

// Pages
import HomePage from "../pages/HomePage";
import MoviesListPage from "../pages/MoviesListPage";
import MovieDetailsPage from "../pages/MovieDetailsPage";
import FavoritesPage from "../pages/FavoritesPage";

const BrowserChrome = () => {
  const location = useLocation();
  const [url, setUrl] = useState("");
  const { t } = useTranslation();

  // Update fake URL based on current route
  const getFakeUrl = () => {
    const path = location.pathname;
    const search = location.search;
    return `https://tmdb-movies.com${path}${search}`;
  };

  return (
    <div className="bg-gray-100 border-b border-gray-300">
      {/* Browser Controls */}
      <div className="flex items-center gap-2 px-3 py-2">
        <button className="p-1 hover:bg-gray-200 rounded transition-colors">
          <ChevronLeft size={18} className="text-gray-600" />
        </button>
        <button className="p-1 hover:bg-gray-200 rounded transition-colors">
          <ChevronRight size={18} className="text-gray-600" />
        </button>
        <button className="p-1 hover:bg-gray-200 rounded transition-colors">
          <Home size={18} className="text-gray-600" />
        </button>

        {/* Address Bar */}
        <div className="flex-1 flex items-center gap-2 bg-white rounded-lg px-3 py-1.5 border border-gray-300">
          <Lock size={14} className="text-green-600" />
          <input
            type="text"
            value={getFakeUrl()}
            readOnly
            className="flex-1 text-sm text-gray-700 bg-transparent outline-none"
          />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-1 px-3 pb-2">
        <NavLink to="/">{t("safari.tabs.home")}</NavLink>
        <NavLink to="/movies">{t("safari.tabs.movies")}</NavLink>
        <NavLink to="/favorites">{t("safari.tabs.favorites")}</NavLink>
      </div>
    </div>
  );
};

const NavLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`px-4 py-1.5 text-sm rounded-t-lg transition-colors ${
        isActive
          ? "bg-white text-blue-600 font-semibold"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
      }`}
    >
      {children}
    </Link>
  );
};

const SafariBrowser = () => {
  return (
    <MemoryRouter>
      <div className="flex flex-col h-full">
        <BrowserChrome />

        <div className="flex-1 overflow-auto bg-white">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/movies" element={<MoviesListPage />} />
            <Route path="/movie/:id" element={<MovieDetailsPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
          </Routes>
        </div>
      </div>
    </MemoryRouter>
  );
};

export default SafariBrowser;
