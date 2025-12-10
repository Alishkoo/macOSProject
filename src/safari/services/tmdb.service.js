const TMDB_API_KEY = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2YzI0NWZmNGFhZDA2NzU5N2Y0MWY1YjYzYjJjY2I3ZSIsIm5iZiI6MTc2NTM4NzgzNy4zMjUsInN1YiI6IjY5MzlhZTNkZGJlNzBlZDM1ZTFkMjU5MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.4iJiHhazyiMecHBRx_4U8MytF5cC27DJWH3g9oaCxZM";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

const tmdbFetch = async (endpoint, params = {}) => {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  
  Object.keys(params).forEach((key) => {
    if (params[key]) {
      url.searchParams.append(key, params[key]);
    }
  });

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${TMDB_API_KEY}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`TMDB API Error: ${response.statusText}`);
  }

  return response.json();
};

// Get popular movies
export const getPopularMovies = async (page = 1) => {
  return tmdbFetch("/movie/popular", { page });
};

// Search movies
export const searchMovies = async (query, page = 1) => {
  return tmdbFetch("/search/movie", { query, page });
};

// Discover movies with filters
export const discoverMovies = async ({ 
  page = 1, 
  sort_by = "popularity.desc",
  with_genres = "",
  primary_release_year = ""
}) => {
  const params = {
    page,
    sort_by,
  };
  
  if (with_genres) params.with_genres = with_genres;
  if (primary_release_year) params.primary_release_year = primary_release_year;
  
  return tmdbFetch("/discover/movie", params);
};

// Get movie details
export const getMovieDetails = async (movieId) => {
  return tmdbFetch(`/movie/${movieId}`);
};

// Get movie credits (cast)
export const getMovieCredits = async (movieId) => {
  return tmdbFetch(`/movie/${movieId}/credits`);
};

// Get genres list
export const getGenres = async () => {
  return tmdbFetch("/genre/movie/list");
};

// Helper: Get poster URL
export const getPosterUrl = (path, size = "w500") => {
  if (!path) return "/images/no-poster.png";
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

// Helper: Get backdrop URL
export const getBackdropUrl = (path, size = "w1280") => {
  if (!path) return "/images/no-backdrop.png";
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

export default {
  getPopularMovies,
  searchMovies,
  discoverMovies,
  getMovieDetails,
  getMovieCredits,
  getGenres,
  getPosterUrl,
  getBackdropUrl,
};
