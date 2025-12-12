import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, Filter, Loader } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getGenres } from "../services/tmdb.service";
import useDebounce from "../hooks/useDebounce";
import useMovies from "../hooks/useMovies";
import MovieCard from "../components/MovieCard";

const MoviesListPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();

  const [genres, setGenres] = useState([]);

  // Get URL params
  const searchQuery = searchParams.get("search") || "";
  const genreFilter = searchParams.get("genre") || "";
  const sortBy = searchParams.get("sort") || "popularity.desc";
  const yearFilter = searchParams.get("year") || "";
  const page = parseInt(searchParams.get("page") || "1");

  // Local state for inputs
  const [searchInput, setSearchInput] = useState(searchQuery);
  const debouncedSearch = useDebounce(searchInput, 500);

  // Use custom hook for movies fetching
  const { movies, loading, error, totalPages } = useMovies({
    search: debouncedSearch,
    genre: genreFilter,
    sortBy,
    year: yearFilter,
    page,
  });

  // Load genres on mount
  useEffect(() => {
    const loadGenres = async () => {
      try {
        const data = await getGenres();
        setGenres(data.genres || []);
      } catch (err) {
        console.error("Failed to load genres:", err);
      }
    };
    loadGenres();
  }, []);

  // useCallback for event handlers to prevent re-renders
  const handleSearchChange = useCallback((e) => {
    setSearchInput(e.target.value);
  }, []);

  const handleFilterChange = useCallback(
    (key, value) => {
      const newParams = new URLSearchParams(searchParams);

      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }

      newParams.set("page", "1");
      setSearchParams(newParams);
    },
    [searchParams, setSearchParams]
  );

  const handlePageChange = useCallback(
    (newPage) => {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("page", newPage.toString());
      setSearchParams(newParams);
    },
    [searchParams, setSearchParams]
  );

  // Sync debounced search with URL
  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);

    if (debouncedSearch) {
      newParams.set("search", debouncedSearch);
    } else {
      newParams.delete("search");
    }

    // Reset to page 1 when search changes
    if (debouncedSearch !== searchQuery) {
      newParams.set("page", "1");
    }

    setSearchParams(newParams, { replace: true });
  }, [debouncedSearch, searchQuery, searchParams, setSearchParams]);

  // useMemo for years array - prevent recalculation on every render
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 20 }, (_, i) => currentYear - i);
  }, []);

  // useMemo for limited movies - prevent slice on every render
  const displayedMovies = useMemo(() => {
    const limit = 10;
    return movies.slice(0, limit);
  }, [movies]);

  return (
    <div className="min-h-full bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 font-georama mb-2">
            Discover Movies
          </h1>
          <p className="text-gray-600 font-roboto">
            Search and filter through thousands of movies
          </p>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                value={searchInput}
                onChange={handleSearchChange}
                placeholder={t("safari.movies.search")}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Genre Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("safari.movies.filters.genre")}
              </label>
              <select
                value={genreFilter}
                onChange={(e) => handleFilterChange("genre", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{t("safari.movies.filters.allGenres")}</option>
                {genres.map((genre) => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("safari.movies.filters.sortBy")}
              </label>
              <select
                value={sortBy}
                onChange={(e) => handleFilterChange("sort", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="popularity.desc">
                  {t("safari.movies.sortOptions.popularity")}
                </option>
                <option value="vote_average.desc">
                  {t("safari.movies.sortOptions.rating")}
                </option>
                <option value="release_date.desc">
                  {t("safari.movies.sortOptions.newestFirst")}
                </option>
                <option value="release_date.asc">
                  {t("safari.movies.sortOptions.oldestFirst")}
                </option>
              </select>
            </div>

            {/* Year Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("safari.movies.filters.releaseYear")}
              </label>
              <select
                value={yearFilter}
                onChange={(e) => handleFilterChange("year", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{t("safari.movies.filters.allYears")}</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader className="animate-spin text-blue-600" size={40} />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {t("safari.movies.error", { message: error })}
          </div>
        )}

        {/* Movies Grid */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
              {displayedMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t("safari.movies.pagination.previous")}
                </button>

                <span className="px-4 py-2 text-gray-700 font-roboto">
                  {t("safari.movies.pagination.pageOf", {
                    current: page,
                    total: totalPages,
                  })}
                </span>

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t("safari.movies.pagination.next")}
                </button>
              </div>
            )}

            {/* Results Info */}
            <div className="text-center text-gray-600 font-roboto mt-4">
              {t("safari.movies.pagination.showing", {
                count: displayedMovies.length,
                total: movies.length,
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MoviesListPage;
