import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Coordinator {
  id: string;
  name: string;
  phone: string;
  created_at: string;
}

export function useCoordinators() {
  return useQuery({
    queryKey: ["coordinators"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("coordinators")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;
      return data as Coordinator[];
    },
  });
}

export function useAddCoordinator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, phone }: { name: string; phone: string }) => {
      const { data, error } = await supabase
        .from("coordinators")
        .insert({ name, phone })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coordinators"] });
    },
  });
}

export function useDeleteCoordinator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("coordinators")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coordinators"] });
    },
  });
}
