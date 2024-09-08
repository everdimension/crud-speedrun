import { useQuery, useMutation } from "@tanstack/react-query";
import { getMovies, addToFavourite, getFavoriteList } from "./movie-api";
import { queryClient } from "./queryClient";

export function useMoviesQuery(params: Parameters<typeof getMovies>[0]) {
  return useQuery({
    queryKey: ["getMovies", params],
    queryFn: () => getMovies(params),
  });
}

export function useFavoritesQuery() {
  return useQuery({
    queryKey: ["getFavoriteList"],
    queryFn: () => getFavoriteList(),
  });
}

export function useFavoriteMovieMutation({
  onMutate,
  onError,
}: {
  onMutate?: () => void;
  onError?: () => void;
} = {}) {
  return useMutation({
    mutationFn: async ({
      movieId,
      favorite,
    }: {
      movieId: number;
      favorite: boolean;
    }) => {
      return addToFavourite({
        favorite,
        media_type: "movie",
        media_id: movieId,
      });
    },
    onMutate() {
      onMutate?.();
    },
    onError() {
      onError?.();
    },
    onSuccess() {
      queryClient.refetchQueries({ queryKey: ["getMovies"] });
      queryClient.refetchQueries({ queryKey: ["getFavoriteList"] });
    },
  });
}
