import { Link, useSearchParams } from "react-router-dom";
import { Spacer } from "structure-kit";
import { Layout } from "~/components/Layout";
import { useMoviesQuery } from "~/requests/movie-queries";
import { MovieListItem } from "~/components/MovieListItem";
import { DocumentTitle } from "~/components/DocumentTitle";

function MoviesList({
  source,
  search,
}: {
  source: "popular" | "trending" | null;
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

type MovieSource = "popular" | "trending";
function resolveSearchParams(params: URLSearchParams): {
  source: MovieSource | null;
  search: string;
} {
  const supportedValues = ["popular", "trending"] as const;
  const DEFAULT_SOURCE_PARAM = supportedValues[0];
  const sourceParam = params.get("source");
  const search = params.get("search");
  if (search) {
    return { source: null, search };
  } else if (!sourceParam) {
    return { source: DEFAULT_SOURCE_PARAM, search: "" };
  } else {
    const value = sourceParam.toLowerCase();
    const source = supportedValues.includes(value as MovieSource)
      ? (value as MovieSource)
      : DEFAULT_SOURCE_PARAM;
    return { source, search: "" };
  }
}

const capitalize = (str: string) =>
  `${str.charAt(0).toUpperCase()}${str.slice(1)}`;

export function MoviesListPage() {
  const [params, setSearchParams] = useSearchParams();
  const { search, source } = resolveSearchParams(params);
  const setSearch = (value: string) => setSearchParams({ search: value });
  const title = search
    ? `Movies results for "${search}"`
    : source
      ? `${capitalize(source)} Movies`
      : "Movies";
  return (
    <Layout>
      <DocumentTitle title={title} />
      <Spacer height={20} />
      <h1>Movies</h1>
      <Spacer height={20} />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: 12,
          rowGap: 8,
          flexWrap: "wrap",
        }}
      >
        <div>
          <Link
            to="?source=popular"
            style={{
              ...unstyledBtnStyle,
              color: source === "popular" ? "var(--text)" : "var(--link)",
              textDecorationColor: "currentcolor",
            }}
          >
            Popular
          </Link>{" "}
          <Link
            to="?source=trending"
            style={{
              ...unstyledBtnStyle,
              color: source === "trending" ? "var(--text)" : "var(--link)",
              textDecorationColor: "currentcolor",
            }}
          >
            Trending
          </Link>
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
            <div style={{ display: "flex", gap: 8 }}>
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
