"use client";

import { useState, useTransition } from "react";
import { createPartner } from "@/app/actions/partners";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Client {
    id: string;
    name: string;
}

interface NewPartnerModalProps {
    isOpen: boolean;
    onClose: () => void;
    clients: Client[];
}

const PARTNER_TYPES = [
    { value: 'supplier', label: 'Supplier', description: 'Client vendor/supplier' },
    { value: 'integration', label: 'Integration', description: 'API or technical service' },
    { value: 'network', label: 'Network', description: 'Business network partner' },
    { value: 'vendor', label: 'Vendor', description: 'GWS own vendor (no client)' },
] as const;

const CATEGORIES = [
    'Technology', 'Marketing', 'Finance', 'Legal', 'Cloud Infrastructure',
    'Payment Processing', 'Logistics', 'Manufacturing', 'Consulting', 'Other'
];

export default function NewPartnerModal({ isOpen, onClose, clients }: NewPartnerModalProps) {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [partnerType, setPartnerType] = useState<'supplier' | 'integration' | 'network' | 'vendor'>('supplier');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name') as string,
            category: formData.get('category') as string,
            partner_type: partnerType,
            client_id: formData.get('client_id') as string || null,
            email: formData.get('email') as string || undefined,
            phone: formData.get('phone') as string || undefined,
            website: formData.get('website') as string || undefined,
            contract_value: formData.get('contract_value') ? parseFloat(formData.get('contract_value') as string) : undefined,
            contract_start_date: formData.get('contract_start_date') as string || undefined,
            contract_end_date: formData.get('contract_end_date') as string || undefined,
            integration_status: formData.get('integration_status') as string || undefined,
            notes: formData.get('notes') as string || undefined,
        };

        startTransition(async () => {
            const result = await createPartner(data);

            if (result.success) {
                setSuccess(true);
                setTimeout(() => {
                    onClose();
                    setSuccess(false);
                    setShowAdvanced(false);
                }, 1500);
            } else {
                setError(result.error || 'Failed to create partner');
            }
        });
    };

    if (!isOpen) return null;

    const isVendor = partnerType === 'vendor';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-thin glass-glow rounded-2xl border border-primary/20 p-6 shadow-2xl shadow-primary/20 animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-text-main to-primary bg-clip-text text-transparent">
                        New Partner
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-primary/10 transition-colors text-text-muted hover:text-primary"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Success Message */}
                {success && (
                    <div className="mb-4 p-4 rounded-xl bg-gradient-to-r from-cyan-500/20 to-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                        ✓ Partner created successfully!
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-4 rounded-xl bg-gradient-to-r from-red-500/20 to-red-500/10 border border-red-500/30 text-red-300">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Partner Type Selection */}
                    <div>
                        <label className="block text-text-muted text-sm mb-3">
                            Partner Type *
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {PARTNER_TYPES.map((type) => (
                                <button
                                    key={type.value}
                                    type="button"
                                    onClick={() => setPartnerType(type.value)}
                                    disabled={isPending}
                                    className={cn(
                                        "p-3 rounded-xl border transition-all text-left",
                                        partnerType === type.value
                                            ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                                            : "border-border/30 hover:border-primary/30 hover:bg-primary/5",
                                        "disabled:opacity-50"
                                    )}
                                >
                                    <p className="font-semibold text-sm text-text-main">{type.label}</p>
                                    <p className="text-xs text-text-muted mt-1">{type.description}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Client Selection (hidden for vendor) */}
                    {!isVendor && (
                        <div>
                            <label className="block text-text-muted text-sm mb-2">
                                Client *
                            </label>
                            <select
                                name="client_id"
                                required
                                disabled={isPending}
                                className="w-full px-4 py-3 bg-bg-surface border border-primary/10 rounded-xl outline-none text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all cursor-pointer disabled:opacity-50"
                            >
                                <option value="">Select a client...</option>
                                {clients.map((client) => (
                                    <option key={client.id} value={client.id}>
                                        {client.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Name */}
                    <div>
                        <label className="block text-text-muted text-sm mb-2">
                            Partner Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            required
                            disabled={isPending}
                            className="w-full px-4 py-3 bg-bg-surface border border-primary/10 rounded-xl outline-none text-text-main placeholder:text-text-muted focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all disabled:opacity-50"
                            placeholder="Google Cloud Platform"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-text-muted text-sm mb-2">
                            Category *
                        </label>
                        <select
                            name="category"
                            required
                            disabled={isPending}
                            className="w-full px-4 py-3 bg-bg-surface border border-primary/10 rounded-xl outline-none text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all cursor-pointer disabled:opacity-50"
                        >
                            <option value="">Select category...</option>
                            {CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    {/* Contact Info Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-text-muted text-sm mb-2">Email</label>
                            <input
                                type="email"
                                name="email"
                                disabled={isPending}
                                className="w-full px-4 py-3 bg-bg-surface border border-primary/10 rounded-xl outline-none text-text-main placeholder:text-text-muted focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all disabled:opacity-50"
                                placeholder="contact@partner.com"
                            />
                        </div>
                        <div>
                            <label className="block text-text-muted text-sm mb-2">Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                disabled={isPending}
                                className="w-full px-4 py-3 bg-bg-surface border border-primary/10 rounded-xl outline-none text-text-main placeholder:text-text-muted focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all disabled:opacity-50"
                                placeholder="+1 (555) 123-4567"
                            />
                        </div>
                    </div>

                    {/* Website */}
                    <div>
                        <label className="block text-text-muted text-sm mb-2">Website</label>
                        <input
                            type="url"
                            name="website"
                            disabled={isPending}
                            className="w-full px-4 py-3 bg-bg-surface border border-primary/10 rounded-xl outline-none text-text-main placeholder:text-text-muted focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all disabled:opacity-50"
                            placeholder="https://partner.com"
                        />
                    </div>

                    {/* Advanced Options Toggle */}
                    <button
                        type="button"
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-primary/10 hover:border-primary/20 bg-bg/50 hover:bg-primary/5 transition-all text-text-muted hover:text-primary"
                    >
                        <span className="text-sm font-medium">Advanced Options</span>
                        {showAdvanced ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>

                    {/* Advanced Section */}
                    {showAdvanced && (
                        <div className="space-y-4 p-4 rounded-xl border border-border/30 bg-bg/30">
                            {/* Contract Value */}
                            <div>
                                <label className="block text-text-muted text-sm mb-2">
                                    Contract Value (Monthly/Total)
                                </label>
                                <input
                                    type="number"
                                    name="contract_value"
                                    step="0.01"
                                    disabled={isPending}
                                    className="w-full px-4 py-3 bg-bg-surface border border-primary/10 rounded-xl outline-none text-text-main placeholder:text-text-muted focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all disabled:opacity-50"
                                    placeholder="1500.00"
                                />
                            </div>

                            {/* Contract Dates */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-text-muted text-sm mb-2">Start Date</label>
                                    <input
                                        type="date"
                                        name="contract_start_date"
                                        disabled={isPending}
                                        className="w-full px-4 py-3 bg-bg-surface border border-primary/10 rounded-xl outline-none text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all disabled:opacity-50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-text-muted text-sm mb-2">End Date</label>
                                    <input
                                        type="date"
                                        name="contract_end_date"
                                        disabled={isPending}
                                        className="w-full px-4 py-3 bg-bg-surface border border-primary/10 rounded-xl outline-none text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all disabled:opacity-50"
                                    />
                                </div>
                            </div>

                            {/* Integration Status (só para type integration) */}
                            {partnerType === 'integration' && (
                                <div>
                                    <label className="block text-text-muted text-sm mb-2">
                                        Integration Status
                                    </label>
                                    <select
                                        name="integration_status"
                                        disabled={isPending}
                                        className="w-full px-4 py-3 bg-bg-surface border border-primary/10 rounded-xl outline-none text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all cursor-pointer disabled:opacity-50"
                                    >
                                        <option value="">Not connected</option>
                                        <option value="connected">Connected</option>
                                        <option value="pending">Pending Setup</option>
                                        <option value="error">Error</option>
                                    </select>
                                </div>
                            )}

                            {/* Notes */}
                            <div>
                                <label className="block text-text-muted text-sm mb-2">Notes</label>
                                <textarea
                                    name="notes"
                                    disabled={isPending}
                                    rows={3}
                                    className="w-full px-4 py-3 bg-bg-surface border border-primary/10 rounded-xl outline-none text-text-main placeholder:text-text-muted focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all disabled:opacity-50 resize-none"
                                    placeholder="Additional information..."
                                />
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isPending}
                            className="flex-1 px-4 py-3 rounded-xl border border-border/30 text-text-main hover:bg-primary/5 transition-all disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-primary/80 to-primary text-bg font-medium shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
                        >
                            {isPending ? 'Creating...' : 'Create Partner'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
