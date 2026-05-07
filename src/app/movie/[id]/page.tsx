"use client";

import { useEffect, useState, use } from "react";
import {
  MovieDetailsApp,
  TMDBMovieDetails,
  CastMember,
} from "../../../types/movieData";
import "../movieDetails.css";

export default function MovieDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const movieId = resolvedParams.id;

  const [movie, setMovie] = useState<MovieDetailsApp>();

  const mapTMDBToApp = (tmdb: TMDBMovieDetails): MovieDetailsApp => {
    const director =
      tmdb.credits.crew.find((person) => person.job === "Director")?.name ||
      "Nieznany";

    const topCast = tmdb.credits.cast.slice(0, 5).map((actor) => ({
      id: actor.id,
      name: actor.name,
      character: actor.character,
      photo: actor.profile_path
        ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
        : null,
    }));

    const releaseYear = tmdb.release_date
      ? tmdb.release_date.split("-")[0]
      : "B/D";

    const hours = Math.floor(tmdb.runtime / 60);
    const minutes = tmdb.runtime % 60;
    const runtimeFormatted = `${hours}h ${minutes}m`;

    return {
      id: tmdb.id,
      title: tmdb.title,
      description: tmdb.overview,
      poster: tmdb.poster_path
        ? `https://image.tmdb.org/t/p/w500${tmdb.poster_path}`
        : null,
      backdrop: tmdb.backdrop_path
        ? `https://image.tmdb.org/t/p/original${tmdb.backdrop_path}`
        : null,
      releaseYear,
      runtimeFormatted,
      rating: Number(tmdb.vote_average.toFixed(1)),
      genres: tmdb.genres.map((g) => g.name),
      tagline: tmdb.tagline || "",
      director,
      topCast,
    };
  };

  useEffect(function () {
    if (!movieId) return;

    async function getLatestMovies() {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=33f4be8d4411e3aecbc041d9a4dc486d&language=pl-Pl&append_to_response=credits`,
        );

        if (!res.ok)
          throw new Error("Something went wrong with fetching latest movies");

        const data = await res.json();
        const cleanMovie = mapTMDBToApp(data);

        console.log(cleanMovie);
        setMovie(cleanMovie);
      } catch (err: unknown) {
        console.error(err);
      }
    }
    getLatestMovies();
  }, []);

  return (
    <div className="movie-details-container">
      <header className="movie-hero">
        <div className="hero-backdrop">
          <img src={movie?.backdrop || ""} alt="" />
          <div className="backdrop-overlay"></div>
        </div>

        <div className="hero-content">
          <div className="hero-poster-wrapper">
            {movie?.poster ? (
              <img src={movie.poster} alt={movie.title} />
            ) : (
              <div className="poster-placeholder">FOTO_MODUŁ_OFFLINE</div>
            )}
            <div className="poster-placeholder"></div>
          </div>

          <div className="hero-text">
            <h1 className="movie-title">{movie?.title}</h1>
            <div className="movie-meta">
              <span>ROK: {movie?.releaseYear || ""}</span>
              <span>CZAS: {movie?.runtimeFormatted || ""}</span>
              <span className="rating-accent">
                OCENA: {movie?.rating || ""}
              </span>
            </div>
            <p className="tagline">{movie?.tagline || ""}</p>

            <div className="hero-actions">
              <button className="btn-industrial primary">
                <span className="icon">+</span> DO_OBEJRZENIA
              </button>
              <button className="btn-industrial">
                <span className="icon">✓</span> OBEJRZANO
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="details-grid">
        <section className="details-main">
          <div className="data-block">
            <h2 className="block-title"></h2>
            <p className="overview">
              {movie?.description ? movie?.description : ""}
            </p>
          </div>

          <div className="data-block">
            <h2 className="block-title">PERSONEL_KLUCZOWY</h2>
            <div className="crew-info">
              <div className="crew-item">
                <span className="label">Reżyser: </span>
                <span className="value">{movie?.director || ""}</span>
              </div>
              <div className="crew-item">
                <span className="label">Gatunki: </span>
                <span className="value">
                  {movie?.genres
                    ? movie?.genres.map((genre: string) => `${genre} `)
                    : ""}
                </span>
              </div>
            </div>
          </div>
        </section>

        <aside className="details-sidebar">
          <h2 className="block-title">OBSADA</h2>
          <div className="cast-grid">
            {movie?.topCast?.map((castPerson: CastMember) => (
              <CastPerson castPerson={castPerson} key={castPerson.id} />
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

function CastPerson({ castPerson }: { castPerson: CastMember }) {
  return (
    <div className="cast-card">
      <div className="cast-photo-wrapper">
        {castPerson.photo ? (
          <img src={castPerson.photo} alt={castPerson.name} />
        ) : (
          <div className="cast-photo-placeholder">BRAK_DANYCH</div>
        )}
      </div>
      <div className="cast-info">
        <span className="actor-name">{castPerson.name}</span>
        <span className="character-name">{castPerson.character}</span>
      </div>
    </div>
  );
}
