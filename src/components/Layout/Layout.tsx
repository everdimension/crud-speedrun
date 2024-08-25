import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getFavoriteList } from "~/requests/movie-api";

function FavoritesCount() {
  const { data } = useQuery({
    queryKey: ["getFavoriteList"],
    queryFn: () => getFavoriteList(),
  });
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
            <Link to="/">Movies</Link>
            <Link to="/favorites">
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
