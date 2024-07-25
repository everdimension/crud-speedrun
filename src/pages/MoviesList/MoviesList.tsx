import { useQuery } from "@tanstack/react-query";
import { Spacer } from "structure-kit";
import { Link } from "react-router-dom";
import { getImageUrl, getMovies } from "~/requests/movie-api";
import { Layout } from "~/components/Layout";

function MoviesList() {
  const { data, isLoading } = useQuery({
    queryKey: ["getMovies"],
    queryFn: () => getMovies(),
  });
  console.log(data, isLoading);
  if (isLoading) {
    return <p>loading...</p>;
  }
  return (
    <div style={{ display: "grid", gap: 12 }}>
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
