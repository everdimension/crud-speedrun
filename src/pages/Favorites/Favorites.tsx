import { useMutation, useQuery } from "@tanstack/react-query";
import { Spacer } from "structure-kit";
import { Link } from "react-router-dom";
import { Layout } from "../../components/Layout";
import {
  addToFavourite,
  getFavoriteList,
  getImageUrl,
} from "~/requests/movie-api";

export function FavoritesPage() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["getFavoriteList"],
    queryFn: () => getFavoriteList(),
  });
  const mutation = useMutation({
    mutationFn: async ({
      movieId,
      favorite,
    }: {
      movieId: number;
      favorite: boolean;
    }) => {
      addToFavourite({ favorite, media_type: "movie", media_id: movieId });
    },
    onSuccess: () => refetch(),
  });
  return (
    <Layout>
      <Spacer height={20} />
      <h1>Favourites</h1>
      <Spacer height={20} />

      {isLoading ? (
        <p>loading...</p>
      ) : data?.results.length === 0 ? (
        <div>No Favorites</div>
      ) : null}

      {data?.results.map((result) => {
        const title = result.title || result.name || "<Unknown>";
        return (
          <div
            key={result.id}
            style={{ display: "flex", gap: 12, alignItems: "center" }}
          >
            <div>
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
            <div>
              <Link to={`/movies/${result.id}`}>{title}</Link>
              <div style={{ fontSize: "0.8em", color: "var(--gray-6)" }}>
                {result.overview.slice(0, 30)}
              </div>
            </div>
            <div>
              <button
                aria-label="Remove from favorites"
                disabled={mutation.isPending}
                onClick={() => {
                  mutation.mutate({ movieId: result.id, favorite: false });
                }}
              >
                {mutation.isPending ? "..." : "x"}
              </button>
            </div>
          </div>
        );
      })}
    </Layout>
  );
}
