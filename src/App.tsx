import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import "./App.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      throwOnError: true,
    },
  },
});

function getImageUrl(path: string, size: "w500" | "original" = "w500") {
  const url = new URL(`.${path}`, `https://image.tmdb.org/t/p/${size}/`);
  return url.href;
}

const token = "<token>";

async function getMovies() {
  const res = await fetch("https://api.themoviedb.org/3/movie/popular", {
    headers: { Authorization: `Bearer ${token}` },
  });

  const result = await res.json();
  return result;
}

function Main() {
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
      {data?.results.map((result) => (
        <div style={{ display: "flex", gap: 8 }}>
          <img
            src={getImageUrl(result.poster_path)}
            style={{ width: 32 }}
            alt=""
          />
          <div>
            <div>{result.title}</div>
            <div style={{ fontSize: "0.8em", color: "grey" }}>
              {result.overview.slice(0, 30)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function App() {
  return (
    <ErrorBoundary fallback={<div>Oops! App crashed</div>}>
      <QueryClientProvider client={queryClient}>
        <Main />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
