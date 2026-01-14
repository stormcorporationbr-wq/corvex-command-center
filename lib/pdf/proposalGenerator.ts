import jsPDF from 'jspdf';

interface ProposalData {
    clientName: string;
    businessType?: string;
    region: 'BR' | 'US' | 'EU';
    language: 'pt-BR' | 'en' | 'es';
    currency: string;
    setupFee: number;
    monthlyFee: number;
    deliveryDays: string;
}

// Stealth Tech Colors
const colors = {
    bg: '#0D0D0D',
    primary: '#B9E2F5',
    accent: '#A0E9FF',
    text: '#E5E5E5',
    muted: '#6B7280',
    cardBg: '#1A1A1A',
    headerBg: '#151515'
};

export function generateProposalPDF(data: ProposalData): jsPDF {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;

    // Background
    doc.setFillColor(colors.bg);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Header background
    doc.setFillColor(colors.headerBg);
    doc.rect(0, 0, pageWidth, 40, 'F');

    // Logo/Title
    doc.setFontSize(32);
    doc.setTextColor(colors.primary);
    doc.setFont('helvetica', 'bold');
    doc.text('C0RVEX', pageWidth / 2, 20, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(colors.muted);
    doc.text('GWS Command Center', pageWidth / 2, 27, { align: 'center' });

    // Title
    let y = 50;
    doc.setFontSize(24);
    doc.setTextColor(colors.text);
    doc.setFont('helvetica', 'bold');

    const title = data.language === 'pt-BR'
        ? 'Proposta de Infraestrutura Digital'
        : 'Digital Infrastructure & Experience Proposal';

    doc.text(title, margin, y);
    y += 10;

    doc.setFontSize(16);
    doc.setTextColor(colors.primary);
    const forText = data.language === 'pt-BR' ? 'Para:' : 'For:';
    doc.text(`${forText} ${data.clientName}`, margin, y);
    y += 15;

    // Section 1: Challenge
    y = addSection(doc, y, margin, pageWidth, data.language === 'pt-BR' ? '1. O Desafio' : '1. The Challenge');
    doc.setFontSize(11);
    doc.setTextColor(colors.text);
    const challenge = data.language === 'pt-BR'
        ? 'O cliente moderno busca agilidade. Cardápios em PDF ou sites lentos fazem você perder vendas.'
        : 'In a globalized market, customers demand speed. Traditional PDFs or heavy apps create friction.';
    doc.text(doc.splitTextToSize(challenge, pageWidth - 2 * margin), margin + 5, y);
    y += 15;

    // Section 2: Solution
    y = addSection(doc, y, margin, pageWidth, data.language === 'pt-BR' ? '2. A Solução: GWS App-Site' : '2. The Solution: GWS App-Site');
    doc.setFontSize(11);
    doc.setTextColor(colors.text);
    const solution = data.language === 'pt-BR'
        ? 'Uma tecnologia que se comporta como aplicativo, mas é acessada instantaneamente. Não ocupa espaço no celular e não precisa baixar nada.'
        : 'A high-performance portal that behaves like a native app but requires zero downloads and zero storage space.';
    doc.text(doc.splitTextToSize(solution, pageWidth - 2 * margin), margin + 5, y);
    y += 20;

    // Section 3: 4 Pillars
    y = addSection(doc, y, margin, pageWidth, data.language === 'pt-BR' ? '3. Os 4 Pilares' : '3. The 4 Pillars');

    const pillars = data.language === 'pt-BR' ? [
        { title: 'Identidade Inteligente', desc: 'Wi-Fi, WhatsApp e Localização num toque' },
        { title: 'Vitrine Interativa', desc: 'Seu catálogo ou menu com visual de elite' },
        { title: 'Parceiros de Confiança', desc: 'Sua rede de indicações' },
        { title: 'Perfil do Negócio', desc: 'Sua história para gerar conexão real' }
    ] : [
        { title: 'Smart Identity', desc: 'Instant Wi-Fi, WhatsApp, and Location' },
        { title: 'Interactive Showcase', desc: 'Multilingual menu/catalog with premium visuals' },
        { title: 'Trusted Partners', desc: 'A verified network of your local recommendations' },
        { title: 'Business Legacy', desc: 'Your story and team to build trust' }
    ];

    pillars.forEach((pillar) => {
        // Card background
        doc.setFillColor(colors.cardBg);
        doc.roundedRect(margin, y - 5, pageWidth - 2 * margin, 15, 2, 2, 'F');

        // Bullet point
        doc.setFillColor(colors.primary);
        doc.circle(margin + 5, y, 1.5, 'F');

        doc.setFontSize(12);
        doc.setTextColor(colors.primary);
        doc.setFont('helvetica', 'bold');
        doc.text(pillar.title, margin + 10, y + 1);

        doc.setFontSize(10);
        doc.setTextColor(colors.muted);
        doc.setFont('helvetica', 'normal');
        doc.text(pillar.desc, margin + 10, y + 6);

        y += 20;
    });

    y += 5;

    // Section 4: Investment (Price Box)
    y = addSection(doc, y, margin, pageWidth, data.language === 'pt-BR' ? '4. Investimento' : '4. Investment');

    // Price card
    doc.setFillColor(colors.cardBg);
    doc.setDrawColor(colors.primary);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, y - 3, pageWidth - 2 * margin, 25, 3, 3, 'FD');

    doc.setFontSize(12);
    doc.setTextColor(colors.text);
    const setupLabel = data.language === 'pt-BR' ? 'Taxa de Ativação:' : 'Setup Fee:';
    const monthlyLabel = data.language === 'pt-BR' ? 'Manutenção:' : 'Maintenance:';

    doc.text(setupLabel, margin + 5, y + 5);
    doc.setTextColor(colors.primary);
    doc.setFont('helvetica', 'bold');
    doc.text(`${data.currency} ${data.setupFee.toFixed(2)}`, pageWidth - margin - 5, y + 5, { align: 'right' });

    doc.setTextColor(colors.text);
    doc.setFont('helvetica', 'normal');
    doc.text(`${monthlyLabel}`, margin + 5, y + 12);
    doc.setTextColor(colors.accent);
    doc.setFont('helvetica', 'bold');
    const perMonth = data.language === 'pt-BR' ? '/mês' : '/month';
    doc.text(`${data.currency} ${data.monthlyFee.toFixed(2)}${perMonth}`, pageWidth - margin - 5, y + 12, { align: 'right' });

    y += 30;

    // Section 5: Delivery
    y = addSection(doc, y, margin, pageWidth, data.language === 'pt-BR' ? '5. Entrega' : '5. Delivery');
    doc.setFontSize(11);
    doc.setTextColor(colors.text);
    const delivery = data.language === 'pt-BR'
        ? `${data.deliveryDays} para o Portal Digital + Placa Inteligente C0RVEX`
        : `${data.deliveryDays} for Digital Portal + GWS Smart Access Plate`;
    doc.text(doc.splitTextToSize(delivery, pageWidth - 2 * margin), margin + 5, y);

    y += 10;
    doc.setFontSize(9);
    doc.setTextColor(colors.muted);
    doc.setFont('helvetica', 'italic');
    const disclaimer = data.language === 'pt-BR'
        ? 'O prazo pode variar de acordo com a demanda e complexidade.'
        : 'Timeline may vary depending on demand and complexity.';
    doc.text(disclaimer, margin + 5, y);

    // Footer
    doc.setFillColor(colors.headerBg);
    doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');

    doc.setFontSize(8);
    doc.setTextColor(colors.muted);
    doc.text('C0RVEX Command Center • GWS Ecosystem', pageWidth / 2, pageHeight - 10, { align: 'center' });

    return doc;
}

function addSection(doc: jsPDF, y: number, margin: number, pageWidth: number, title: string): number {
    doc.setFontSize(14);
    doc.setTextColor(colors.primary);
    doc.setFont('helvetica', 'bold');
    doc.text(title, margin, y);

    // Underline
    doc.setDrawColor(colors.primary);
    doc.setLineWidth(0.3);
    doc.line(margin, y + 1, margin + doc.getTextWidth(title), y + 1);

    return y + 8;
}

export function replaceVariables(template: string, variables: Record<string, string>): string {
    let result = template;
    Object.entries(variables).forEach(([key, value]) => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        result = result.replace(regex, value);
    });
    return result;
}
