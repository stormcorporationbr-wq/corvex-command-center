-- =====================================================
-- C0RVEX COMMAND CENTER - SALES ENGINE
-- Migration: Create proposals and templates tables
-- Execute this in Supabase SQL Editor
-- =====================================================

-- Create proposals table
CREATE TABLE IF NOT EXISTS proposals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Client info
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL,
  business_type TEXT,
  
  -- Proposal config
  region TEXT NOT NULL CHECK (region IN ('BR', 'US', 'EU')),
  language TEXT NOT NULL CHECK (language IN ('pt-BR', 'en', 'es')),
  currency TEXT NOT NULL,
  
  -- Pricing
  setup_fee DECIMAL(10,2) DEFAULT 197.00,
  monthly_fee DECIMAL(10,2) DEFAULT 29.00,
  delivery_days TEXT DEFAULT 'até 3 dias',
  
  -- Generated content
  pdf_url TEXT,
  pitch_text TEXT,
  
  -- Status
  sent_at TIMESTAMP,
  accepted_at TIMESTAMP,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'rejected'))
);

-- Create templates table
CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Template info
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('proposal', 'pitch')),
  language TEXT NOT NULL CHECK (language IN ('pt-BR', 'en', 'es')),
  
  -- Content
  content TEXT NOT NULL,
  variables JSONB,
  
  -- Status
  active BOOLEAN DEFAULT true
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_proposals_client ON proposals(client_id);
CREATE INDEX IF NOT EXISTS idx_proposals_status ON proposals(status);
CREATE INDEX IF NOT EXISTS idx_proposals_created ON proposals(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_templates_type_lang ON templates(type, language);

-- Add RLS policies
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- Allow all operations for authenticated users (for now)
CREATE POLICY "Allow all for authenticated users" ON proposals
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for authenticated users" ON templates
  FOR ALL USING (true) WITH CHECK (true);

-- Add triggers for updated_at
CREATE TRIGGER update_proposals_updated_at
  BEFORE UPDATE ON proposals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_templates_updated_at
  BEFORE UPDATE ON templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default templates
INSERT INTO templates (name, type, language, content, variables, active) VALUES
(
  'Proposta BR',
  'proposal',
  'pt-BR',
  '# Proposta de Infraestrutura Digital
## Para: {{CLIENT_NAME}}

### 1. O Desafio
O cliente moderno busca agilidade. Cardápios em PDF ou sites lentos fazem você perder vendas.

### 2. A Solução: GWS App-Site
Uma tecnologia que se comporta como aplicativo, mas é acessada instantaneamente. Não ocupa espaço no celular e não precisa baixar nada.

### 3. Os 4 Pilares

**Identidade Inteligente**
Wi-Fi, WhatsApp e Localização num toque

**Vitrine Interativa**
Seu catálogo ou menu com visual de elite

**Parceiros de Confiança**
Sua rede de indicações

**Perfil do Negócio**
Sua história para gerar conexão real

### 4. Investimento

Taxa de Ativação: {{CURRENCY}} {{SETUP_FEE}}
Manutenção: {{CURRENCY}} {{MONTHLY_FEE}}/mês

### 5. Entrega
{{DELIVERY_DAYS}} para o Portal Digital + Placa Inteligente C0RVEX

O prazo pode variar de acordo com a demanda e complexidade.',
  '["CLIENT_NAME", "CURRENCY", "SETUP_FEE", "MONTHLY_FEE", "DELIVERY_DAYS"]'::jsonb,
  true
),
(
  'Proposal EN',
  'proposal',
  'en',
  '# Digital Infrastructure & Experience Proposal
## For: {{CLIENT_NAME}}

### 1. The Challenge
In a globalized market, customers demand speed. Traditional PDFs or heavy apps create friction.

### 2. The Solution: GWS App-Site
A high-performance portal that behaves like a native app but requires zero downloads and zero storage space.

### 3. The 4 Pillars

**Smart Identity**
Instant Wi-Fi, WhatsApp, and Location

**Interactive Showcase**
Multilingual menu/catalog with premium visuals

**Trusted Partners**
A verified network of your local recommendations

**Business Legacy**
Your story and team to build trust

### 4. Investment

Setup Fee: {{CURRENCY}} {{SETUP_FEE}} (One-time)
Maintenance: {{CURRENCY}} {{MONTHLY_FEE}}/month

### 5. Delivery
{{DELIVERY_DAYS}} for Digital Portal + GWS Smart Access Plate

Timeline may vary depending on demand and complexity.',
  '["CLIENT_NAME", "CURRENCY", "SETUP_FEE", "MONTHLY_FEE", "DELIVERY_DAYS"]'::jsonb,
  true
),
(
  'Pitch BR',
  'pitch',
  'pt-BR',
  'Olá {{CLIENT_NAME}}!

Criei um mockup visual do GWS App-Site para o seu {{BUSINESS_TYPE}}.

É um portal que seus clientes acessam como se fosse um app, mas sem precisar baixar nada. Fica leve e rápido no celular.

Preparei algumas imagens mostrando como ficaria. Posso te enviar?',
  '["CLIENT_NAME", "BUSINESS_TYPE"]'::jsonb,
  true
),
(
  'Pitch EN',
  'pitch',
  'en',
  'Hi {{CLIENT_NAME}}!

I''ve created a visual mockup of a GWS App-Site for your {{BUSINESS_TYPE}}.

It''s a portal your customers can access like an app, but without downloads. Fast and lightweight on any phone.

I''ve prepared some preview images showing how it would look. Can I send them to you?',
  '["CLIENT_NAME", "BUSINESS_TYPE"]'::jsonb,
  true
);

-- Add comments
COMMENT ON TABLE proposals IS 'Sales proposals generated for clients';
COMMENT ON TABLE templates IS 'Templates for proposals and pitches';
COMMENT ON COLUMN proposals.region IS 'BR, US, or EU for regional customization';
COMMENT ON COLUMN proposals.delivery_days IS 'Estimated delivery timeframe';

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

DO $$ 
BEGIN
  RAISE NOTICE 'Sales Engine tables created successfully!';
  RAISE NOTICE '4 default templates inserted (2 proposals + 2 pitches)';
END $$;
