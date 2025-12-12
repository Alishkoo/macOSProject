import { useState, useEffect, useCallback, useMemo } from "react";
import { searchMovies, discoverMovies } from "../services/tmdb.service";

/**
 * Custom hook for fetching and managing movies with filters
 * 
 * Features:
 * - Handles both search and discover APIs
 * - Manages loading and error states
 * - Uses useCallback for fetch function to prevent unnecessary re-renders
 * - Uses useMemo to memoize movie results
 * - Provides pagination support
 * 
 * @param {Object} params - { search, genre, sortBy, year, page }
 * @returns {Object} - { movies, loading, error, totalPages, refetch }
 */
const useMovies = ({ search = "", genre = "", sortBy = "popularity.desc", year = "", page = 1 }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);

  // Memoize fetch function with useCallback
  const fetchMovies = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let data;
      
      if (search) {
        // Use search API when search term exists
        data = await searchMovies(search, page);
      } else {
        // Use discover API with filters
        data = await discoverMovies({
          page,
          sort_by: sortBy,
          with_genres: genre,
          primary_release_year: year,
        });
      }

      setMovies(data.results || []);
      setTotalPages(data.total_pages || 0);
    } catch (err) {
      setError(err.message || "Failed to fetch movies");
      setMovies([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [search, genre, sortBy, year, page]);

  // Auto-fetch when params change
  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  // Memoize movies array to prevent unnecessary re-renders
  const memoizedMovies = useMemo(() => movies, [movies]);

  return {
    movies: memoizedMovies,
    loading,
    error,
    totalPages,
    refetch: fetchMovies,
  };
};

export default useMovies;
