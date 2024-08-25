import { Spacer } from "structure-kit";
import { Layout } from "~/components/Layout";
import { useMoviesQuery } from "~/requests/movie-queries";
import { MovieListItem } from "~/components/MovieListItem";

function MoviesList() {
  const { data, isLoading } = useMoviesQuery();
  if (isLoading) {
    return <p>loading...</p>;
  }
  return (
    <div style={{ display: "grid", gap: 12 }}>
      {data?.results.map((result) => {
        return <MovieListItem key={result.id} movie={result} />;
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
