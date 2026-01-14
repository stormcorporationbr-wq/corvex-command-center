// TypeScript types generated from Supabase schema
// Run: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.types.ts

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            clients: {
                Row: {
                    id: string
                    created_at: string
                    updated_at: string
                    name: string
                    slug: string
                    country: string
                    status: 'active' | 'paused'
                    billing_type: 'unique' | 'recurring'
                    tier: 'gold' | 'platinum'
                    email: string | null
                    phone: string | null
                    website: string | null
                    industry: string | null
                    company_size: string | null
                    contact_name: string | null
                    contact_email: string | null
                    notes: string | null
                }
                Insert: {
                    id?: string
                    created_at?: string
                    updated_at?: string
                    name: string
                    slug: string
                    country: string
                    status?: 'active' | 'paused'
                    billing_type?: 'unique' | 'recurring'
                    tier?: 'gold' | 'platinum'
                    email?: string | null
                    phone?: string | null
                    website?: string | null
                    industry?: string | null
                    company_size?: string | null
                    contact_name?: string | null
                    contact_email?: string | null
                    notes?: string | null
                }
                Update: {
                    id?: string
                    created_at?: string
                    updated_at?: string
                    name?: string
                    slug?: string
                    country?: string
                    status?: 'active' | 'paused'
                    billing_type?: 'unique' | 'recurring'
                    tier?: 'gold' | 'platinum'
                    email?: string | null
                    phone?: string | null
                    website?: string | null
                    industry?: string | null
                    company_size?: string | null
                    contact_name?: string | null
                    contact_email?: string | null
                    notes?: string | null
                }
            }
            services: {
                Row: {
                    id: string
                    created_at: string
                    updated_at: string
                    client_id: string
                    type: 'ID' | 'Menu' | 'Partners' | 'Page'
                    active: boolean
                    config: Json
                }
                Insert: {
                    id?: string
                    created_at?: string
                    updated_at?: string
                    client_id: string
                    type: 'ID' | 'Menu' | 'Partners' | 'Page'
                    active?: boolean
                    config?: Json
                }
                Update: {
                    id?: string
                    created_at?: string
                    updated_at?: string
                    client_id?: string
                    type?: 'ID' | 'Menu' | 'Partners' | 'Page'
                    active?: boolean
                    config?: Json
                }
            }
            partners: {
                Row: {
                    id: string
                    created_at: string
                    updated_at: string
                    client_id: string | null
                    name: string
                    category: string
                    contact_info: Json
                    active: boolean
                    partner_type: 'supplier' | 'integration' | 'network' | 'vendor'
                    website: string | null
                    contract_value: number | null
                    contract_start_date: string | null
                    contract_end_date: string | null
                    integration_status: string | null
                    api_credentials: Json | null
                }
                Insert: {
                    id?: string
                    created_at?: string
                    updated_at?: string
                    client_id?: string | null
                    name: string
                    category: string
                    contact_info?: Json
                    active?: boolean
                    partner_type?: 'supplier' | 'integration' | 'network' | 'vendor'
                    website?: string | null
                    contract_value?: number | null
                    contract_start_date?: string | null
                    contract_end_date?: string | null
                    integration_status?: string | null
                    api_credentials?: Json | null
                }
                Update: {
                    id?: string
                    created_at?: string
                    updated_at?: string
                    client_id?: string | null
                    name?: string
                    category?: string
                    contact_info?: Json
                    active?: boolean
                    partner_type?: 'supplier' | 'integration' | 'network' | 'vendor'
                    website?: string | null
                    contract_value?: number | null
                    contract_start_date?: string | null
                    contract_end_date?: string | null
                    integration_status?: string | null
                    api_credentials?: Json | null
                }
            }
            proposals: {
                Row: {
                    id: string
                    created_at: string
                    updated_at: string
                    client_id: string | null
                    client_name: string
                    business_type: string | null
                    region: 'BR' | 'US' | 'EU'
                    language: 'pt-BR' | 'en' | 'es'
                    currency: string
                    setup_fee: number | null
                    monthly_fee: number | null
                    delivery_days: string | null
                    pdf_url: string | null
                    pitch_text: string | null
                    sent_at: string | null
                    accepted_at: string | null
                    status: 'draft' | 'sent' | 'accepted' | 'rejected'
                }
                Insert: {
                    id?: string
                    created_at?: string
                    updated_at?: string
                    client_id?: string | null
                    client_name: string
                    business_type?: string | null
                    region: 'BR' | 'US' | 'EU'
                    language: 'pt-BR' | 'en' | 'es'
                    currency: string
                    setup_fee?: number | null
                    monthly_fee?: number | null
                    delivery_days?: string | null
                    pdf_url?: string | null
                    pitch_text?: string | null
                    sent_at?: string | null
                    accepted_at?: string | null
                    status?: 'draft' | 'sent' | 'accepted' | 'rejected'
                }
                Update: {
                    id?: string
                    created_at?: string
                    updated_at?: string
                    client_id?: string | null
                    client_name?: string
                    business_type?: string | null
                    region?: 'BR' | 'US' | 'EU'
                    language?: 'pt-BR' | 'en' | 'es'
                    currency?: string
                    setup_fee?: number | null
                    monthly_fee?: number | null
                    delivery_days?: string | null
                    pdf_url?: string | null
                    pitch_text?: string | null
                    sent_at?: string | null
                    accepted_at?: string | null
                    status?: 'draft' | 'sent' | 'accepted' | 'rejected'
                }
            }
            templates: {
                Row: {
                    id: string
                    created_at: string
                    updated_at: string
                    name: string
                    type: 'proposal' | 'pitch'
                    language: 'pt-BR' | 'en' | 'es'
                    content: string
                    variables: Json | null
                    active: boolean
                }
                Insert: {
                    id?: string
                    created_at?: string
                    updated_at?: string
                    name: string
                    type: 'proposal' | 'pitch'
                    language: 'pt-BR' | 'en' | 'es'
                    content: string
                    variables?: Json | null
                    active?: boolean
                }
                Update: {
                    id?: string
                    created_at?: string
                    updated_at?: string
                    name?: string
                    type?: 'proposal' | 'pitch'
                    language?: 'pt-BR' | 'en' | 'es'
                    content?: string
                    variables?: Json | null
                    active?: boolean
                }
            }
        }
    }
}
