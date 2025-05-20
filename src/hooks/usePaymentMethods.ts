
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Define the PaymentMethod type manually until database types are updated
export interface PaymentMethod {
  id: string;
  user_id: string;
  stripe_pm_id: string;
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
  is_default: boolean;
  nickname?: string | null;
  created_at: string;
  updated_at: string;
}

export function usePaymentMethods() {
  return useQuery<PaymentMethod[], Error>({
    queryKey: ["payment_methods"],
    queryFn: async () => {
      try {
        // Use type assertion to bypass TypeScript's type checking
        // since the table doesn't exist in the types yet
        const response = await supabase
          .from("payment_methods")
          .select("*")
          .order("created_at", { ascending: false }) as any;
        
        const { data, error } = response;
        
        if (error) throw error;
        
        return data || [];
      } catch (error) {
        console.error("Error fetching payment methods:", error);
        throw error;
      }
    }
  });
}
