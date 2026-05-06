export interface MovieTypes {
  id: number;
  title: string;
  poster: string | null;
  releaseDate: string;
}

export interface TMDBMovie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
}