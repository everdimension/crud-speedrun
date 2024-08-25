import { useState } from "react";
import { Link } from "react-router-dom";
import { getImageUrl, type ClientMovie } from "~/requests/movie-api";
import { useFavoriteMovieMutation } from "~/requests/movie-queries";

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
  isFavorite: isFavoriteProp,
}: {
  movieId: number;
  isFavorite: boolean;
}) {
  const [isFavoriteOptimistic, setIsFavoriteOptimistic] = useState<
    boolean | null
  >(null);
  const mutation = useFavoriteMovieMutation({
    onMutate() {
      setIsFavoriteOptimistic(
        isFavoriteOptimistic == null ? !isFavoriteProp : !isFavoriteOptimistic,
      );
    },
    onError() {
      setIsFavoriteOptimistic(null);
    },
  });

  const isFavorite =
    isFavoriteOptimistic === null ? isFavoriteProp : isFavoriteOptimistic;

  return (
    <LikeButton
      title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
      filled={isFavorite}
      onClick={() => {
        mutation.mutate({ movieId, favorite: !isFavorite });
      }}
    />
  );
}

export function MovieListItem({ movie }: { movie: ClientMovie }) {
  const title = movie.title || movie.name || "<Unknown>";
  const releaseYear = Number(movie.release_date.split("-")[0]);
  const currentYear = new Date().getFullYear();
  return (
    <div
      key={movie.id}
      style={{ display: "flex", gap: 12, alignItems: "center" }}
    >
      <div style={{ flexShrink: 0 }}>
        <img
          src={getImageUrl(movie.poster_path)}
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
        <Link to={`/movies/${movie.id}`}>{title}</Link>{" "}
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
          {movie.overview.slice(0, 30)}
        </div>
      </div>
      <div style={{ flexShrink: 0 }}>
        <ConnectedFavoritedButton
          isFavorite={movie.is_favorite}
          movieId={movie.id}
        />
      </div>
    </div>
  );
}
