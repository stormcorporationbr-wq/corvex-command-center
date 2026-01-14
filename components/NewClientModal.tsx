"use client";

import { useState, useTransition } from "react";
import { createClient } from "@/app/actions/clients";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface NewClientModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function NewClientModal({ isOpen, onClose }: NewClientModalProps) {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [showMoreDetails, setShowMoreDetails] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name') as string,
            slug: formData.get('slug') as string,
            email: formData.get('email') as string,
            country: formData.get('country') as string,
            tier: formData.get('tier') as 'gold' | 'platinum',
            billing_type: formData.get('billing_type') as 'unique' | 'recurring',
            // Optional fields
            phone: formData.get('phone') as string | null,
            website: formData.get('website') as string | null,
            industry: formData.get('industry') as string | null,
            company_size: formData.get('company_size') as string | null,
            contact_name: formData.get('contact_name') as string | null,
            contact_email: formData.get('contact_email') as string | null,
            notes: formData.get('notes') as string | null,
        };

        startTransition(async () => {
            const result = await createClient(data);

            if (result.success) {
                setSuccess(true);
                setTimeout(() => {
                    onClose();
                    setSuccess(false);
                    setShowMoreDetails(false);
                }, 1500);
            } else {
                setError(result.error || 'Failed to create client');
            }
        });
    };

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    };

    if (!isOpen) return null;

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
                        New Client
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
                        ✓ Client created successfully!
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
                    {/* Essential Information */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Essential Information</h3>

                        {/* Name */}
                        <div>
                            <label className="block text-text-muted text-sm mb-2">
                                Client Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                required
                                disabled={isPending}
                                onChange={(e) => {
                                    const slugInput = document.querySelector('input[name="slug"]') as HTMLInputElement;
                                    if (slugInput && !slugInput.value) {
                                        slugInput.value = generateSlug(e.target.value);
                                    }
                                }}
                                className="w-full px-4 py-3 bg-bg-surface border border-primary/10 rounded-xl outline-none text-text-main placeholder:text-text-muted focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all disabled:opacity-50"
                                placeholder="Acme Corporation"
                            />
                        </div>

                        {/* Slug */}
                        <div>
                            <label className="block text-text-muted text-sm mb-2">
                                Slug * <span className="text-text-dark text-xs">(URL-friendly identifier)</span>
                            </label>
                            <input
                                type="text"
                                name="slug"
                                required
                                disabled={isPending}
                                pattern="[a-z0-9-]+"
                                className="w-full px-4 py-3 bg-bg-surface border border-primary/10 rounded-xl outline-none text-text-main placeholder:text-text-muted focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all disabled:opacity-50"
                                placeholder="acme-corporation"
                            />
                            <p className="text-xs text-text-dark mt-1">Only lowercase letters, numbers, and hyphens</p>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-text-muted text-sm mb-2">
                                Email *
                            </label>
                            <input
                                type="email"
                                name="email"
                                required
                                disabled={isPending}
                                className="w-full px-4 py-3 bg-bg-surface border border-primary/10 rounded-xl outline-none text-text-main placeholder:text-text-muted focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all disabled:opacity-50"
                                placeholder="contact@acme.com"
                            />
                        </div>

                        {/* Country */}
                        <div>
                            <label className="block text-text-muted text-sm mb-2">
                                Country *
                            </label>
                            <input
                                type="text"
                                name="country"
                                required
                                disabled={isPending}
                                className="w-full px-4 py-3 bg-bg-surface border border-primary/10 rounded-xl outline-none text-text-main placeholder:text-text-muted focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all disabled:opacity-50"
                                placeholder="United States"
                            />
                        </div>

                        {/* Row: Tier + Billing */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Tier */}
                            <div>
                                <label className="block text-text-muted text-sm mb-2">
                                    Tier *
                                </label>
                                <select
                                    name="tier"
                                    required
                                    disabled={isPending}
                                    className="w-full px-4 py-3 bg-bg-surface border border-primary/10 rounded-xl outline-none text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all cursor-pointer disabled:opacity-50"
                                >
                                    <option value="gold">Gold</option>
                                    <option value="platinum">Platinum</option>
                                </select>
                            </div>

                            {/* Billing Type */}
                            <div>
                                <label className="block text-text-muted text-sm mb-2">
                                    Billing *
                                </label>
                                <select
                                    name="billing_type"
                                    required
                                    disabled={isPending}
                                    className="w-full px-4 py-3 bg-bg-surface border border-primary/10 rounded-xl outline-none text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all cursor-pointer disabled:opacity-50"
                                >
                                    <option value="recurring">Recurring</option>
                                    <option value="unique">Unique</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* More Details Toggle */}
                    <button
                        type="button"
                        onClick={() => setShowMoreDetails(!showMoreDetails)}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-primary/10 hover:border-primary/20 bg-bg/50 hover:bg-primary/5 transition-all text-text-muted hover:text-primary"
                    >
                        <span className="text-sm font-medium">More Details (Optional)</span>
                        {showMoreDetails ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>

                    {/* More Details Section */}
                    {showMoreDetails && (
                        <div className="space-y-4 p-4 rounded-xl border border-border/30 bg-bg/30">
                            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Additional Information</h3>

                            {/* Phone */}
                            <div>
                                <label className="block text-text-muted text-sm mb-2">
                                    Phone
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    disabled={isPending}
                                    className="w-full px-4 py-3 bg-bg-surface border border-primary/10 rounded-xl outline-none text-text-main placeholder:text-text-muted focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all disabled:opacity-50"
                                    placeholder="+1 (555) 123-4567"
                                />
                            </div>

                            {/* Website */}
                            <div>
                                <label className="block text-text-muted text-sm mb-2">
                                    Website
                                </label>
                                <input
                                    type="url"
                                    name="website"
                                    disabled={isPending}
                                    className="w-full px-4 py-3 bg-bg-surface border border-primary/10 rounded-xl outline-none text-text-main placeholder:text-text-muted focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all disabled:opacity-50"
                                    placeholder="https://acme.com"
                                />
                            </div>

                            {/* Industry & Company Size Row */}
                            <div className="grid grid-cols-2 gap-4">
                                {/* Industry */}
                                <div>
                                    <label className="block text-text-muted text-sm mb-2">
                                        Industry
                                    </label>
                                    <select
                                        name="industry"
                                        disabled={isPending}
                                        className="w-full px-4 py-3 bg-bg-surface border border-primary/10 rounded-xl outline-none text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all cursor-pointer disabled:opacity-50"
                                    >
                                        <option value="">Select...</option>
                                        <option value="Technology">Technology</option>
                                        <option value="Finance">Finance</option>
                                        <option value="Healthcare">Healthcare</option>
                                        <option value="Retail">Retail</option>
                                        <option value="Manufacturing">Manufacturing</option>
                                        <option value="Education">Education</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                {/* Company Size */}
                                <div>
                                    <label className="block text-text-muted text-sm mb-2">
                                        Company Size
                                    </label>
                                    <select
                                        name="company_size"
                                        disabled={isPending}
                                        className="w-full px-4 py-3 bg-bg-surface border border-primary/10 rounded-xl outline-none text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all cursor-pointer disabled:opacity-50"
                                    >
                                        <option value="">Select...</option>
                                        <option value="1-10">1-10 employees</option>
                                        <option value="11-50">11-50 employees</option>
                                        <option value="51-200">51-200 employees</option>
                                        <option value="201-500">201-500 employees</option>
                                        <option value="500+">500+ employees</option>
                                    </select>
                                </div>
                            </div>

                            {/* Contact Person Section */}
                            <div className="pt-2">
                                <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Contact Person</h4>

                                {/* Contact Name */}
                                <div className="mb-3">
                                    <label className="block text-text-muted text-sm mb-2">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        name="contact_name"
                                        disabled={isPending}
                                        className="w-full px-4 py-3 bg-bg-surface border border-primary/10 rounded-xl outline-none text-text-main placeholder:text-text-muted focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all disabled:opacity-50"
                                        placeholder="John Doe"
                                    />
                                </div>

                                {/* Contact Email */}
                                <div>
                                    <label className="block text-text-muted text-sm mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="contact_email"
                                        disabled={isPending}
                                        className="w-full px-4 py-3 bg-bg-surface border border-primary/10 rounded-xl outline-none text-text-main placeholder:text-text-muted focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all disabled:opacity-50"
                                        placeholder="john.doe@acme.com"
                                    />
                                </div>
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-text-muted text-sm mb-2">
                                    Notes
                                </label>
                                <textarea
                                    name="notes"
                                    disabled={isPending}
                                    rows={3}
                                    className="w-full px-4 py-3 bg-bg-surface border border-primary/10 rounded-xl outline-none text-text-main placeholder:text-text-muted focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all disabled:opacity-50 resize-none"
                                    placeholder="Internal notes about this client..."
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
                            {isPending ? 'Creating...' : 'Create Client'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
