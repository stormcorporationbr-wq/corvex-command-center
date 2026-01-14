-- =====================================================
-- C0RVEX COMMAND CENTER - DATABASE SCHEMA
-- =====================================================
-- Execute this SQL in Supabase SQL Editor
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- ENUM TYPES
-- =====================================================

-- Client Status
CREATE TYPE client_status AS ENUM ('active', 'paused');

-- Billing Type
CREATE TYPE billing_type AS ENUM ('unique', 'recurring');

-- Client Tier
CREATE TYPE client_tier AS ENUM ('gold', 'platinum');

-- Service Type
CREATE TYPE service_type AS ENUM ('ID', 'Menu', 'Partners', 'Page');

-- =====================================================
-- TABLES
-- =====================================================

-- Clients Table
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    country TEXT NOT NULL,
    status client_status DEFAULT 'active' NOT NULL,
    billing_type billing_type DEFAULT 'recurring' NOT NULL,
    tier client_tier DEFAULT 'gold' NOT NULL
);

-- Services Table
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    type service_type NOT NULL,
    active BOOLEAN DEFAULT true NOT NULL,
    config JSONB DEFAULT '{}'::jsonb NOT NULL
);

-- Partners Table
CREATE TABLE IF NOT EXISTS partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    contact_info JSONB DEFAULT '{}'::jsonb NOT NULL,
    active BOOLEAN DEFAULT true NOT NULL
);

-- =====================================================
-- INDEXES
-- =====================================================

-- Clients indexes
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_tier ON clients(tier);
CREATE INDEX idx_clients_slug ON clients(slug);

-- Services indexes
CREATE INDEX idx_services_client_id ON services(client_id);
CREATE INDEX idx_services_type ON services(type);
CREATE INDEX idx_services_active ON services(active);

-- Partners indexes
CREATE INDEX idx_partners_client_id ON partners(client_id);
CREATE INDEX idx_partners_active ON partners(active);

-- =====================================================
-- TRIGGERS (Auto-update updated_at)
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for each table
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_partners_updated_at BEFORE UPDATE ON partners
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

-- Policies (For testing - allow all operations)
-- IMPORTANT: In production, restrict to authenticated users only

-- Clients policies
CREATE POLICY "Allow all operations on clients" ON clients
    FOR ALL USING (true) WITH CHECK (true);

-- Services policies
CREATE POLICY "Allow all operations on services" ON services
    FOR ALL USING (true) WITH CHECK (true);

-- Partners policies
CREATE POLICY "Allow all operations on partners" ON partners
    FOR ALL USING (true) WITH CHECK (true);

-- =====================================================
-- SEED DATA (Optional - for testing)
-- =====================================================

-- Insert sample clients
INSERT INTO clients (name, slug, country, status, billing_type, tier) VALUES
    ('Acme Corporation', 'acme-corp', 'USA', 'active', 'recurring', 'platinum'),
    ('Tech Solutions Ltd', 'tech-solutions', 'Brazil', 'active', 'recurring', 'gold'),
    ('Global Partners', 'global-partners', 'UK', 'paused', 'unique', 'gold');

-- Insert sample services
INSERT INTO services (client_id, type, active, config) VALUES
    ((SELECT id FROM clients WHERE slug = 'acme-corp'), 'ID', true, '{"api_key": "test123"}'),
    ((SELECT id FROM clients WHERE slug = 'acme-corp'), 'Menu', true, '{"theme": "dark"}'),
    ((SELECT id FROM clients WHERE slug = 'tech-solutions'), 'Partners', true, '{}');

-- Insert sample partners
INSERT INTO partners (client_id, name, category, contact_info, active) VALUES
    ((SELECT id FROM clients WHERE slug = 'acme-corp'), 'Partner One', 'Technology', '{"email": "contact@partner1.com", "phone": "+1234567890"}', true),
    ((SELECT id FROM clients WHERE slug = 'acme-corp'), 'Partner Two', 'Marketing', '{"email": "info@partner2.com"}', true),
    ((SELECT id FROM clients WHERE slug = 'tech-solutions'), 'Tech Partner', 'Development', '{"email": "dev@techpartner.com"}', true);

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

COMMENT ON TABLE clients IS 'C0RVEX Command Center - Clients management table';
COMMENT ON TABLE services IS 'C0RVEX Command Center - Services per client';
COMMENT ON TABLE partners IS 'C0RVEX Command Center - Partners per client';
