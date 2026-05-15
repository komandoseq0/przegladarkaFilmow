"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  MovieTypesWatched,
  TMDBMovie,
  watchedMovie,
} from "../../types/movieData";
import "../../components/homeComponents/movieCards.css";
import "../userLists.css";

export default function WatchedPage() {
  const [watchedMoviesData, setWatchedMoviesData] = useState<watchedMovie[]>(
    [],
  );
  const [watchedMovies, setWatchedMovies] = useState<MovieTypesWatched[]>([]);

  const tmdbDataToMovieData = (
    tmdbData: TMDBMovie,
    rating: number,
  ): MovieTypesWatched => {
    return {
      id: tmdbData.id,
      title: tmdbData.title,
      releaseDate: tmdbData.release_date,
      poster: tmdbData.poster_path
        ? `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}`
        : null,
      rating: rating,
    };
  };

  async function deleteMovie(movieId: number) {
    setWatchedMoviesData((prevWatched: watchedMovie[]) =>
      prevWatched.filter((movieData) => movieData.id !== movieId),
    );

    try {
      await fetch("/api/movies/watched", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId }),
      });
    } catch (error) {
      console.error("Błąd podczas usuwania filmu:", error);
    }
  }

  async function rateMovie(movieId: number, newRating: number) {
    setWatchedMoviesData((prevWatched: watchedMovie[]) =>
      prevWatched.map((movieData) => {
        if (movieData.id === movieId) {
          return { ...movieData, rating: newRating };
        }
        return movieData;
      }),
    );

    try {
      await fetch("/api/movies/watched", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId, rating: newRating }),
      });
    } catch (error) {
      console.error("Błąd podczas aktualizacji oceny:", error);
    }
  }

  useEffect(() => {
    async function fetchInitialData() {
      try {
        const res = await fetch("/api/movies/watched");
        if (res.ok) {
          const data = await res.json();
          setWatchedMoviesData(data);
        }
      } catch (error) {
        console.error("Błąd pobierania obejrzanych filmów:", error);
      }
    }

    fetchInitialData();
  }, []);

  useEffect(() => {
    async function fetchMovies() {
      try {
        const promises = watchedMoviesData.map(async (movie) => {
          const res = await fetch(
            `https://api.themoviedb.org/3/movie/${movie.id}?api_key=33f4be8d4411e3aecbc041d9a4dc486d&language=pl-Pl&append_to_response=credits`,
          );
          if (!res.ok) throw new Error("Error fetching movie");
          const data = await res.json();
          return tmdbDataToMovieData(data, movie.rating);
        });

        const movies = await Promise.all(promises);

        setWatchedMovies(movies);
      } catch (err: unknown) {
        console.error(err);
      }
    }

    if (watchedMoviesData.length > 0) {
      fetchMovies();
    } else {
      setWatchedMovies([]);
    }
  }, [watchedMoviesData]);

  return (
    <div className="list-container">
      <section className="movie-section">
        <h2 className="section-title">SYS.OBEJRZANE_ZARCHIWIZOWANE</h2>

        {watchedMovies.length > 0 ? (
          <div className="movie-grid">
            {watchedMovies.map((movie) => (
              <Movie
                movie={movie}
                key={movie.id}
                handleDelete={deleteMovie}
                handleRate={rateMovie}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>HISTORIA_ODTWARZANIA_PUSTA</p>
          </div>
        )}
      </section>
    </div>
  );
}

function Movie({
  movie,
  handleDelete,
  handleRate,
}: {
  movie: MovieTypesWatched;
  handleDelete: (movie: number) => void;
  handleRate: (movie: number, rating: number) => void;
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
        <StarRating
          rating={movie.rating}
          onRate={(newRating) => handleRate(movie.id, newRating)}
        />
        <button
          className="industrial-btn danger"
          onClick={() => handleDelete(movie.id)}
        >
          ✗
        </button>
      </div>
    </div>
  );
}
function StarRating({
  rating,
  onRate,
}: {
  rating: number;
  onRate: (r: number) => void;
}) {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <div className="industrial-btn star-rating-container">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => {
        const isActive = star <= (hover || rating);
        return (
          <span
            key={star}
            onClick={() => onRate(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(null)}
            className={`star ${isActive ? "active" : ""}`}
            title={`${star}/10`}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}
