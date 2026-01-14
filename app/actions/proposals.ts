'use server';

import { createServerClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { generateProposalPDF, replaceVariables } from "@/lib/pdf/proposalGenerator";

interface GenerateProposalData {
    clientName: string;
    businessType?: string;
    region: 'BR' | 'US' | 'EU';
    clientId?: string;
}

export async function generateProposal(data: GenerateProposalData) {
    const supabase = createServerClient();

    // Define pricing and config based on region
    const config = {
        BR: { currency: 'R$', setupFee: 497, monthlyFee: 97, language: 'pt-BR' as const, deliveryDays: 'até 3 dias' },
        US: { currency: '$', setupFee: 197, monthlyFee: 29, language: 'en' as const, deliveryDays: 'up to 3 days' },
        EU: { currency: '€', setupFee: 197, monthlyFee: 29, language: 'en' as const, deliveryDays: 'up to 3 days' }
    };

    const regionalConfig = config[data.region];

    // Generate PDF
    const doc = generateProposalPDF({
        clientName: data.clientName,
        businessType: data.businessType,
        region: data.region,
        language: regionalConfig.language,
        currency: regionalConfig.currency,
        setupFee: regionalConfig.setupFee,
        monthlyFee: regionalConfig.monthlyFee,
        deliveryDays: regionalConfig.deliveryDays
    });

    // Convert to base64 for reliable download
    const pdfBase64 = doc.output('datauristring');

    // Save to database
    const { data: proposal, error } = await supabase
        .from('proposals')
        .insert([{
            client_id: data.clientId || null,
            client_name: data.clientName,
            business_type: data.businessType,
            region: data.region,
            language: regionalConfig.language,
            currency: regionalConfig.currency,
            setup_fee: regionalConfig.setupFee,
            monthly_fee: regionalConfig.monthlyFee,
            delivery_days: regionalConfig.deliveryDays,
            status: 'draft'
        }])
        .select()
        .single();

    if (error) {
        console.error('Error saving proposal:', error);
    }

    revalidatePath('/sales');

    return {
        success: true,
        pdfData: pdfBase64,
        proposalId: proposal?.id
    };
}

export async function generatePitch(data: GenerateProposalData) {
    const supabase = createServerClient();

    // Get pitch template
    const language = data.region === 'BR' ? 'pt-BR' : 'en';

    const { data: template } = await supabase
        .from('templates')
        .select('content')
        .eq('type', 'pitch')
        .eq('language', language)
        .single();

    if (!template) {
        // Fallback template
        const pitchText = data.region === 'BR'
            ? `Olá ${data.clientName}!\n\nCriei um mockup visual do GWS App-Site para o seu ${data.businessType || 'negócio'}.\n\nÉ um portal que seus clientes acessam como se fosse um app, mas sem precisar baixar nada. Fica leve e rápido no celular.\n\nPreparei algumas imagens mostrando como ficaria. Posso te enviar?`
            : `Hi ${data.clientName}!\n\nI've created a visual mockup of a GWS App-Site for your ${data.businessType || 'business'}.\n\nIt's a portal your customers can access like an app, but without downloads. Fast and lightweight on any phone.\n\nI've prepared some preview images showing how it would look. Can I send them to you?`;

        return { success: true, pitchText };
    }

    // Replace variables
    const pitchText = replaceVariables(template.content, {
        CLIENT_NAME: data.clientName,
        BUSINESS_TYPE: data.businessType || (data.region === 'BR' ? 'negócio' : 'business')
    });

    return { success: true, pitchText };
}
