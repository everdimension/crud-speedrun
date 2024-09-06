export function ReleaseYear({ year: releaseYear }: { year: number }) {
  const currentYear = new Date().getFullYear();
  return (
    <span
      style={{
        color:
          releaseYear === currentYear
            ? "var(--green-6)"
            : releaseYear < currentYear - 30
              ? "var(--orange-8)"
              : "var(--gray-6)",
      }}
    >
      {releaseYear}
    </span>
  );
}
