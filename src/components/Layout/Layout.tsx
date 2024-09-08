import { Link } from "react-router-dom";
import { useFavoritesQuery } from "~/requests/movie-queries";

function FavoritesCount() {
  const { data } = useFavoritesQuery();
  return data?.total_results == null ? null : (
    <span>({data?.total_results})</span>
  );
}

export function Layout({ children }: React.PropsWithChildren) {
  const MAX_WIDTH = 800;
  return (
    <div style={{ paddingBottom: 80 }}>
      <div
        style={{ borderBottom: "1px solid var(--surface-2)", paddingBlock: 12 }}
      >
        <nav
          style={{
            maxWidth: MAX_WIDTH,
            marginInline: "auto",
            paddingInline: 16,
          }}
        >
          <div style={{ display: "flex", gap: 12 }}>
            <Link
              to="/"
              style={{
                color: "var(--link)",
                textDecorationColor: "var(--indigo-2)",
              }}
            >
              Movies
            </Link>
            <Link
              to="/favorites"
              style={{
                color: "var(--link)",
                textDecorationColor: "var(--indigo-2)",
              }}
            >
              Favorites <FavoritesCount />
            </Link>
          </div>
        </nav>
      </div>

      <div
        style={{ maxWidth: MAX_WIDTH, marginInline: "auto", paddingInline: 16 }}
      >
        {children}
      </div>
    </div>
  );
}
