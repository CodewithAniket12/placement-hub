import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CampusDrive {
  id: string;
  company_id: string;
  coordinator_name: string;
  drive_date: string;
  drive_time: string | null;
  venue: string | null;
  min_cgpa: number | null;
  eligible_branches: string | null;
  registered_count: number | null;
  appeared_count: number | null;
  selected_count: number | null;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  company?: {
    name: string;
  };
}

export function useCampusDrives(companyId?: string) {
  return useQuery({
    queryKey: ["campus-drives", companyId],
    queryFn: async () => {
      let query = supabase
        .from("campus_drives")
        .select(`
          *,
          company:companies(name)
        `)
        .order("drive_date", { ascending: true });
      
      if (companyId) {
        query = query.eq("company_id", companyId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as CampusDrive[];
    },
  });
}

export function useCreateCampusDrive() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (drive: Omit<CampusDrive, "id" | "created_at" | "updated_at" | "company">) => {
      const { data, error } = await supabase
        .from("campus_drives")
        .insert(drive)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campus-drives"] });
    },
  });
}

export function useUpdateCampusDrive() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<CampusDrive> & { id: string }) => {
      const { data, error } = await supabase
        .from("campus_drives")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campus-drives"] });
    },
  });
}

export function useDeleteCampusDrive() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("campus_drives")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campus-drives"] });
    },
  });
}
