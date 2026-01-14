import { createServerClient } from "@/lib/supabase";
import Card from "@/components/ui/Card";
import ClientTable from "@/components/ClientTable";
import NewClientButton from "@/components/NewClientButton";

async function getClients() {
    const supabase = createServerClient();

    const { data: clients, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching clients:', error);
        return [];
    }

    return clients || [];
}

export default async function ClientsPage() {
    const clients = await getClients();

    return (
        <div className="space-y-8 pb-24 lg:pb-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-text-main via-primary/90 to-text-main bg-clip-text text-transparent mb-2">
                        Client Manager
                    </h1>
                    <p className="text-text-muted">
                        Manage all your clients and their subscriptions
                    </p>
                </div>

                <NewClientButton />
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
                    <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Total Clients</p>
                    <p className="text-2xl font-bold text-primary">{clients.length}</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20">
                    <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Active</p>
                    <p className="text-2xl font-bold text-cyan-400">
                        {clients.filter(c => c.status === 'active').length}
                    </p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-slate-500/10 to-transparent border border-slate-500/20">
                    <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Paused</p>
                    <p className="text-2xl font-bold text-slate-400">
                        {clients.filter(c => c.status === 'paused').length}
                    </p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500/10 to-transparent border border-indigo-500/20">
                    <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Platinum</p>
                    <p className="text-2xl font-bold text-indigo-400">
                        {clients.filter(c => c.tier === 'platinum').length}
                    </p>
                </div>
            </div>

            {/* Client Table with Search & Filters */}
            <ClientTable clients={clients} />
        </div>
    );
}
