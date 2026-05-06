"use client";
import Link from "next/link";
import "./navbar.css";
import { useEffect, useState } from "react";
import { MovieTypes, TMDBMovie } from "../../types/movieData";

export default function Navbar() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<MovieTypes[]>([]);

  useEffect(function () {
    if (query.length < 3) return; 

    const timeoutId = setTimeout(() => {
      searchMovie(query);
    }, 500);

    return () => clearTimeout(timeoutId);

    async function searchMovie(searchQuery: string) {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=33f4be8d4411e3aecbc041d9a4dc486d&language=en-US&query=${searchQuery}`
        );

        if (!res.ok)
          throw new Error("Something went wrong with fetching searched movies");

        const data = await res.json();
        const topFiveResults: TMDBMovie[] = data.results.slice(0, 5);

        const CleanMovies: MovieTypes[] = topFiveResults.map(
          (movie: TMDBMovie) => {
            return {
              id: movie.id,
              title: movie.title,
              poster: movie.poster_path
                ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                : null,
              releaseDate: movie.release_date,
            };
          }
        );

        setSearchResults(CleanMovies);
      } catch (err: unknown) {
        console.error(err);
      }
    }
  }, [query]);

  return (
    <nav className="industrial-nav">
      <div className="search-container">
        <input 
          className="industrial-input"
          type="text" 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
          placeholder="> WYSZUKAJ_PLIKI_W_BAZIE..." 
        />
        
        {query.length >= 3 && searchResults.length > 0 ? (
          <SearchResults searchResults={searchResults} />
        ) : null}
      </div>
    </nav>
  );
}

function SearchResults({ searchResults }: { searchResults: MovieTypes[] }) {
  return (
    <div className="search-results-wrapper">
      {searchResults.map((movie: MovieTypes) => (
        <SearchResult key={movie.id} movie={movie} />
      ))}
    </div>
  );
}

function SearchResult({ movie }: { movie: MovieTypes }) {
  return (
    <Link href={`/movie/${movie.id}`}>
      <div className="search-result-item">
        <div className="search-result-info">
          <p className="search-result-title">{movie.title}</p>
        </div>
        {movie.poster ? (
          <img className="search-result-poster" src={movie.poster} alt={`Plakat ${movie.title}`} />
        ) : (
          <div className="poster-placeholder">
            BRAK<br/>DANYCH
          </div>
        )}
      </div>
    </Link>
  );
}