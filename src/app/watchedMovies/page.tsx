"use client";

import { useState } from "react";
import Link from "next/link";
import { MovieTypes } from "../../types/movieData";
import "../../components/homeComponents/movieCards.css";
import "../userLists.css";

export default function WatchedPage() {
  const [watchedMovies, setWatchedMovies] = useState<MovieTypes[]>([
    {
      id: 680,
      title: "Pulp Fiction",
      poster: "https://image.tmdb.org/t/p/w200/d5iIlFn5s0ImszYzBPb8SPCPb1s.jpg",
      releaseDate: "1994-09-10",
    }
  ]);

  return (
    <div className="list-container">
      <section className="movie-section">
        <h2 className="section-title">SYS.OBEJRZANE_ZARCHIWIZOWANE</h2>
        
        {watchedMovies.length > 0 ? (
          <div className="movie-grid">
            {watchedMovies.map((movie) => (
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
                  <div className="rating-display">
                    ★ 8.5/10
                  </div>
                  <button className="industrial-btn danger">✗ USUŃ</button>
                </div>
              </div>
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