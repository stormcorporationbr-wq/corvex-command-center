import { createServerClient } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import Card from "@/components/ui/Card";
import {
    ArrowLeft,
    Building2,
    MapPin,
    Crown,
    CreditCard,
    Calendar,
    Package,
    Handshake,
    Mail,
    Phone,
    CheckCircle2,
    XCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";

async function getClientDetails(id: string) {
    const supabase = createServerClient();

    // Get client data
    const { data: client, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single();

    if (clientError || !client) {
        return null;
    }

    // Get client's services
    const { data: services } = await supabase
        .from('services')
        .select('*')
        .eq('client_id', id);

    // Get client's partners
    const { data: partners } = await supabase
        .from('partners')
        .select('*')
        .eq('client_id', id);

    return {
        client,
        services: services || [],
        partners: partners || [],
    };
}

export default async function ClientDetailPage({
    params
}: {
    params: { id: string }
}) {
    const data = await getClientDetails(params.id);

    if (!data) {
        notFound();
    }

    const { client, services, partners } = data;

    return (
        <div className="space-y-8 pb-24 lg:pb-8">
            {/* Back Button */}
            <Link
                href="/clients"
                className="inline-flex items-center gap-2 text-text-muted hover:text-primary transition-colors group"
            >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                <span>Back to Clients</span>
            </Link>

            {/* Header with Status Badge */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center shadow-lg shadow-primary/20">
                        <Building2 className="text-primary" size={32} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-text-main via-primary/90 to-text-main bg-clip-text text-transparent mb-2">
                            {client.name}
                        </h1>
                        <p className="text-text-muted text-lg">/{client.slug}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {client.status === 'active' ? (
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-medium">
                            <CheckCircle2 size={18} />
                            Active
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-slate-500/20 to-slate-500/10 border border-slate-500/30 text-slate-300 font-medium">
                            <XCircle size={18} />
                            Paused
                        </span>
                    )}
                </div>
            </div>

            {/* Client Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Location */}
                <Card className="border-primary/10 bg-gradient-to-br from-bg-surface to-bg">
                    <div className="flex items-center gap-3 mb-2">
                        <MapPin className="text-primary" size={20} />
                        <p className="text-text-muted text-sm">Location</p>
                    </div>
                    <p className="text-xl font-semibold text-text-main">{client.country}</p>
                </Card>

                {/* Tier */}
                <Card className="border-primary/10 bg-gradient-to-br from-bg-surface to-bg">
                    <div className="flex items-center gap-3 mb-2">
                        <Crown className="text-primary" size={20} />
                        <p className="text-text-muted text-sm">Tier</p>
                    </div>
                    <p className={cn(
                        "text-xl font-semibold capitalize",
                        client.tier === 'platinum' ? "text-indigo-300" : "text-amber-300"
                    )}>
                        {client.tier}
                    </p>
                </Card>

                {/* Billing */}
                <Card className="border-primary/10 bg-gradient-to-br from-bg-surface to-bg">
                    <div className="flex items-center gap-3 mb-2">
                        <CreditCard className="text-primary" size={20} />
                        <p className="text-text-muted text-sm">Billing Type</p>
                    </div>
                    <p className="text-xl font-semibold text-text-main capitalize">{client.billing_type}</p>
                </Card>

                {/* Created */}
                <Card className="border-primary/10 bg-gradient-to-br from-bg-surface to-bg">
                    <div className="flex items-center gap-3 mb-2">
                        <Calendar className="text-primary" size={20} />
                        <p className="text-text-muted text-sm">Client Since</p>
                    </div>
                    <p className="text-xl font-semibold text-text-main">
                        {formatDate(client.created_at)}
                    </p>
                </Card>
            </div>

            {/* Services Section */}
            <Card className="border-primary/10 bg-gradient-to-br from-bg-surface to-bg shadow-xl">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Package className="text-primary" size={24} />
                        <h2 className="text-2xl font-bold text-text-main">Services</h2>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                        {services.length} active
                    </span>
                </div>

                {services.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {services.map((service) => (
                            <div
                                key={service.id}
                                className="p-4 rounded-xl bg-bg/50 border border-border/30 hover:border-primary/30 transition-all duration-200"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <p className="font-semibold text-text-main text-lg">{service.type}</p>
                                        <p className="text-text-muted text-xs mt-1">
                                            Created {formatDate(service.created_at)}
                                        </p>
                                    </div>
                                    {service.active ? (
                                        <span className="px-2 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium">
                                            Active
                                        </span>
                                    ) : (
                                        <span className="px-2 py-1 rounded-lg bg-border/20 text-text-muted text-xs font-medium">
                                            Inactive
                                        </span>
                                    )}
                                </div>
                                {service.config && Object.keys(service.config).length > 0 && (
                                    <div className="text-xs text-text-dark">
                                        <code className="bg-bg px-2 py-1 rounded">
                                            {JSON.stringify(service.config)}
                                        </code>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-text-muted">
                        <Package className="mx-auto mb-2" size={32} opacity={0.5} />
                        <p>No services configured</p>
                    </div>
                )}
            </Card>

            {/* Partners Section */}
            <Card className="border-primary/10 bg-gradient-to-br from-bg-surface to-bg shadow-xl">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Handshake className="text-primary" size={24} />
                        <h2 className="text-2xl font-bold text-text-main">Partners</h2>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                        {partners.length} total
                    </span>
                </div>

                {partners.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {partners.map((partner) => (
                            <div
                                key={partner.id}
                                className="p-4 rounded-xl bg-bg/50 border border-border/30 hover:border-primary/30 transition-all duration-200"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <p className="font-semibold text-text-main">{partner.name}</p>
                                        <p className="text-text-muted text-sm">{partner.category}</p>
                                    </div>
                                    {partner.active && (
                                        <span className="w-2 h-2 bg-primary rounded-full mt-2"></span>
                                    )}
                                </div>

                                {partner.contact_info && (
                                    <div className="space-y-1 text-xs">
                                        {(partner.contact_info as any).email && (
                                            <div className="flex items-center gap-2 text-text-dark">
                                                <Mail size={12} />
                                                <span>{(partner.contact_info as any).email}</span>
                                            </div>
                                        )}
                                        {(partner.contact_info as any).phone && (
                                            <div className="flex items-center gap-2 text-text-dark">
                                                <Phone size={12} />
                                                <span>{(partner.contact_info as any).phone}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-text-muted">
                        <Handshake className="mx-auto mb-2" size={32} opacity={0.5} />
                        <p>No partners added</p>
                    </div>
                )}
            </Card>
        </div>
    );
}
