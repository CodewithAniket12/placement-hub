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
  job_roles: string | null;
  package_offered: string | null;
  eligibility_criteria: string | null;
  bond_details: string | null;
  job_location: string | null;
  selection_process: string | null;
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

export function useDeleteCompany() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("companies")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
}

export function useBlacklistCompany() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      const { data, error } = await supabase
        .from("companies")
        .update({ 
          status: "Blacklisted",
          notes: reason 
        })
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

export interface ExtractedFormData {
  job_roles: string | null;
  package_offered: string | null;
  eligibility_criteria: string | null;
  bond_details: string | null;
  job_location: string | null;
  selection_process: string | null;
}

export function useExtractAndSaveFormData() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ companyId, file }: { companyId: string; file: File }) => {
      // Send file to edge function for extraction
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/extract-pdf-data`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: formData,
        }
      );
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to extract data');
      }
      
      const result = await response.json();
      const extractedData = result.data as ExtractedFormData;
      
      // Update company with extracted data
      const { data, error } = await supabase
        .from("companies")
        .update({ 
          ...extractedData,
          registration_status: "Submitted"
        })
        .eq("id", companyId)
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
