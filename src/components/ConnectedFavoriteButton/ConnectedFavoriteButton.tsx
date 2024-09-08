import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { useFavoriteMovieMutation } from "~/requests/movie-queries";

function HeartIcon({
  filled,
  style,
}: {
  filled: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      style={style}
    >
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill="var(--red-8)"
        stroke="var(--red-8)"
        strokeWidth="3"
        style={filled ? undefined : { display: "none" }}
      />
    </svg>
  );
}

function LikeButton({
  filled,
  style,
  onClick,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  filled: boolean;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  type ConfettiFn = ReturnType<(typeof confetti)["create"]>;
  const confettiRef = useRef<ConfettiFn | null>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (canvas) {
      confettiRef.current = confetti.create(canvas, {
        resize: true,
        disableForReducedMotion: true,
      });
    }
  }, []);
  return (
    <div style={{ position: "relative", display: "grid" }}>
      <canvas
        ref={ref}
        style={{
          pointerEvents: "none",
          width: 200,
          height: 200,
          position: "absolute",
          placeSelf: "center",
        }}
      />
      <button
        {...props}
        onClick={(event) => {
          onClick?.(event);
          const btn = event.currentTarget;
          const to = filled ? "scale(0.8)" : "scale(1.2)";
          btn.animate(
            { transform: ["scale(1)", to, "scale(1)"] },
            { duration: 300, easing: "ease-out" },
          );
          if (filled) {
            return;
          }
          confettiRef.current?.({
            spread: 300,
            colors: [
              "#fa5252",
              "#f03e3e",
              "#e03131",
              "#c92a2a",
              "#b02525",
              "#962020",
            ],
            particleCount: 20,
            scalar: 0.8,
            ticks: 50,
            gravity: 0.1,
            decay: 0.8,
            startVelocity: 10,
          });
        }}
        style={{
          ...style,
          backgroundColor: "transparent",
        }}
      >
        <HeartIcon filled={filled} />
      </button>
    </div>
  );
}

export function ConnectedFavoriteButton({
  movieId,
  isFavorite: isFavoriteProp,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  movieId: number;
  isFavorite: boolean;
}) {
  const [isFavoriteOptimistic, setIsFavoriteOptimistic] = useState<
    boolean | null
  >(null);
  const mutation = useFavoriteMovieMutation({
    onMutate() {
      setIsFavoriteOptimistic(
        isFavoriteOptimistic == null ? !isFavoriteProp : !isFavoriteOptimistic,
      );
    },
    onError() {
      setIsFavoriteOptimistic(null);
    },
  });

  const isFavorite =
    isFavoriteOptimistic === null ? isFavoriteProp : isFavoriteOptimistic;

  return (
    <LikeButton
      {...props}
      title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
      filled={isFavorite}
      onClick={() => {
        mutation.mutate({ movieId, favorite: !isFavorite });
      }}
    />
  );
}
