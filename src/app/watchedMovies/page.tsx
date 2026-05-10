"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MovieTypes, TMDBMovie } from "../../types/movieData";
import "../../components/homeComponents/movieCards.css";
import "../userLists.css";

export default function WatchedPage() {
  const [watchedMoviesData, setWatchedMoviesData] = useState<number[]>([]);
  const [watchedMovies, setWatchedMovies] = useState<MovieTypes[]>([]);

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

  function deleteMovie(movieId: number) {
    const watched: number[] = JSON.parse(
      localStorage.getItem("watched") || "[]",
    );

    const updatedToWatched = watched.filter(
      (movie: number) => movie !== movieId,
    );

    localStorage.setItem("watched", JSON.stringify(updatedToWatched));

    setWatchedMoviesData(updatedToWatched);
  }

  useEffect(function () {
    const watched: number[] = JSON.parse(
      localStorage.getItem("watched") || "[]",
    );
    setWatchedMoviesData(watched);
  }, []);

  useEffect(() => {
    async function fetchMovies() {
      try {
        const promises = watchedMoviesData.map(async (movieId) => {
          const res = await fetch(
            `https://api.themoviedb.org/3/movie/${movieId}?api_key=33f4be8d4411e3aecbc041d9a4dc486d&language=pl-Pl&append_to_response=credits`,
          );
          if (!res.ok) throw new Error("Error fetching movie");
          const data = await res.json();
          return tmdbDataToMovieData(data);
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
              <Movie movie={movie} key={movie.id} handleDelete={deleteMovie}/>
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

function Movie({ movie, handleDelete }: { movie: MovieTypes, handleDelete: (movie: number) => void }) {
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
        <button className="industrial-btn danger" onClick={() => handleDelete(movie.id)}>✗ USUŃ</button>
      </div>
    </div>
  );
}
