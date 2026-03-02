export type UserRole = 'owner' | 'worker';
export type CampaignStatus = 'active' | 'paused' | 'completed';
export type SignStatus = 'deployed' | 'reported' | 'claimed' | 'removed';
export type ClaimStatus = 'claimed' | 'pickup_verified' | 'completed' | 'cancelled';
export type PayoutStatus = 'pending' | 'processed' | 'failed';

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
          role: UserRole;
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
          role?: UserRole;
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
          role?: UserRole;
          stripe_account_id?: string | null;
          average_rating?: number;
          total_earnings?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      campaigns: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          description: string | null;
          bounty_amount: number;
          qr_code: string;
          status: CampaignStatus;
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
          status?: CampaignStatus;
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
          status?: CampaignStatus;
          signs_deployed?: number;
          signs_reported?: number;
          signs_removed?: number;
          total_bounty_paid?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'campaigns_owner_id_fkey';
            columns: ['owner_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      sign_pins: {
        Row: {
          id: string;
          campaign_id: string;
          location_lat: number;
          location_lng: number;
          address: string | null;
          status: SignStatus;
          deployed_at: string;
          reported_at: string | null;
          claimed_at: string | null;
          removed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          campaign_id: string;
          location_lat: number;
          location_lng: number;
          address?: string | null;
          status?: SignStatus;
          deployed_at?: string;
          reported_at?: string | null;
          claimed_at?: string | null;
          removed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          campaign_id?: string;
          location_lat?: number;
          location_lng?: number;
          address?: string | null;
          status?: SignStatus;
          deployed_at?: string;
          reported_at?: string | null;
          claimed_at?: string | null;
          removed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'sign_pins_campaign_id_fkey';
            columns: ['campaign_id'];
            isOneToOne: false;
            referencedRelation: 'campaigns';
            referencedColumns: ['id'];
          },
        ];
      };
      reports: {
        Row: {
          id: string;
          sign_pin_id: string | null;
          campaign_id: string;
          reporter_email: string | null;
          reporter_phone: string | null;
          description: string | null;
          location_lat: number;
          location_lng: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          sign_pin_id?: string | null;
          campaign_id: string;
          reporter_email?: string | null;
          reporter_phone?: string | null;
          description?: string | null;
          location_lat: number;
          location_lng: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          sign_pin_id?: string | null;
          campaign_id?: string;
          reporter_email?: string | null;
          reporter_phone?: string | null;
          description?: string | null;
          location_lat?: number;
          location_lng?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'reports_sign_pin_id_fkey';
            columns: ['sign_pin_id'];
            isOneToOne: false;
            referencedRelation: 'sign_pins';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'reports_campaign_id_fkey';
            columns: ['campaign_id'];
            isOneToOne: false;
            referencedRelation: 'campaigns';
            referencedColumns: ['id'];
          },
        ];
      };
      claims: {
        Row: {
          id: string;
          worker_id: string;
          sign_pin_id: string;
          bounty_amount: number;
          status: ClaimStatus;
          claimed_at: string;
          pickup_photo_url: string | null;
          pickup_verified_at: string | null;
          dropoff_photo_url: string | null;
          dropoff_location_lat: number | null;
          dropoff_location_lng: number | null;
          completed_at: string | null;
          rating: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          worker_id: string;
          sign_pin_id: string;
          bounty_amount: number;
          status?: ClaimStatus;
          claimed_at?: string;
          pickup_photo_url?: string | null;
          pickup_verified_at?: string | null;
          dropoff_photo_url?: string | null;
          dropoff_location_lat?: number | null;
          dropoff_location_lng?: number | null;
          completed_at?: string | null;
          rating?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          worker_id?: string;
          sign_pin_id?: string;
          bounty_amount?: number;
          status?: ClaimStatus;
          claimed_at?: string;
          pickup_photo_url?: string | null;
          pickup_verified_at?: string | null;
          dropoff_photo_url?: string | null;
          dropoff_location_lat?: number | null;
          dropoff_location_lng?: number | null;
          completed_at?: string | null;
          rating?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'claims_worker_id_fkey';
            columns: ['worker_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'claims_sign_pin_id_fkey';
            columns: ['sign_pin_id'];
            isOneToOne: false;
            referencedRelation: 'sign_pins';
            referencedColumns: ['id'];
          },
        ];
      };
      payouts: {
        Row: {
          id: string;
          worker_id: string;
          claim_id: string;
          amount: number;
          stripe_payment_id: string | null;
          status: PayoutStatus;
          processed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          worker_id: string;
          claim_id: string;
          amount: number;
          stripe_payment_id?: string | null;
          status?: PayoutStatus;
          processed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          worker_id?: string;
          claim_id?: string;
          amount?: number;
          stripe_payment_id?: string | null;
          status?: PayoutStatus;
          processed_at?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'payouts_worker_id_fkey';
            columns: ['worker_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'payouts_claim_id_fkey';
            columns: ['claim_id'];
            isOneToOne: false;
            referencedRelation: 'claims';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: UserRole;
      campaign_status: CampaignStatus;
      sign_status: SignStatus;
      claim_status: ClaimStatus;
      payout_status: PayoutStatus;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
