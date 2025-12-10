import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Star,
  Calendar,
  Clock,
  Heart,
  ArrowLeft,
  Users,
  Film,
} from "lucide-react";
import {
  getMovieDetails,
  getMovieCredits,
  getBackdropUrl,
  getPosterUrl,
} from "../services/tmdb.service";
import {
  isFavorite,
  addToFavorites,
  removeFromFavorites,
} from "../services/favorites.service";

const MovieDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    const fetchMovieData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [movieData, creditsData] = await Promise.all([
          getMovieDetails(id),
          getMovieCredits(id),
        ]);

        setMovie(movieData);
        setCredits(creditsData);
        setFavorite(isFavorite(movieData.id));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [id]);

  const handleFavoriteClick = () => {
    if (favorite) {
      removeFromFavorites(movie.id);
      setFavorite(false);
    } else {
      addToFavorites(movie);
      setFavorite(true);
    }
    window.dispatchEvent(new Event("favoritesChanged"));
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          Error: {error}
        </div>
      </div>
    );
  }

  if (!movie) return null;

  // Get top 10 cast members
  const cast = credits?.cast?.slice(0, 10) || [];

  // Format runtime
  const formatRuntime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="min-h-full bg-gray-50">
      {/* Backdrop */}
      <div className="relative h-[400px] bg-gray-900">
        <img
          src={getBackdropUrl(movie.backdrop_path)}
          alt={movie.title}
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-linear-to-t from-gray-50 to-transparent"></div>

        {/* Back Button */}
        <button
          onClick={handleBack}
          className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 text-white px-4 py-2 rounded-lg hover:bg-black/70 transition-colors"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-4 right-4 p-3 rounded-full transition-colors ${
            favorite
              ? "bg-pink-500 text-white"
              : "bg-black/50 text-white hover:bg-pink-500"
          }`}
        >
          <Heart size={20} fill={favorite ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Poster */}
          <div className="shrink-0">
            <img
              src={getPosterUrl(movie.poster_path)}
              alt={movie.title}
              className="w-64 rounded-lg shadow-2xl"
            />
          </div>

          {/* Info */}
          <div className="flex-1">
            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 mb-2 font-georama">
              {movie.title}
            </h1>

            {/* Tagline */}
            {movie.tagline && (
              <p className="text-gray-500 italic mb-4 font-roboto">
                "{movie.tagline}"
              </p>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 mb-6">
              {/* Rating */}
              <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-lg">
                <Star size={16} fill="gold" className="text-yellow-500" />
                <span className="font-semibold text-gray-900">
                  {movie.vote_average.toFixed(1)}
                </span>
                <span className="text-sm text-gray-600">
                  ({movie.vote_count} votes)
                </span>
              </div>

              {/* Release Date */}
              <div className="flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-lg">
                <Calendar size={16} className="text-blue-600" />
                <span className="text-gray-900">
                  {new Date(movie.release_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>

              {/* Runtime */}
              {movie.runtime > 0 && (
                <div className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded-lg">
                  <Clock size={16} className="text-green-600" />
                  <span className="text-gray-900">
                    {formatRuntime(movie.runtime)}
                  </span>
                </div>
              )}
            </div>

            {/* Genres */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm font-medium"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Overview */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold mb-3 font-georama flex items-center gap-2">
                <Film size={24} className="text-blue-600" />
                Overview
              </h2>
              <p className="text-gray-700 leading-relaxed font-roboto">
                {movie.overview || "No overview available."}
              </p>
            </div>

            {/* Additional Info */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500">Status</span>
                  <p className="font-semibold text-gray-900">{movie.status}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">
                    Original Language
                  </span>
                  <p className="font-semibold text-gray-900 uppercase">
                    {movie.original_language}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Budget</span>
                  <p className="font-semibold text-gray-900">
                    {movie.budget > 0
                      ? `$${movie.budget.toLocaleString()}`
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Revenue</span>
                  <p className="font-semibold text-gray-900">
                    {movie.revenue > 0
                      ? `$${movie.revenue.toLocaleString()}`
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Cast */}
            {cast.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4 font-georama flex items-center gap-2">
                  <Users size={24} className="text-blue-600" />
                  Top Cast
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {cast.map((actor) => (
                    <div key={actor.id} className="text-center">
                      <img
                        src={getPosterUrl(actor.profile_path, "w185")}
                        alt={actor.name}
                        className="w-full aspect-square object-cover rounded-lg mb-2"
                      />
                      <p className="font-semibold text-sm text-gray-900 line-clamp-1">
                        {actor.name}
                      </p>
                      <p className="text-xs text-gray-500 line-clamp-1">
                        {actor.character}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom padding */}
      <div className="h-12"></div>
    </div>
  );
};

export default MovieDetailsPage;
