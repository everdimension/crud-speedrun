import { useMutation, useQuery } from "@tanstack/react-query";
import { Spacer } from "structure-kit";
import { Link } from "react-router-dom";
import { addToFavourite, getImageUrl, getMovies } from "~/requests/movie-api";
import { Layout } from "~/components/Layout";

function HeartIcon({
  filled,
  style,
}: {
  filled: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      style={style}
    >
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill="var(--red-8)"
        stroke="var(--red-8)"
        strokeWidth="3"
        style={filled ? undefined : { display: "none" }}
      />
    </svg>
  );
}

function LikeButton({
  filled,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  filled: boolean;
}) {
  return (
    <button {...props}>
      <HeartIcon filled={filled} />
    </button>
  );
}

function ConnectedFavoritedButton({
  movieId,
  isFavorite,
  onSuccess,
}: {
  movieId: number;
  isFavorite: boolean;
  onSuccess: () => void;
}) {
  const mutation = useMutation({
    mutationFn: async ({
      movieId,
      favorite,
    }: {
      movieId: number;
      favorite: boolean;
    }) => {
      return addToFavourite({
        favorite,
        media_type: "movie",
        media_id: movieId,
      });
    },
    onSuccess,
  });
  return (
    <LikeButton
      title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
      filled={isFavorite}
      disabled={mutation.isPending}
      onClick={() => {
        mutation.mutate({ movieId, favorite: !isFavorite });
      }}
    />
  );
}

function MoviesList() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["getMovies"],
    queryFn: () => getMovies(),
  });
  if (isLoading) {
    return <p>loading...</p>;
  }
  return (
    <div style={{ display: "grid", gap: 12 }}>
      {data?.results.map((result) => {
        const title = result.title || result.name || "<Unknown>";
        const releaseYear = Number(result.release_date.split("-")[0]);
        const currentYear = new Date().getFullYear();
        return (
          <div
            key={result.id}
            style={{ display: "flex", gap: 12, alignItems: "center" }}
          >
            <div style={{ flexShrink: 0 }}>
              <img
                src={getImageUrl(result.poster_path)}
                style={{
                  width: 48,
                  aspectRatio: "1 / 1",
                  objectFit: "cover",
                  display: "block",
                  borderRadius: 6,
                }}
                alt={`Movie poster for ${title}`}
              />
            </div>
            <div style={{ flexBasis: "300px" }}>
              <Link to={`/movies/${result.id}`}>{title}</Link>{" "}
              <small
                style={{
                  color:
                    releaseYear === currentYear
                      ? "var(--green-6)"
                      : releaseYear < currentYear - 30
                        ? "var(--orange-8)"
                        : "var(--gray-6)",
                }}
              >
                {releaseYear}
              </small>
              <div style={{ fontSize: "0.8em", color: "var(--gray-7)" }}>
                {result.overview.slice(0, 30)}
              </div>
            </div>
            <div style={{ flexShrink: 0 }}>
              <ConnectedFavoritedButton
                isFavorite={result.is_favorite}
                movieId={result.id}
                onSuccess={() => refetch()}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function MoviesListPage() {
  return (
    <Layout>
      <Spacer height={20} />
      <h1>Movies</h1>
      <Spacer height={20} />
      <MoviesList />
    </Layout>
  );
}
