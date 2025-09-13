import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { useIsFocused } from "@react-navigation/native";
import z from "zod";

export interface Plant {
  id: string;
  name: string;
  location: string;
  date: string;
  image: string | null;
}

const plantSchema = z.object({
  name: z.string().nonempty("O nome da planta é obrigatório"),
  location: z.string().nonempty("A localização é obrigatória"),
  date: z.string().nonempty("A data é obrigatória"),
});

export function usePlants() {
  const isFocused = useIsFocused();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<Plant[]>({
    queryKey: ["plants"],
    queryFn: async () => {
      try {
        const response = await api.get<Plant[]>("/plant");
        return response.data;
      } catch {
        return [];
      }
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: isFocused,
  });

  const createPlantMutation = useMutation({
    mutationFn: async (newPlant: Partial<Plant>) => {
      const response = await api.post<Plant>("/plant", newPlant);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["plants"] }),
  });

  const updatePlantMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Plant> }) => {
      const response = await api.patch<Plant>(`/plant/${id}`, data);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["plants"] }),
  });

  const deletePlantMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/plant/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["plants"] }),
  });

  return {
    plants: data || [],
    loading: isLoading,
    createPlant: createPlantMutation.mutateAsync,
    updatePlant: updatePlantMutation.mutateAsync,
    deletePlant: deletePlantMutation.mutateAsync,
    plantSchema
  };
}
