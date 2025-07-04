/*
  # Initial Smart Sign Platform Schema

  1. New Tables
    - `profiles` - User profiles for sign owners and gig workers
    - `campaigns` - Sign campaigns created by owners
    - `sign_pins` - Individual sign locations and tracking
    - `reports` - Public reports of expired signs
    - `claims` - Gig worker claims on sign bounties
    - `payouts` - Payment records for completed work

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
    - Secure file uploads for proof photos

  3. Features
    - GPS coordinate tracking
    - QR code generation and tracking
    - Bounty payment system
    - Photo proof uploads via Supabase Storage
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('owner', 'worker');
CREATE TYPE campaign_status AS ENUM ('active', 'paused', 'completed');
CREATE TYPE sign_status AS ENUM ('deployed', 'reported', 'claimed', 'removed');
CREATE TYPE claim_status AS ENUM ('claimed', 'pickup_verified', 'completed', 'cancelled');
CREATE TYPE payout_status AS ENUM ('pending', 'processed', 'failed');

-- Profiles table - extends Supabase auth.users
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  phone text,
  company_name text,
  role user_role NOT NULL DEFAULT 'owner',
  stripe_account_id text,
  average_rating numeric(3,2) DEFAULT 0,
  total_earnings numeric(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Campaigns table - sign campaigns created by owners
CREATE TABLE IF NOT EXISTS campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  bounty_amount numeric(10,2) NOT NULL DEFAULT 5.00,
  qr_code text UNIQUE NOT NULL,
  status campaign_status DEFAULT 'active',
  signs_deployed integer DEFAULT 0,
  signs_reported integer DEFAULT 0,
  signs_removed integer DEFAULT 0,
  total_bounty_paid numeric(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Sign pins table - individual sign locations
CREATE TABLE IF NOT EXISTS sign_pins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES campaigns(id) ON DELETE CASCADE NOT NULL,
  location_lat numeric(10,8) NOT NULL,
  location_lng numeric(11,8) NOT NULL,
  address text,
  status sign_status DEFAULT 'deployed',
  deployed_at timestamptz DEFAULT now(),
  reported_at timestamptz,
  claimed_at timestamptz,
  removed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Reports table - public reports of expired signs
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sign_pin_id uuid REFERENCES sign_pins(id) ON DELETE CASCADE,
  campaign_id uuid REFERENCES campaigns(id) ON DELETE CASCADE NOT NULL,
  reporter_email text,
  reporter_phone text,
  description text,
  location_lat numeric(10,8) NOT NULL,
  location_lng numeric(11,8) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Claims table - gig worker claims on bounties
CREATE TABLE IF NOT EXISTS claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  sign_pin_id uuid REFERENCES sign_pins(id) ON DELETE CASCADE NOT NULL,
  bounty_amount numeric(10,2) NOT NULL,
  status claim_status DEFAULT 'claimed',
  claimed_at timestamptz DEFAULT now(),
  pickup_photo_url text,
  pickup_verified_at timestamptz,
  dropoff_photo_url text,
  dropoff_location_lat numeric(10,8),
  dropoff_location_lng numeric(11,8),
  completed_at timestamptz,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Payouts table - payment records
CREATE TABLE IF NOT EXISTS payouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  claim_id uuid REFERENCES claims(id) ON DELETE CASCADE NOT NULL,
  amount numeric(10,2) NOT NULL,
  stripe_payment_id text,
  status payout_status DEFAULT 'pending',
  processed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE sign_pins ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Campaigns policies
CREATE POLICY "Owners can manage their campaigns"
  ON campaigns FOR ALL
  TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Workers can read active campaigns"
  ON campaigns FOR SELECT
  TO authenticated
  USING (status = 'active');

CREATE POLICY "Public can read campaigns for reports"
  ON campaigns FOR SELECT
  TO anon
  USING (status = 'active');

-- Sign pins policies
CREATE POLICY "Owners can manage signs in their campaigns"
  ON sign_pins FOR ALL
  TO authenticated
  USING (
    campaign_id IN (
      SELECT id FROM campaigns WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Workers can read available signs"
  ON sign_pins FOR SELECT
  TO authenticated
  USING (status IN ('reported', 'claimed'));

CREATE POLICY "Public can read signs for reports"
  ON sign_pins FOR SELECT
  TO anon
  USING (status = 'deployed');

-- Reports policies
CREATE POLICY "Anyone can create reports"
  ON reports FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Owners can read reports for their campaigns"
  ON reports FOR SELECT
  TO authenticated
  USING (
    campaign_id IN (
      SELECT id FROM campaigns WHERE owner_id = auth.uid()
    )
  );

-- Claims policies
CREATE POLICY "Workers can manage their claims"
  ON claims FOR ALL
  TO authenticated
  USING (worker_id = auth.uid());

CREATE POLICY "Owners can read claims for their campaigns"
  ON claims FOR SELECT
  TO authenticated
  USING (
    sign_pin_id IN (
      SELECT sp.id FROM sign_pins sp
      JOIN campaigns c ON sp.campaign_id = c.id
      WHERE c.owner_id = auth.uid()
    )
  );

-- Payouts policies
CREATE POLICY "Workers can read their payouts"
  ON payouts FOR SELECT
  TO authenticated
  USING (worker_id = auth.uid());

CREATE POLICY "System can manage payouts"
  ON payouts FOR ALL
  TO authenticated
  USING (
    worker_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM claims c
      JOIN sign_pins sp ON c.sign_pin_id = sp.id
      JOIN campaigns cam ON sp.campaign_id = cam.id
      WHERE c.id = claim_id AND cam.owner_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_campaigns_owner_id ON campaigns(owner_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_sign_pins_campaign_id ON sign_pins(campaign_id);
CREATE INDEX IF NOT EXISTS idx_sign_pins_status ON sign_pins(status);
CREATE INDEX IF NOT EXISTS idx_sign_pins_location ON sign_pins(location_lat, location_lng);
CREATE INDEX IF NOT EXISTS idx_reports_campaign_id ON reports(campaign_id);
CREATE INDEX IF NOT EXISTS idx_claims_worker_id ON claims(worker_id);
CREATE INDEX IF NOT EXISTS idx_claims_sign_pin_id ON claims(sign_pin_id);
CREATE INDEX IF NOT EXISTS idx_claims_status ON claims(status);
CREATE INDEX IF NOT EXISTS idx_payouts_worker_id ON payouts(worker_id);

-- Create functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON campaigns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sign_pins_updated_at
  BEFORE UPDATE ON sign_pins
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_claims_updated_at
  BEFORE UPDATE ON claims
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();