import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Company {
  id: string;
  name: string;
  website: string | null;
  industry: string | null;
  status: "Active" | "Blacklisted";
  registration_status: "Submitted" | "Pending";
  poc_1st: string;
  poc_2nd: string | null;
  hr_name: string | null;
  hr_phone: string | null;
  hr_email: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export function useCompanies() {
  return useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data as Company[];
    },
  });
}

export function useUpdateCompanyNotes() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes: string }) => {
      const { data, error } = await supabase
        .from("companies")
        .update({ notes })
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
}

export function useUpdateCompany() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Company> & { id: string }) => {
      const { data, error } = await supabase
        .from("companies")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
}

export function useCreateCompany() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (company: Omit<Company, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("companies")
        .insert(company)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
}
