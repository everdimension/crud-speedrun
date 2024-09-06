import { Link } from "react-router-dom";
import { getImageUrl, type ClientMovie } from "~/requests/movie-api";
import { ConnectedFavoriteButton } from "../ConnectedFavoriteButton";
import { ReleaseYear } from "./ReleaseYear";

export function MovieListItem({ movie }: { movie: ClientMovie }) {
  const title = movie.title || movie.name || "<Unknown>";
  const releaseYear = Number(movie.release_date.split("-")[0]);
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
        <small>
          <ReleaseYear year={releaseYear} />
        </small>
        <div style={{ fontSize: "0.8em", color: "var(--gray-7)" }}>
          {movie.overview.slice(0, 30)}
        </div>
      </div>
      <div style={{ flexShrink: 0 }}>
        <ConnectedFavoriteButton
          isFavorite={movie.is_favorite}
          movieId={movie.id}
        />
      </div>
    </div>
  );
}
