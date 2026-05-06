"use client";

import { useEffect, useState } from "react";
import { MovieTypes, TMDBMovie } from "../../types/movieData"
import Link from "next/link";
import "./movieCards.css";

export default function BestRatedMovies() {
    const [bestRatedMovies, setBestRatedMovies] = useState<MovieTypes[]>([]); 

  useEffect(function () {
    async function getBestRatedMovies() {
      try {
        const res = await fetch(
          "https://api.themoviedb.org/3/movie/top_rated?api_key=33f4be8d4411e3aecbc041d9a4dc486d&language=en-US&page=1",
        );

        if (!res.ok)
          throw new Error(
            "Something went wrong with fetching Best rated movies",
          );

        const data = await res.json();
        const topTenResults: TMDBMovie[] = data.results.slice(0, 10);

        const CleanMovies: MovieTypes[] = topTenResults.map((movie: TMDBMovie) => {
            return {
                id: movie.id,
                title: movie.title,
                poster: movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : null,
                releaseDate: movie.release_date,
            }
        })

        setBestRatedMovies(CleanMovies);
      } catch (err: unknown) {
        console.error(err);
      }
    }
    getBestRatedMovies();
  }, []);

  return (
    <section className="movie-section">
      <h2 className="section-title">SYS.NAJLEPIEJ_OCENIANE</h2>
      <div className="movie-grid">
        {bestRatedMovies.map((movie: MovieTypes) => <Movie movie={movie} key={movie.id}/>)}
      </div>
    </section>
  );
}

function Movie({ movie } : {movie: MovieTypes}) {
    return (
      <Link href={`/movie/${movie.id}`}>
          <div className="industrial-card">
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
          </div>
      </Link>
    );
}