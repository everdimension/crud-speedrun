import { useState } from "react";
import { Spacer } from "structure-kit";
import { Layout } from "~/components/Layout";
import { useMoviesQuery } from "~/requests/movie-queries";
import { MovieListItem } from "~/components/MovieListItem";

function MoviesList({
  source,
  search,
}: {
  source: "popular" | "trending";
  search: string | null;
}) {
  const { data, isLoading, isFetching } = useMoviesQuery({ source, search });
  if (isLoading) {
    return <p>loading...</p>;
  }
  console.log({ isFetching });
  return (
    <div style={{ display: "grid", gap: 12, opacity: isFetching ? 0.7 : 1 }}>
      {data?.results.map((result) => {
        return <MovieListItem key={result.id} movie={result} />;
      })}
    </div>
  );
}

const unstyledBtnStyle: React.CSSProperties = {
  background: "none",
  padding: 0,
};

export function MoviesListPage() {
  const [source, setSource] = useState<"popular" | "trending">("popular");
  const [search, setSearch] = useState("");
  return (
    <Layout>
      <Spacer height={20} />
      <h1>Movies</h1>
      <Spacer height={20} />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <div>
          <button
            onClick={() => setSource("popular")}
            style={{
              ...unstyledBtnStyle,
              color: source === "popular" ? undefined : "var(--link)",
            }}
          >
            Popular
          </button>{" "}
          <button
            onClick={() => setSource("trending")}
            style={{
              ...unstyledBtnStyle,
              color: source === "trending" ? undefined : "var(--link)",
            }}
          >
            Trending
          </button>
        </div>
        <div>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              const input = event.currentTarget.elements.namedItem("search");
              // safe to convert because we know our input
              const value = (input as HTMLInputElement).value;
              setSearch(value);
            }}
          >
            <div style={{ display: "flex", gap: 4 }}>
              <input
                type="search"
                name="search"
                placeholder="Search..."
                onChange={(event) => {
                  if (event.target.value === "") {
                    setSearch(event.target.value);
                  }
                }}
                style={{ cursor: "text" }}
              />
              <button
                style={{
                  backgroundColor: "var(--surface-2)",
                  borderRadius: "var(--radius-2)",
                  paddingInline: 8,
                }}
              >
                go
              </button>
            </div>
          </form>
        </div>
      </div>
      <Spacer height={12} />
      <MoviesList source={source} search={search || null} />
    </Layout>
  );
}
