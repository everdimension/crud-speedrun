import invariant from "tiny-invariant";

export function getImageUrl(path: string, size: "w500" | "original" = "w500") {
  const url = new URL(`.${path}`, `https://image.tmdb.org/t/p/${size}/`);
  return url.href;
}

const token = import.meta.env.VITE_TMDB_TOKEN as string | undefined;

invariant(token, "VITE_TMDB_TOKEN is not set");

interface Movie {
  backdrop_path: string;
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  title?: string;
  name?: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

interface ApiListResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export async function getMovies() {
  // const res = await fetch("https://api.themoviedb.org/3/movie/popular", {
  const res = await fetch("https://api.themoviedb.org/3/trending/movie/day", {
    headers: { Authorization: `Bearer ${token}` },
  });

  const result = await res.json();
  return result as ApiListResponse<Movie>;
}

export async function getMovieById(id: string | number) {
  const res = await fetch(`https://api.themoviedb.org/3/movie/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const result = await res.json();
  return result as Movie;
}
