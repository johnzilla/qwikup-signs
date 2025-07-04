import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          phone: string | null;
          company_name: string | null;
          role: 'owner' | 'worker';
          stripe_account_id: string | null;
          average_rating: number;
          total_earnings: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          phone?: string | null;
          company_name?: string | null;
          role?: 'owner' | 'worker';
          stripe_account_id?: string | null;
          average_rating?: number;
          total_earnings?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          first_name?: string;
          last_name?: string;
          phone?: string | null;
          company_name?: string | null;
          role?: 'owner' | 'worker';
          stripe_account_id?: string | null;
          average_rating?: number;
          total_earnings?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      campaigns: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          description: string | null;
          bounty_amount: number;
          qr_code: string;
          status: 'active' | 'paused' | 'completed';
          signs_deployed: number;
          signs_reported: number;
          signs_removed: number;
          total_bounty_paid: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          description?: string | null;
          bounty_amount?: number;
          qr_code: string;
          status?: 'active' | 'paused' | 'completed';
          signs_deployed?: number;
          signs_reported?: number;
          signs_removed?: number;
          total_bounty_paid?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          name?: string;
          description?: string | null;
          bounty_amount?: number;
          qr_code?: string;
          status?: 'active' | 'paused' | 'completed';
          signs_deployed?: number;
          signs_reported?: number;
          signs_removed?: number;
          total_bounty_paid?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};