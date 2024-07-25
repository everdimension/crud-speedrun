import { useQuery } from "@tanstack/react-query";
import invariant from "tiny-invariant";
import { Layout } from "../../components/Layout";
import { getMovieById } from "~/requests/movie-api";
import { useParams } from "react-router-dom";
import { Spacer } from "structure-kit";

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
      ) : (
        <>
          <h1>{data?.title}</h1>
          <Spacer height={20} />
        </>
      )}
    </Layout>
  );
}
