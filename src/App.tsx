import { QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { MoviesListPage } from "./pages/MoviesList";
import { FavoritesPage } from "./pages/Favorites/Favorites";
import { MoviePage } from "./pages/Movie";
import { queryClient } from "./requests/queryClient";

function Main() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MoviesListPage />} />
        <Route path="/movies/:id" element={<MoviePage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route
          path="*"
          element={<div style={{ placeSelf: "center" }}>Not Found</div>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export function App() {
  return (
    <ErrorBoundary
      fallback={<div style={{ placeSelf: "center" }}>Oops! App crashed</div>}
    >
      <QueryClientProvider client={queryClient}>
        <Main />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
