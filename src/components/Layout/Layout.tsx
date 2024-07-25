import { Link } from "react-router-dom";

export function Layout({ children }: React.PropsWithChildren) {
  const MAX_WIDTH = 800;
  return (
    <div style={{ paddingBottom: 80 }}>
      <div
        style={{ borderBottom: "1px solid var(--surface-2)", paddingBlock: 12 }}
      >
        <nav style={{ maxWidth: MAX_WIDTH, marginInline: "auto" }}>
          <div style={{ display: "flex", gap: 12 }}>
            <Link to="/">Movies</Link>
            <Link to="/favorites">Favorites</Link>
          </div>
        </nav>
      </div>

      <div style={{ maxWidth: MAX_WIDTH, marginInline: "auto" }}>
        {children}
      </div>
    </div>
  );
}
