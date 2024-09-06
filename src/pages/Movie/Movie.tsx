import { useQuery } from "@tanstack/react-query";
import invariant from "tiny-invariant";
import { Layout } from "../../components/Layout";
import { getImageUrl, getMovieById } from "~/requests/movie-api";
import { useParams } from "react-router-dom";
import { Spacer } from "structure-kit";
import { ConnectedFavoriteButton } from "~/components/ConnectedFavoriteButton";
import { ReleaseYear } from "~/components/MovieListItem/ReleaseYear";

export function MoviePage() {
  const { id } = useParams<{ id: string }>();
  invariant(id, "id param is required");
  const { data, isLoading } = useQuery({
    queryKey: ["getMovieById", id],
    queryFn: () => getMovieById(id),
  });
  return (
    <Layout>
      <Spacer height={20} />
      {isLoading ? (
        <p>loading movie...</p>
      ) : !data ? (
        <div>no data</div>
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h1 style={{ fontSize: "clamp(2rem, 2rem + 4vw, 3.5rem)" }}>
              {data.title}
            </h1>
            <ConnectedFavoriteButton
              style={{ flexShrink: 0 }}
              movieId={data.id}
              isFavorite={data.is_favorite}
            />
          </div>
          <ReleaseYear year={Number(data.release_date.split("-")[0])}/>
          <Spacer height={20} />
          <div style={{ display: "flex", justifyContent: "center" }}>
            <img
              src={getImageUrl(data.poster_path)}
              style={{
                width: "100%",
                maxWidth: 400,
                aspectRatio: "16 / 9",
                objectFit: "cover",
              }}
            />
          </div>
          <Spacer height={20} />
          <div>{data.overview}</div>
        </>
      )}
    </Layout>
  );
}
