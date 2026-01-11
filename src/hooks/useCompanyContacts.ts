import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CompanyContact {
  id: string;
  company_id: string;
  name: string;
  designation: string | null;
  phone: string | null;
  email: string | null;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export function useCompanyContacts(companyId: string | undefined) {
  return useQuery({
    queryKey: ["company-contacts", companyId],
    queryFn: async () => {
      if (!companyId) return [];
      
      const { data, error } = await supabase
        .from("company_contacts")
        .select("*")
        .eq("company_id", companyId)
        .order("is_primary", { ascending: false })
        .order("name");
      
      if (error) throw error;
      return data as CompanyContact[];
    },
    enabled: !!companyId,
  });
}

export function useCreateCompanyContact() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (contact: Omit<CompanyContact, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("company_contacts")
        .insert(contact)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["company-contacts", variables.company_id] });
    },
  });
}

export function useUpdateCompanyContact() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, company_id, ...updates }: Partial<CompanyContact> & { id: string; company_id: string }) => {
      const { data, error } = await supabase
        .from("company_contacts")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return { ...data, company_id };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["company-contacts", data.company_id] });
    },
  });
}

export function useDeleteCompanyContact() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, company_id }: { id: string; company_id: string }) => {
      const { error } = await supabase
        .from("company_contacts")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      return { company_id };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["company-contacts", data.company_id] });
    },
  });
}

export function useSetPrimaryContact() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, company_id }: { id: string; company_id: string }) => {
      // First, unset all primary contacts for this company
      await supabase
        .from("company_contacts")
        .update({ is_primary: false })
        .eq("company_id", company_id);
      
      // Then set the selected contact as primary
      const { data, error } = await supabase
        .from("company_contacts")
        .update({ is_primary: true })
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return { ...data, company_id };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["company-contacts", data.company_id] });
    },
  });
}
