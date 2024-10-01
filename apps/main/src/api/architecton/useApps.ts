import { useQuery } from "@tanstack/react-query";

import axiosInstance from "@/api/architecton";

// TODO: Скорее всего переедет в отдельный дистр catalog, который сам будет менеджить свои запросы в сеть

export type GameListItemDTO = {
  icon: string;
  id: string;
  isPartner: boolean;
  title: string;
  subtitle: string;
  rating: number;
  date?: number;
};

export type GameCategoryType<T> = {
  title: string;
  id: string;
  apps: T;
};

export type GameListType<G> = GameCategoryType<G>[];

export interface MarketingItemDTO {
  id: string;
  image: string;
  url: string;
  title?: string;
}

export type AppsResponse = {
  categories: GameListType<GameListItemDTO[]>;
  marketings: MarketingItemDTO[];
};

export const useApps = (search?: string) =>
  useQuery<AppsResponse>({
    queryKey: ["apps", search],
    queryFn: async () => {
      const response = await axiosInstance.get<AppsResponse>("/apps", {
        params: { search },
      });
      return response.data;
    },
    staleTime: 120000,
    gcTime: 300000,
  });
