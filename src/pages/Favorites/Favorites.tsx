import { Spacer } from "structure-kit";
import { Layout } from "../../components/Layout";
import { MovieListItem } from "~/components/MovieListItem";
import { useFavoritesQuery } from "~/requests/movie-queries";
import { DocumentTitle } from "~/components/DocumentTitle";

export function FavoritesPage() {
  const { data, isLoading } = useFavoritesQuery();
  return (
    <Layout>
      <DocumentTitle title="Favorites" />
      <Spacer height={20} />
      <h1>Favourites</h1>
      <Spacer height={20} />

      {isLoading ? (
        <p>loading...</p>
      ) : data?.results.length === 0 ? (
        <div>No Favorites</div>
      ) : null}

      <div style={{ display: "grid", gap: 12 }}>
        {data?.results.map((result) => {
          return <MovieListItem key={result.id} movie={result} />;
        })}
      </div>
    </Layout>
  );
}
