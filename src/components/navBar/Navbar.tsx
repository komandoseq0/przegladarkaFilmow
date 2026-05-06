"use client";

import Link from "next/link";
import "./navbar.css";
import { useEffect, useState } from "react";
import {MovieTypes, TMDBMovie} from "../../types/movieData";

export default function Navbar() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<MovieTypes[]>([]);

  function onType(s: string): void {
    setQuery(s);
  }

  useEffect(function () {
    if (!(query.length >= 3)) return; // Jeśli tekst ma mniej niż 3 znaki nie wywołuj api

    const timeoutId = setTimeout(() => {
      searchMovie(query);
    }, 500)

    return () => clearTimeout(timeoutId);

    async function searchMovie(query: string) {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=33f4be8d4411e3aecbc041d9a4dc486d&language=pl-PL&query=${query}`,
        );

        if (!res.ok)
          throw new Error(
            "Something went wrong with fetching Best rated movies",
          );

        const data = await res.json();

        const topTenResults: TMDBMovie[] = data.results.slice(0, 5);

        const CleanMovies: MovieTypes[] = topTenResults.map(
          (movie: TMDBMovie) => {
            return {
              id: movie.id,
              title: movie.title,
              poster: movie.poster_path
                ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                : null,
              releaseDate: movie.release_date,
            };
          },
        );

        setSearchResults(CleanMovies);

        console.log(CleanMovies);
      } catch (err: unknown) {
        console.error(err);
      }
    }
  }, [query]);

  return (
    <nav>
      <div className="search">
          <input type="text" onChange={(e) => onType(e.target.value)} />
      </div>
      {query.length >= 3 ? <SearchResults searchResults={searchResults}/> : ""}
    </nav>
  );
}

function SearchResults({searchResults}: {searchResults: MovieTypes[]}) {
  return <div>
    {searchResults.map((movie: MovieTypes) => <SearchResult movie={movie} key={movie.id}/>)}
  </div>;
}

function SearchResult({movie}: {movie: MovieTypes}) {
  return <div>
    <p>{movie.title}</p>
    <img src={movie.poster ? movie.poster : ""} alt="" />
  </div>
}