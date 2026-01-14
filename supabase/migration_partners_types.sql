-- =====================================================
-- C0RVEX COMMAND CENTER - PARTNERS TABLE EXPANSION
-- Migration: Add Partner Types & Flexibility
-- Execute this in Supabase SQL Editor
-- =====================================================

-- Create partner_type ENUM
CREATE TYPE partner_type AS ENUM ('supplier', 'integration', 'network', 'vendor');

-- Add partner_type column
ALTER TABLE partners ADD COLUMN IF NOT EXISTS partner_type partner_type DEFAULT 'supplier';

-- Add additional useful columns
ALTER TABLE partners ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS contract_value DECIMAL(10,2);
ALTER TABLE partners ADD COLUMN IF NOT EXISTS contract_start_date DATE;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS contract_end_date DATE;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS integration_status TEXT;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS api_credentials JSONB;

-- Make client_id nullable (for GWS own partners - vendor type)
ALTER TABLE partners ALTER COLUMN client_id DROP NOT NULL;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_partners_type ON partners(partner_type);
CREATE INDEX IF NOT EXISTS idx_partners_website ON partners(website);

-- Add check constraint
ALTER TABLE partners ADD CONSTRAINT check_vendor_no_client 
  CHECK (
    (partner_type = 'vendor' AND client_id IS NULL) OR
    (partner_type != 'vendor' AND client_id IS NOT NULL)
  );

-- Add comments
COMMENT ON COLUMN partners.partner_type IS 'Type of partnership: supplier, integration, network, or vendor';
COMMENT ON COLUMN partners.website IS 'Partner company website';
COMMENT ON COLUMN partners.contract_value IS 'Contract value (monthly or total)';
COMMENT ON COLUMN partners.contract_start_date IS 'Contract start date';
COMMENT ON COLUMN partners.contract_end_date IS 'Contract end date';
COMMENT ON COLUMN partners.integration_status IS 'Status of technical integration';
COMMENT ON COLUMN partners.api_credentials IS 'API keys and credentials (encrypted recommended)';

-- Update existing partners to have a type (default: supplier)
UPDATE partners SET partner_type = 'supplier' WHERE partner_type IS NULL;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

DO $$ 
BEGIN
  RAISE NOTICE 'Partners table expansion completed! Now supports all partner types.';
END $$;
