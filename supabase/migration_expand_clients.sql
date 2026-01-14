-- =====================================================
-- C0RVEX COMMAND CENTER - CLIENTS TABLE EXPANSION
-- Migration: Add Contact & Company Fields
-- Execute this in Supabase SQL Editor
-- =====================================================

-- Add contact information columns
ALTER TABLE clients ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS website TEXT;

-- Add company details
ALTER TABLE clients ADD COLUMN IF NOT EXISTS industry TEXT;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS company_size TEXT;

-- Add contact person information
ALTER TABLE clients ADD COLUMN IF NOT EXISTS contact_name TEXT;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS contact_email TEXT;

-- Add notes
ALTER TABLE clients ADD COLUMN IF NOT EXISTS notes TEXT;

-- Create useful indexes
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_industry ON clients(industry);

-- Add comments
COMMENT ON COLUMN clients.email IS 'Primary contact email';
COMMENT ON COLUMN clients.phone IS 'Contact phone number';
COMMENT ON COLUMN clients.website IS 'Company website URL';
COMMENT ON COLUMN clients.industry IS 'Business industry/sector';
COMMENT ON COLUMN clients.company_size IS 'Company size range';
COMMENT ON COLUMN clients.contact_name IS 'Primary contact person name';
COMMENT ON COLUMN clients.contact_email IS 'Primary contact person email';
COMMENT ON COLUMN clients.notes IS 'Internal notes about the client';

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

DO $$ 
BEGIN
  RAISE NOTICE 'Client table expansion completed successfully!';
END $$;
