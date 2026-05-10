export interface MovieTypes {
  id: number;
  title: string;
  poster: string | null;
  releaseDate: string;
}

export interface MovieTypesWatched {
  id: number;
  title: string;
  poster: string | null;
  releaseDate: string;
  rating: number;
}

export interface TMDBMovie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
}

export interface TMDBMovieDetails {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  runtime: number;
  vote_average: number;
  genres: { id: number; name: string }[];
  tagline: string | null;
  credits: {
    cast: {
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }[];
    crew: {
      id: number;
      name: string;
      job: string;
    }[];
  };
}

export interface MovieDetailsApp {
  id: number;
  title: string;
  description: string;
  poster: string | null;
  backdrop: string | null;
  releaseYear: string;
  runtimeFormatted: string;
  rating: number;
  genres: string[];
  tagline: string;
  director: string;
  topCast: CastMember[];
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  photo: string | null;
}

export interface watchedMovie {
  id: number,
  rating: number,
}