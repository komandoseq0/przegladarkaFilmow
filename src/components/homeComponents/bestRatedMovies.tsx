"use client";

import { useEffect, useState } from "react";
import { MovieTypes, TMDBMovie } from "../../types/movieData"
import Link from "next/link";

export default function BestRatedMovies() {
    const [bestRatedMovies, setBestRatedMovies] = useState<MovieTypes[]>([]); 

  useEffect(function () {
    async function getBestRatedMovies() {
      try {
        const res = await fetch(
          "https://api.themoviedb.org/3/movie/top_rated?api_key=33f4be8d4411e3aecbc041d9a4dc486d&language=pl-PL&page=1",
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

        console.log(CleanMovies);
      } catch (err: unknown) {
        console.error(err);
      }
    }
    getBestRatedMovies();
  }, []);

  return <section className="movies">
    {bestRatedMovies.map((movie: MovieTypes) => <Movie movie={movie} key={movie.id}/>)}
  </section>;
}

function Movie({ movie } : {movie: MovieTypes}) {
    return <Link href={`/movie/${movie.id}`}>
        <div className="movie">
            <h2>{movie.title}</h2>
            <img src={movie.poster ? movie.poster : ""} alt="Could not found movie poster" />
        </div>
    </Link>
}