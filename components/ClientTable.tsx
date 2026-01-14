"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import ClientStatusToggle from "@/components/ClientStatusToggle";
import { Building2, MapPin, Crown, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

interface Client {
    id: string;
    name: string;
    slug: string;
    country: string;
    status: 'active' | 'paused';
    billing_type: 'unique' | 'recurring';
    tier: 'gold' | 'platinum';
}

interface ClientTableProps {
    clients: Client[];
}

export default function ClientTable({ clients }: ClientTableProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'paused'>('all');
    const [tierFilter, setTierFilter] = useState<'all' | 'gold' | 'platinum'>('all');

    // Filter clients based on search and filters
    const filteredClients = useMemo(() => {
        return clients.filter(client => {
            const matchesSearch =
                client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                client.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
                client.country.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
            const matchesTier = tierFilter === 'all' || client.tier === tierFilter;

            return matchesSearch && matchesStatus && matchesTier;
        });
    }, [clients, searchQuery, statusFilter, tierFilter]);

    return (
        <div className="space-y-6">
            {/* Search & Filters */}
            <div className="flex flex-col lg:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name, country, or slug..."
                        className="w-full px-4 py-3 bg-bg-surface border border-primary/10 rounded-xl outline-none text-text-main placeholder:text-text-muted focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all duration-200"
                    />
                </div>

                {/* Status Filter */}
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="px-4 py-3 bg-bg-surface border border-primary/10 rounded-xl outline-none text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all duration-200 cursor-pointer"
                >
                    <option value="all">All Status</option>
                    <option value="active">Active Only</option>
                    <option value="paused">Paused Only</option>
                </select>

                {/* Tier Filter */}
                <select
                    value={tierFilter}
                    onChange={(e) => setTierFilter(e.target.value as any)}
                    className="px-4 py-3 bg-bg-surface border border-primary/10 rounded-xl outline-none text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all duration-200 cursor-pointer"
                >
                    <option value="all">All Tiers</option>
                    <option value="platinum">Platinum</option>
                    <option value="gold">Gold</option>
                </select>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between text-sm">
                <p className="text-text-muted">
                    Showing <span className="text-primary font-semibold">{filteredClients.length}</span> of <span className="font-semibold">{clients.length}</span> clients
                </p>
                {searchQuery && (
                    <button
                        onClick={() => {
                            setSearchQuery("");
                            setStatusFilter('all');
                            setTierFilter('all');
                        }}
                        className="text-primary hover:text-primary/80 transition-colors"
                    >
                        Clear filters
                    </button>
                )}
            </div>

            {/* Clients Table */}
            <div className="border border-primary/10 bg-gradient-to-br from-bg-surface to-bg rounded-2xl shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border/50 bg-bg/50">
                                <th className="text-left p-4 text-text-muted text-xs uppercase tracking-wider font-semibold">
                                    Client
                                </th>
                                <th className="text-left p-4 text-text-muted text-xs uppercase tracking-wider font-semibold">
                                    Location
                                </th>
                                <th className="text-left p-4 text-text-muted text-xs uppercase tracking-wider font-semibold">
                                    Tier
                                </th>
                                <th className="text-left p-4 text-text-muted text-xs uppercase tracking-wider font-semibold">
                                    Billing
                                </th>
                                <th className="text-left p-4 text-text-muted text-xs uppercase tracking-wider font-semibold">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredClients.map((client) => (
                                <tr key={client.id}>
                                    <Link href={`/clients/${client.id}`} className={cn(
                                        "contents group cursor-pointer"
                                    )}>
                                        {/* Client Name & Slug */}
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "w-10 h-10 rounded-xl flex items-center justify-center",
                                                    "bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20",
                                                    "group-hover:shadow-lg group-hover:shadow-primary/30 transition-all duration-300"
                                                )}>
                                                    <Building2 className="text-primary" size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-text-main group-hover:text-primary transition-colors">
                                                        {client.name}
                                                    </p>
                                                    <p className="text-xs text-text-muted">
                                                        /{client.slug}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Location */}
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 text-text-muted">
                                                <MapPin size={14} />
                                                <span className="text-sm">{client.country}</span>
                                            </div>
                                        </td>

                                        {/* Tier */}
                                        <td className="p-4">
                                            {client.tier === 'platinum' ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500/20 to-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-medium">
                                                    <Crown size={12} />
                                                    Platinum
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium">
                                                    <Crown size={12} />
                                                    Gold
                                                </span>
                                            )}
                                        </td>

                                        {/* Billing Type */}
                                        <td className="p-4">
                                            {client.billing_type === 'recurring' ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium">
                                                    <CreditCard size={12} />
                                                    Recurring
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-border/20 border border-border/30 text-text-muted text-xs font-medium">
                                                    <CreditCard size={12} />
                                                    Unique
                                                </span>
                                            )}
                                        </td>

                                        {/* Status Toggle */}
                                    </Link>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                                            <ClientStatusToggle
                                                clientId={client.id}
                                                currentStatus={client.status}
                                                clientName={client.name}
                                            />
                                            <span className={cn(
                                                "text-xs font-medium",
                                                client.status === 'active' ? "text-cyan-400" : "text-slate-400"
                                            )}>
                                                {client.status === 'active' ? 'Active' : 'Paused'}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredClients.length === 0 && (
                    <div className="text-center py-12">
                        <Building2 className="mx-auto text-text-muted mb-4" size={48} />
                        <p className="text-text-muted text-lg mb-1">No clients found</p>
                        <p className="text-text-dark text-sm">Try adjusting your search or filters</p>
                    </div>
                )}
            </div>
        </div>
    );
}
