'use server';

import { createServerClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

interface CreateClientData {
    name: string;
    slug: string;
    email: string;
    country: string;
    tier: 'gold' | 'platinum';
    billing_type: 'unique' | 'recurring';
    // Optional fields
    phone?: string | null;
    website?: string | null;
    industry?: string | null;
    company_size?: string | null;
    contact_name?: string | null;
    contact_email?: string | null;
    notes?: string | null;
}

export async function createClient(data: CreateClientData) {
    const supabase = createServerClient();

    // Validate slug is unique
    const { data: existingClient } = await supabase
        .from('clients')
        .select('id')
        .eq('slug' as any, data.slug)
        .maybeSingle();

    if (existingClient) {
        return { success: false, error: 'Slug already exists' };
    }

    // Validate email is unique
    const { data: existingEmail } = await supabase
        .from('clients')
        .select('id')
        .eq('email' as any, data.email)
        .maybeSingle();

    if (existingEmail) {
        return { success: false, error: 'Email already registered' };
    }

    const { data: newClient, error } = await supabase
        .from('clients')
        .insert([{
            name: data.name,
            slug: data.slug,
            email: data.email,
            country: data.country,
            tier: data.tier,
            billing_type: data.billing_type,
            status: 'active' as any,
            phone: data.phone || null,
            website: data.website || null,
            industry: data.industry || null,
            company_size: data.company_size || null,
            contact_name: data.contact_name || null,
            contact_email: data.contact_email || null,
            notes: data.notes || null,
        }] as any)
        .select()
        .single();

    if (error) {
        console.error('Error creating client:', error);
        return { success: false, error: 'Failed to create client' };
    }

    revalidatePath('/clients');

    return { success: true, client: newClient };
}

export async function toggleClientStatus(clientId: string, currentStatus: 'active' | 'paused') {
    const supabase = createServerClient();

    const newStatus = currentStatus === 'active' ? 'paused' : 'active';

    const { error } = await supabase
        .from('clients')
        .update({ status: newStatus } as any)
        .eq('id' as any, clientId);

    if (error) {
        throw new Error('Failed to update client status');
    }

    revalidatePath('/clients');

    return { success: true, newStatus };
}

export async function deleteClient(clientId: string) {
    const supabase = createServerClient();

    const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id' as any, clientId);

    if (error) {
        throw new Error('Failed to delete client');
    }

    revalidatePath('/clients');

    return { success: true };
}
