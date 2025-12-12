import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import useFavorites from "../hooks/useFavorites";
import MovieCard from "../components/MovieCard";

const FavoritesPage = () => {
  const { t } = useTranslation();
  // Use custom hook for favorites
  const { favorites, refreshFavorites } = useFavorites();

  // useCallback for card callback
  const handleFavoriteChange = useCallback(() => {
    refreshFavorites();
  }, [refreshFavorites]);

  // useMemo for favorites count message
  const message = useMemo(() => {
    if (favorites.length === 0) {
      return t("safari.favoritesPage.noFavorites");
    }
    return favorites.length === 1
      ? t("safari.favoritesPage.count", { count: favorites.length })
      : t("safari.favoritesPage.countPlural", { count: favorites.length });
  }, [favorites.length, t]);

  return (
    <div className="min-h-full bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 font-georama mb-2">
            {t("safari.favoritesPage.title")}
          </h1>
          <p className="text-gray-600 font-roboto">{message}</p>
        </div>

        {/* Movies Grid */}
        {favorites.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {favorites.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onFavoriteChange={handleFavoriteChange}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg font-roboto">
              {t("safari.favoritesPage.emptyState")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
