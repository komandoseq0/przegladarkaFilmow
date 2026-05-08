"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MovieTypes, TMDBMovie } from "../../types/movieData";
import "../../components/homeComponents/movieCards.css";
import "../userLists.css";

export default function ToWatchPage() {
  const [toWatchMovies, setToWatchMovies] = useState<MovieTypes[]>();

  const tmdbDataToMovieData = (tmdbData: TMDBMovie): MovieTypes => {
    return {
      id: tmdbData.id,
      title: tmdbData.title,
      releaseDate: tmdbData.release_date,
      poster: tmdbData.poster_path ?`https://image.tmdb.org/t/p/w500${tmdbData.poster_path}` : null,
    }
  }

  useEffect(
    function () {
      async function getMovie(movieId: number) {
        try {
          const res = await fetch(
            `https://api.themoviedb.org/3/movie/${movieId}?api_key=33f4be8d4411e3aecbc041d9a4dc486d&language=pl-Pl&append_to_response=credits`,,
          );

          if (!res.ok)
            throw new Error(
              "Something went wrong with fetching searched movies",
            );

          const data = await res.json();
          const cleanMovie = tmdbDataToMovieData(data);
          
          setToWatchMovies((prev) => [...(prev || []), cleanMovie])
        } catch (err: unknown) {
          console.error(err);
        }
      }
    },
    [],
  );

  return (
    <div className="list-container">
      <section className="movie-section">
        <h2 className="section-title">SYS.DO_OBEJRZENIA</h2>

        {toWatchMovies.length > 0 ? (
          <div className="movie-grid">
            {toWatchMovies.map((movie) => (
              <div key={movie.id} className="industrial-card list-card">
                <Link href={`/movie/${movie.id}`} className="card-link">
                  <div className="card-image-wrapper">
                    {movie.poster ? (
                      <img
                        className="card-poster"
                        src={movie.poster}
                        alt={movie.title}
                      />
                    ) : (
                      <div className="no-poster">BŁĄD WIZJI</div>
                    )}
                  </div>
                  <div className="card-info">
                    <h3 className="card-title">{movie.title}</h3>
                  </div>
                </Link>
                <div className="list-actions">
                  <button className="industrial-btn">✓ ZALICZONE</button>
                  <button className="industrial-btn danger">✗ USUŃ</button>
                </div>
              </div>
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
