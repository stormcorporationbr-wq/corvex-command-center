import { createServerClient } from "@/lib/supabase";
import Card from "@/components/ui/Card";
import NewPartnerButton from "@/components/NewPartnerButton";
import { Handshake, Search, Plus, Building2, Mail, Phone, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

async function getClients() {
    const supabase = createServerClient();
    const { data } = await supabase
        .from('clients')
        .select('id, name')
        .eq('status', 'active')
        .order('name');
    return data || [];
}

async function getPartnersWithClients() {
    const supabase = createServerClient();

    const { data: partners, error } = await supabase
        .from('partners')
        .select(`
      *,
      clients:client_id (
        id,
        name,
        slug
      )
    `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching partners:', error);
        return [];
    }

    return partners || [];
}

export default async function PartnersPage() {
    const partners = await getPartnersWithClients();
    const clients = await getClients();

    // Calculate stats
    const activePartners = partners.filter(p => p.active).length;
    const categories = [...new Set(partners.map(p => p.category))].length;

    return (
        <div className="space-y-8 pb-24 lg:pb-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-text-main via-primary/90 to-text-main bg-clip-text text-transparent mb-2">
                        Partner Management
                    </h1>
                    <p className="text-text-muted">
                        Manage partnerships across all clients
                    </p>
                </div>

                <NewPartnerButton clients={clients} />
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
                    <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Total Partners</p>
                    <p className="text-2xl font-bold text-primary">{partners.length}</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20">
                    <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Active</p>
                    <p className="text-2xl font-bold text-cyan-400">{activePartners}</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500/10 to-transparent border border-indigo-500/20">
                    <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Categories</p>
                    <p className="text-2xl font-bold text-indigo-400">{categories}</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20">
                    <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Avg per Client</p>
                    <p className="text-2xl font-bold text-amber-400">
                        {partners.length > 0 ? Math.round(partners.length / categories) : 0}
                    </p>
                </div>
            </div>

            {/* Search Bar */}
            <Card className="border-primary/10 bg-gradient-to-br from-bg-surface to-bg">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                    <input
                        type="text"
                        placeholder="Search partners by name, category, or client..."
                        className="w-full pl-12 pr-4 py-3 bg-transparent border-none outline-none text-text-main placeholder:text-text-muted focus:ring-2 focus:ring-primary/20 rounded-lg"
                    />
                </div>
            </Card>

            {/* Partners Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {partners.map((partner) => {
                    const client = partner.clients as any;
                    const contactInfo = partner.contact_info as any;

                    return (
                        <Card
                            key={partner.id}
                            className="border-primary/10 bg-gradient-to-br from-bg-surface to-bg hover:border-primary/30 transition-all duration-300 group hover:scale-105"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-primary/30 transition-all">
                                        <Handshake className="text-primary" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-text-main group-hover:text-primary transition-colors">
                                            {partner.name}
                                        </h3>
                                        <p className="text-sm text-text-muted">{partner.category}</p>
                                    </div>
                                </div>

                                {partner.active ? (
                                    <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 text-xs font-medium">
                                        <CheckCircle2 size={12} />
                                        Active
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-500/10 text-slate-400 text-xs font-medium">
                                        <XCircle size={12} />
                                        Inactive
                                    </span>
                                )}
                            </div>

                            {/* Client Info */}
                            {client && (
                                <Link
                                    href={`/clients/${client.id}`}
                                    className="flex items-center gap-2 mb-3 p-2 rounded-lg bg-bg/50 hover:bg-primary/5 transition-colors"
                                >
                                    <Building2 size={14} className="text-text-muted" />
                                    <span className="text-sm text-text-main">{client.name}</span>
                                </Link>
                            )}

                            {/* Contact Info */}
                            {contactInfo && (
                                <div className="space-y-2 text-xs">
                                    {contactInfo.email && (
                                        <div className="flex items-center gap-2 text-text-dark">
                                            <Mail size={12} />
                                            <a href={`mailto:${contactInfo.email}`} className="hover:text-primary transition-colors">
                                                {contactInfo.email}
                                            </a>
                                        </div>
                                    )}
                                    {contactInfo.phone && (
                                        <div className="flex items-center gap-2 text-text-dark">
                                            <Phone size={12} />
                                            <a href={`tel:${contactInfo.phone}`} className="hover:text-primary transition-colors">
                                                {contactInfo.phone}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            )}
                        </Card>
                    );
                })}
            </div>

            {partners.length === 0 && (
                <Card className="border-primary/10 bg-gradient-to-br from-bg-surface to-bg">
                    <div className="text-center py-12">
                        <Handshake className="mx-auto text-text-muted mb-4" size={48} opacity={0.5} />
                        <p className="text-text-muted text-lg mb-1">No partners found</p>
                        <p className="text-text-dark text-sm mb-4">Get started by adding your first partner</p>
                        <button className="px-6 py-3 bg-gradient-to-r from-primary/80 to-primary text-bg rounded-xl font-medium shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all duration-300">
                            <Plus size={20} strokeWidth={2} className="inline mr-2" />
                            Add Partner
                        </button>
                    </div>
                </Card>
            )}
        </div>
    );
}
