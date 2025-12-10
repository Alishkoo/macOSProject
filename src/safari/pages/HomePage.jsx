import { useNavigate } from "react-router-dom";
import { Film, Star, Heart } from "lucide-react";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-full bg-linear-to-br from-blue-50 to-purple-50">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold font-georama text-gray-900 mb-4">
            Welcome to TMDB Movies
          </h1>
          <p className="text-xl text-gray-600 font-roboto">
            Discover millions of movies, explore details, and save your
            favorites
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Film className="text-blue-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2 font-georama">
              Explore Movies
            </h3>
            <p className="text-gray-600 font-roboto">
              Browse thousands of movies with detailed information, ratings, and
              reviews
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Star className="text-purple-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2 font-georama">
              Filter & Search
            </h3>
            <p className="text-gray-600 font-roboto">
              Find exactly what you're looking for with advanced filters and
              search
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-4">
              <Heart className="text-pink-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2 font-georama">
              Save Favorites
            </h3>
            <p className="text-gray-600 font-roboto">
              Create your personal collection of favorite movies to watch later
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button
            onClick={() => navigate("/movies")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-colors shadow-lg hover:shadow-xl"
          >
            Start Exploring Movies
          </button>
        </div>

        {/* About Section */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold mb-4 font-georama text-gray-900">
            About TMDB Movies
          </h2>
          <p className="text-gray-600 font-roboto leading-relaxed mb-4">
            This application is powered by The Movie Database (TMDB) API,
            providing you with access to a vast collection of movie information
            including plots, cast, crew, ratings, and more.
          </p>
          <p className="text-gray-600 font-roboto leading-relaxed">
            Whether you're looking for the latest blockbusters, classic films,
            or hidden gems, our powerful search and filtering system will help
            you discover your next favorite movie.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
