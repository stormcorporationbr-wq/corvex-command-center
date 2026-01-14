"use client";

import { useState, useTransition } from "react";
import { generatePitch } from "@/app/actions/proposals";
import { generateProposalPDF } from "@/lib/pdf/proposalGenerator";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FileText, MessageSquare, Copy, Check, Download, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import Card from "@/components/ui/Card";

export default function SalesPage() {
    const [isPending, startTransition] = useTransition();
    const [clientName, setClientName] = useState("");
    const [businessType, setBusinessType] = useState("");
    const [region, setRegion] = useState<'BR' | 'US' | 'EU'>('BR');
    const [pitchText, setPitchText] = useState("");
    const [copied, setCopied] = useState(false);
    const [pdfGenerated, setPdfGenerated] = useState(false);

    const handleGeneratePitch = () => {
        if (!clientName) return;

        startTransition(async () => {
            const result = await generatePitch({
                clientName,
                businessType,
                region
            });

            if (result.success) {
                setPitchText(result.pitchText!);
            }
        });
    };

    const handleGenerateProposal = () => {
        if (!clientName) return;

        // Regional config
        const config = {
            BR: { currency: 'R$', setupFee: 497, monthlyFee: 97, language: 'pt-BR' as const, deliveryDays: 'até 3 dias' },
            US: { currency: '$', setupFee: 197, monthlyFee: 29, language: 'en' as const, deliveryDays: 'up to 3 days' },
            EU: { currency: '€', setupFee: 197, monthlyFee: 29, language: 'en' as const, deliveryDays: 'up to 3 days' }
        };

        const regionalConfig = config[region];

        // Generate PDF directly on client (most reliable method)
        const doc = generateProposalPDF({
            clientName,
            businessType,
            region,
            language: regionalConfig.language,
            currency: regionalConfig.currency,
            setupFee: regionalConfig.setupFee,
            monthlyFee: regionalConfig.monthlyFee,
            deliveryDays: regionalConfig.deliveryDays
        });

        // Use jsPDF's native save() method - guaranteed to work
        const fileName = `Proposta_${clientName.replace(/ /g, '_')}_${Date.now()}.pdf`;
        doc.save(fileName);

        setPdfGenerated(true);
        setTimeout(() => setPdfGenerated(false), 3000);
    };

    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-8 pb-24 lg:pb-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-text-main via-primary/90 to-text-main bg-clip-text text-transparent mb-2 flex items-center gap-3">
                        <Zap className="text-primary" size={36} />
                        GWS Sales Engine
                    </h1>
                    <p className="text-text-muted">
                        Generate professional proposals and pitch texts instantly
                    </p>
                </div>
            </div>

            {/* Success Messages */}
            {pdfGenerated && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-500/20 to-cyan-500/10 border border-cyan-500/30 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <Download className="text-cyan-400" size={20} />
                    <span className="text-cyan-300 font-medium">PDF proposal downloaded successfully!</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input Form */}
                <Card className="border-primary/10 bg-gradient-to-br from-bg-surface to-bg">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center">
                            <FileText className="text-primary" size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-text-main">Client Information</h2>
                    </div>

                    <div className="space-y-4">
                        {/* Client Name */}
                        <div>
                            <label className="block text-text-muted text-sm mb-2">Client Name *</label>
                            <input
                                type="text"
                                value={clientName}
                                onChange={(e) => setClientName(e.target.value)}
                                disabled={isPending}
                                className="w-full px-4 py-3 bg-bg border border-primary/10 rounded-xl outline-none text-text-main placeholder:text-text-muted focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all disabled:opacity-50"
                                placeholder="Acme Restaurant"
                            />
                        </div>

                        {/* Business Type */}
                        <div>
                            <label className="block text-text-muted text-sm mb-2">Business Type</label>
                            <select
                                value={businessType}
                                onChange={(e) => setBusinessType(e.target.value)}
                                disabled={isPending}
                                className="w-full px-4 py-3 bg-bg border border-primary/10 rounded-xl outline-none text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all cursor-pointer disabled:opacity-50"
                            >
                                <option value="">Select type...</option>
                                <option value="Restaurante">Restaurante</option>
                                <option value="Hotel">Hotel</option>
                                <option value="Café">Café</option>
                                <option value="Bar">Bar</option>
                                <option value="Loja">Loja</option>
                                <option value="Restaurant">Restaurant</option>
                                <option value="Cafe">Cafe</option>
                                <option value="Store">Store</option>
                            </select>
                        </div>

                        {/* Region Selection */}
                        <div>
                            <label className="block text-text-muted text-sm mb-3">Region *</label>
                            <div className="grid grid-cols-3 gap-3">
                                {(['BR', 'US', 'EU'] as const).map((r) => (
                                    <button
                                        key={r}
                                        type="button"
                                        onClick={() => setRegion(r)}
                                        disabled={isPending}
                                        className={cn(
                                            "p-3 rounded-xl border transition-all",
                                            region === r
                                                ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                                                : "border-border/30 hover:border-primary/30 hover:bg-primary/5",
                                            "disabled:opacity-50"
                                        )}
                                    >
                                        <p className="font-semibold text-sm text-text-main">
                                            {r === 'BR' ? '🇧🇷 Brasil' : r === 'US' ? '🇺🇸 USA' : '🇪🇺 Europe'}
                                        </p>
                                        <p className="text-xs text-text-muted mt-1">
                                            {r === 'BR' ? 'R$ 497 | R$ 97/mês' : '$ 197 | $ 29/mo'}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-4 space-y-3">
                            <button
                                onClick={handleGenerateProposal}
                                disabled={!clientName || isPending}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-primary/80 to-primary text-bg rounded-xl font-medium shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
                            >
                                <FileText size={20} />
                                {isPending ? 'Generating...' : 'Generate Proposal PDF'}
                            </button>

                            <button
                                onClick={handleGeneratePitch}
                                disabled={!clientName || isPending}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-primary/30 text-primary rounded-xl font-medium hover:bg-primary/10 transition-all disabled:opacity-50"
                            >
                                <MessageSquare size={20} />
                                Generate Pitch Text
                            </button>
                        </div>
                    </div>
                </Card>

                {/* Pitch Preview */}
                <Card className="border-primary/10 bg-gradient-to-br from-bg-surface to-bg">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center">
                                <MessageSquare className="text-primary" size={20} />
                            </div>
                            <h2 className="text-xl font-bold text-text-main">Pitch Preview</h2>
                        </div>

                        {pitchText && (
                            <CopyToClipboard text={pitchText} onCopy={handleCopy}>
                                <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-primary/30 text-primary hover:bg-primary/10 transition-all text-sm">
                                    {copied ? <Check size={16} /> : <Copy size={16} />}
                                    {copied ? 'Copied!' : 'Copy'}
                                </button>
                            </CopyToClipboard>
                        )}
                    </div>

                    {pitchText ? (
                        <div className="p-4 rounded-xl bg-bg/50 border border-border/30">
                            <pre className="whitespace-pre-wrap text-text-main text-sm font-sans leading-relaxed">
                                {pitchText}
                            </pre>
                            <div className="mt-4 pt-4 border-t border-border/30">
                                <p className="text-xs text-text-muted italic">
                                    💡 Tip: Send this text along with mockup images for better engagement
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <MessageSquare className="mx-auto text-text-muted mb-4" size={48} opacity={0.5} />
                            <p className="text-text-muted text-lg mb-1">No pitch generated yet</p>
                            <p className="text-text-dark text-sm">Fill in the form and click "Generate Pitch Text"</p>
                        </div>
                    )}
                </Card>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-primary/10 bg-gradient-to-br from-bg-surface to-bg p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                            <Zap className="text-cyan-400" size={16} />
                        </div>
                        <h3 className="font-semibold text-text-main">Instant Generation</h3>
                    </div>
                    <p className="text-sm text-text-muted">
                        PDF proposals generated in seconds with Stealth Tech design
                    </p>
                </Card>

                <Card className="border-primary/10 bg-gradient-to-br from-bg-surface to-bg p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                            <FileText className="text-indigo-400" size={16} />
                        </div>
                        <h3 className="font-semibold text-text-main">Multi-Language</h3>
                    </div>
                    <p className="text-sm text-text-muted">
                        Automatic translation for BR, US, and EU markets
                    </p>
                </Card>

                <Card className="border-primary/10 bg-gradient-to-br from-bg-surface to-bg p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                            <MessageSquare className="text-amber-400" size={16} />
                        </div>
                        <h3 className="font-semibold text-text-main">Visual-First Pitch</h3>
                    </div>
                    <p className="text-sm text-text-muted">
                        Build trust with mockups before sending links
                    </p>
                </Card>
            </div>
        </div>
    );
}
