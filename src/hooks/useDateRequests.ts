import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DateRequest {
  id: string;
  company_id: string | null;
  requested_date: string;
  coordinator_name: string;
  description: string;
  status: "pending" | "approved" | "rejected";
  admin_response: string | null;
  responded_at: string | null;
  created_at: string;
  updated_at: string;
  company?: {
    name: string;
  };
}

export function useDateRequests(coordinatorName?: string) {
  return useQuery({
    queryKey: ["date-requests", coordinatorName],
    queryFn: async () => {
      let query = supabase
        .from("date_requests")
        .select(`
          *,
          company:companies(name)
        `)
        .order("created_at", { ascending: false });
      
      if (coordinatorName) {
        query = query.eq("coordinator_name", coordinatorName);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as DateRequest[];
    },
  });
}

export function useCreateDateRequest() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (request: Omit<DateRequest, "id" | "created_at" | "updated_at" | "company" | "status" | "admin_response" | "responded_at">) => {
      const { data, error } = await supabase
        .from("date_requests")
        .insert(request)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["date-requests"] });
    },
  });
}

export function useUpdateDateRequest() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<DateRequest> & { id: string }) => {
      const { data, error } = await supabase
        .from("date_requests")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["date-requests"] });
    },
  });
}
