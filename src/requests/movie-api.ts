import invariant from "tiny-invariant";

export function getImageUrl(path: string, size: "w500" | "original" = "w500") {
  const url = new URL(`.${path}`, `https://image.tmdb.org/t/p/${size}/`);
  return url.href;
}

const token = import.meta.env.VITE_TMDB_TOKEN as string | undefined;

invariant(token, "VITE_TMDB_TOKEN is not set");

export interface Movie {
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

export interface ClientMovie extends Movie {
  is_favorite: boolean;
}

interface ApiListResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export async function getFavoriteList(): Promise<ApiListResponse<ClientMovie>> {
  const accountId = await getAccountId();
  const res = await fetch(
    `https://api.themoviedb.org/3/account/${accountId}/favorite/movies?language=en-US&page=1&sort_by=created_at.asc`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  const result = (await res.json()) as ApiListResponse<Movie>;
  return {
    ...result,
    results: result.results.map((item) => ({ ...item, is_favorite: true })),
  };
}

async function withFavoriteStatus(
  items: ApiListResponse<Movie>,
): Promise<ApiListResponse<ClientMovie>> {
  const favorites = await getFavoriteList();
  const favoritesSet = new Set(favorites.results.map((movie) => movie.id));
  const results: ClientMovie[] = [];
  for (const movie of items.results) {
    results.push({ ...movie, is_favorite: favoritesSet.has(movie.id) });
  }
  return { ...items, results };
}

export async function getMovies(): Promise<ApiListResponse<ClientMovie>> {
  // const res = await fetch("https://api.themoviedb.org/3/movie/popular", {
  const res = await fetch("https://api.themoviedb.org/3/trending/movie/day", {
    headers: { Authorization: `Bearer ${token}` },
  });

  const result = (await res.json()) as ApiListResponse<Movie>;
  return withFavoriteStatus(result);
}

interface AccountState {
  id: number;
  favorite: boolean;
  rated: boolean;
  watchlist: boolean;
}

async function getMovieStates({ movieId }: { movieId: number | string }) {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/account_states`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  const result = (await res.json()) as AccountState;
  return result;
}

async function getMovieByIdInternal(id: string | number) {
  const res = await fetch(`https://api.themoviedb.org/3/movie/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const result = await res.json();
  return result as Movie;
}

export async function getMovieById(id: string | number): Promise<ClientMovie> {
  const [movie, movieState] = await Promise.all([
    getMovieByIdInternal(id),
    getMovieStates({ movieId: id }),
  ]);
  return { ...movie, is_favorite: movieState.favorite };
}

async function getAccountId() {
  const res = await fetch("https://api.themoviedb.org/3/account/account_id", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const result = (await res.json()) as { id: number };
  return result.id;
}

export async function addToFavourite({
  media_id,
  media_type,
  favorite,
}: {
  media_id: number;
  media_type: "movie";
  favorite: boolean;
}) {
  const accountId = await getAccountId();
  const res = await fetch(
    `https://api.themoviedb.org/3/account/${accountId}/favorite`,
    {
      method: "post",
      body: JSON.stringify({ media_id, media_type, favorite }),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );
  if (res.status >= 200 && res.status < 300) {
    await new Promise((r) => setTimeout(r, 1000));
    return await res.json();
  } else {
    throw res;
  }
}
