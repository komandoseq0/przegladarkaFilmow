"use client";
import Link from "next/link";
import "./navbar.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MovieTypes, TMDBMovie } from "../../types/movieData";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<MovieTypes[]>([]);
  const randomInt = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const userNick = session?.user?.email ? session.user.email.split('@')[0].toUpperCase() : "GOŚĆ";

  function resetAfterClick(): void {
    setQuery("");
    setSearchResults([]);
  }

  useEffect(
    function () {
      if (query.length < 3) return;

      const timeoutId = setTimeout(() => {
        searchMovie(query);
      }, 500);

      return () => clearTimeout(timeoutId);

      async function searchMovie(searchQuery: string) {
        try {
          const res = await fetch(
            `https://api.themoviedb.org/3/search/movie?api_key=33f4be8d4411e3aecbc041d9a4dc486d&language=en-US&query=${searchQuery}`,
          );

          if (!res.ok)
            throw new Error(
              "Something went wrong with fetching searched movies",
            );

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
            },
          );

          setSearchResults(CleanMovies);
        } catch (err: unknown) {
          console.error(err);
        }
      }
    },
    [query],
  );

  async function randomMovieHandler() {
    const res = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=33f4be8d4411e3aecbc041d9a4dc486d&language=pl-PL&page=${randomInt(1, 500)}&include_adult=false`,
    );

    if (!res.ok)
      throw new Error("Something went wrong with fetching searched movies");

    const data = await res.json();

    const movie: MovieTypes = data.results[randomInt(1, 19)];

    router.push(`/movie/${movie.id}`);
  }

  return (
    <nav className="industrial-nav">
      <div className="nav-wrapper">
        <div className="nav-left">
          <Link href="/" className="nav-logo" onClick={resetAfterClick}>
            <span className="logo-text">SYS.FILMY</span>
          </Link>

          <div className="nav-links">
            <Link href="/toWatchMovies" className="nav-link">
              <span className="link-icon"></span> DO_OBEJRZENIA
            </Link>
            <Link href="/watchedMovies" className="nav-link">
              <span className="link-icon"></span> OBEJRZANE
            </Link>
          </div>
        </div>

        <div className="search-container">
          <div className="search-input-group">
            <input
              className="industrial-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="> WYSZUKAJ_PLIKI..."
            />
            <button
              className="random-btn"
              onClick={() => {
                randomMovieHandler();
              }}
            >
              ZASKOCZ MNIE
            </button>
          </div>

          {query.length >= 3 && searchResults.length > 0 ? (
            <SearchResults
              searchResults={searchResults}
              resetAfterClick={resetAfterClick}
            />
          ) : null}
        </div>

        <div className="auth-container">
          {session ? (
            <div className="user-profile">
              <div className="user-info">
                <span className="user-status-indicator"></span>
              </div>
              <button className="logout-btn login-btn" onClick={() => signOut()}>
                [ WYLOGUJ ]
              </button>
            </div>
          ) : (
            <Link href="/login" className="login-btn" onClick={resetAfterClick}>
              [ ZALOGUJ ]
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

function SearchResults({
  searchResults,
  resetAfterClick,
}: {
  searchResults: MovieTypes[];
  resetAfterClick: () => void;
}) {
  return (
    <div className="search-results-wrapper">
      {searchResults.map((movie: MovieTypes) => (
        <SearchResult
          key={movie.id}
          movie={movie}
          resetAfterClick={resetAfterClick}
        />
      ))}
    </div>
  );
}

function SearchResult({
  movie,
  resetAfterClick,
}: {
  movie: MovieTypes;
  resetAfterClick: () => void;
}) {
  return (
    <Link
      href={`/movie/${movie.id}`}
      onClick={resetAfterClick}
      className="search-result-item"
    >
      {movie.poster ? (
        <img
          className="search-result-poster"
          src={movie.poster}
          alt={`Plakat ${movie.title}`}
        />
      ) : (
        <div className="poster-placeholder">BRAK_DANYCH</div>
      )}
      <div className="search-result-info">
        <p className="search-result-title">{movie.title}</p>
        <span className="search-result-date">
          {movie.releaseDate
            ? movie.releaseDate.split("-")[0]
            : "DATA_NIEZNANA"}
        </span>
      </div>
    </Link>
  );
}
