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
        .eq('slug', data.slug)
        .single();

    if (existingClient) {
        return { success: false, error: 'Slug already exists' };
    }

    // Validate email is unique
    const { data: existingEmail } = await supabase
        .from('clients')
        .select('id')
        .eq('email', data.email)
        .single();

    if (existingEmail) {
        return { success: false, error: 'Email already registered' };
    }

    const { data: newClient, error } = await supabase
        .from('clients')
        .insert([{
            ...data,
            status: 'active', // Default to active
            // Clean up empty strings to null
            phone: data.phone || null,
            website: data.website || null,
            industry: data.industry || null,
            company_size: data.company_size || null,
            contact_name: data.contact_name || null,
            contact_email: data.contact_email || null,
            notes: data.notes || null,
        }])
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
        .update({ status: newStatus })
        .eq('id', clientId);

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
        .eq('id', clientId);

    if (error) {
        throw new Error('Failed to delete client');
    }

    revalidatePath('/clients');

    return { success: true };
}
