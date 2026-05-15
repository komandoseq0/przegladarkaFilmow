"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MovieTypes, TMDBMovie, watchedMovie } from "../../types/movieData";
import "../../components/homeComponents/movieCards.css";
import "../userLists.css";

export default function ToWatchPage() {
  const [toWatchMoviesData, setToWatchMoviesData] = useState<number[]>([]);
  const [toWatchMovies, setToWatchMovies] = useState<MovieTypes[]>([]);

  const tmdbDataToMovieData = (tmdbData: TMDBMovie): MovieTypes => {
    return {
      id: tmdbData.id,
      title: tmdbData.title,
      releaseDate: tmdbData.release_date,
      poster: tmdbData.poster_path
        ? `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}`
        : null,
    };
  };

  async function deleteMovie(movieId: number) {
    setToWatchMoviesData((prevData: number[]) => 
      prevData.filter((id: number) => id !== movieId)
    );

    try {
      await fetch("/api/movies/toWatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId }),
      });
    } catch (error) {
      console.error("Błąd usuwania pliku z systemu:", error);
    }
  }

  async function addToWatched(movieId: number) {
    try {
      await fetch("/api/movies/watched", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId }),
      });

      deleteMovie(movieId);
      
    } catch (error) {
      console.error("Błąd przenoszenia pliku:", error);
    }
  }

  useEffect(() => {
    async function fetchInitialData() {
      try {
        const res = await fetch("/api/movies/toWatch");
        if (res.ok) {
          const data = await res.json();
          setToWatchMoviesData(data); 
        }
      } catch (error) {
        console.error("Błąd pobierania bazy:", error);
      }
    }

    fetchInitialData();
  }, []);

  useEffect(() => {
    async function fetchMovies() {
      try {
        const promises = toWatchMoviesData.map(async (movieId) => {
          const res = await fetch(
            `https://api.themoviedb.org/3/movie/${movieId}?api_key=33f4be8d4411e3aecbc041d9a4dc486d&language=pl-Pl&append_to_response=credits`,
          );
          if (!res.ok) throw new Error("Error fetching movie");
          const data = await res.json();
          return tmdbDataToMovieData(data);
        });

        const movies = await Promise.all(promises);

        setToWatchMovies(movies);
      } catch (err: unknown) {
        console.error(err);
      }
    }

    if (toWatchMoviesData.length > 0) {
      fetchMovies();
    } else {
      setToWatchMovies([]);
    }
  }, [toWatchMoviesData]);

  return (
    <div className="list-container">
      <section className="movie-section">
        <h2 className="section-title">SYS.DO_OBEJRZENIA</h2>

        {toWatchMovies.length > 0 ? (
          <div className="movie-grid">
            {toWatchMovies.map((movie) => (
              <Movie
                movie={movie}
                key={movie.id}
                handleDeleteMovie={deleteMovie}
                handleaddToWatched={addToWatched}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>BRAK_PLIKÓW_DO_OBEJRZENIA</p>
          </div>
        )}
      </section>
    </div>
  );
}

function Movie({
  movie,
  handleDeleteMovie,
  handleaddToWatched,
}: {
  movie: MovieTypes;
  handleDeleteMovie: (movieId: number) => void;
  handleaddToWatched: (movieId: number) => void;
}) {
  return (
    <div key={movie.id} className="industrial-card list-card">
      <Link href={`/movie/${movie.id}`} className="card-link">
        <div className="card-image-wrapper">
          {movie.poster ? (
            <img className="card-poster" src={movie.poster} alt={movie.title} />
          ) : (
            <div className="no-poster">BŁĄD WIZJI</div>
          )}
        </div>
        <div className="card-info">
          <h3 className="card-title">{movie.title}</h3>
        </div>
      </Link>
      <div className="list-actions">
        <button className="industrial-btn" onClick={() => handleaddToWatched(movie.id)}>OBEJRZANE</button>
        <button
          className="industrial-btn danger"
          onClick={() => handleDeleteMovie(movie.id)}
        >
          USUŃ
        </button>
      </div>
    </div>
  );
}
