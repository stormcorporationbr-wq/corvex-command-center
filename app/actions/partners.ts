'use server';

import { createServerClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

interface CreatePartnerData {
    name: string;
    category: string;
    partner_type: 'supplier' | 'integration' | 'network' | 'vendor';
    client_id?: string | null;
    email?: string;
    phone?: string;
    website?: string;
    contract_value?: number;
    contract_start_date?: string;
    contract_end_date?: string;
    integration_status?: string;
    notes?: string;
}

export async function createPartner(data: CreatePartnerData) {
    const supabase = createServerClient();

    // Validate: vendor type must have null client_id
    if (data.partner_type === 'vendor' && data.client_id) {
        return { success: false, error: 'Vendor partners cannot be assigned to a client' };
    }

    // Validate: non-vendor types must have client_id
    if (data.partner_type !== 'vendor' && !data.client_id) {
        return { success: false, error: 'Please select a client for this partner' };
    }

    const contactInfo: any = {};
    if (data.email) contactInfo.email = data.email;
    if (data.phone) contactInfo.phone = data.phone;
    if (data.notes) contactInfo.notes = data.notes;

    const { data: newPartner, error } = await supabase
        .from('partners')
        .insert([{
            name: data.name,
            category: data.category,
            partner_type: data.partner_type,
            client_id: data.client_id || null,
            contact_info: contactInfo,
            website: data.website || null,
            contract_value: data.contract_value || null,
            contract_start_date: data.contract_start_date || null,
            contract_end_date: data.contract_end_date || null,
            integration_status: data.integration_status || null,
            active: true,
        }])
        .select()
        .single();

    if (error) {
        console.error('Error creating partner:', error);
        return { success: false, error: 'Failed to create partner' };
    }

    revalidatePath('/partners');
    if (data.client_id) {
        revalidatePath(`/clients/${data.client_id}`);
    }

    return { success: true, partner: newPartner };
}

export async function togglePartnerStatus(partnerId: string, currentStatus: boolean) {
    const supabase = createServerClient();

    const { error } = await supabase
        .from('partners')
        .update({ active: !currentStatus })
        .eq('id', partnerId);

    if (error) {
        throw new Error('Failed to update partner status');
    }

    revalidatePath('/partners');

    return { success: true };
}

export async function deletePartner(partnerId: string) {
    const supabase = createServerClient();

    const { error } = await supabase
        .from('partners')
        .delete()
        .eq('id', partnerId);

    if (error) {
        throw new Error('Failed to delete partner');
    }

    revalidatePath('/partners');

    return { success: true };
}
