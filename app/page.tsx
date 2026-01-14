import { createServerClient } from "@/lib/supabase";
import Card from "@/components/ui/Card";
import { Users, DollarSign, AlertCircle, TrendingUp } from "lucide-react";

async function getDashboardStats() {
    const supabase = createServerClient();

    // Get total active clients
    const { count: activeClients } = await supabase
        .from("clients")
        .select("*", { count: "exact", head: true })
        .eq("status", "active");

    // Get total clients
    const { count: totalClients } = await supabase
        .from("clients")
        .select("*", { count: "exact", head: true });

    // Get clients with recurring billing (for MRR estimation)
    const { count: recurringClients } = await supabase
        .from("clients")
        .select("*", { count: "exact", head: true })
        .eq("billing_type", "recurring")
        .eq("status", "active");

    // Estimate MRR (simplified - $500 average per recurring client)
    const estimatedMRR = (recurringClients || 0) * 500;

    return {
        activeClients: activeClients || 0,
        totalClients: totalClients || 0,
        estimatedMRR,
        alerts: 0, // Placeholder for future alerts system
    };
}

export default async function DashboardPage() {
    const stats = await getDashboardStats();

    const kpis = [
        {
            title: "Active Clients",
            value: stats.activeClients,
            subtitle: `${stats.totalClients} total`,
            icon: Users,
            trend: "+12%",
        },
        {
            title: "Estimated MRR",
            value: `$${stats.estimatedMRR.toLocaleString()}`,
            subtitle: "Monthly Recurring Revenue",
            icon: DollarSign,
            trend: "+8%",
        },
        {
            title: "System Alerts",
            value: stats.alerts,
            subtitle: "No critical issues",
            icon: AlertCircle,
            trend: "0",
        },
        {
            title: "Growth Rate",
            value: "15%",
            subtitle: "Last 30 days",
            icon: TrendingUp,
            trend: "+3%",
        },
    ];

    return (
        <div className="space-y-8 pb-24 lg:pb-8">
            {/* Header with Gradient */}
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent rounded-2xl blur-3xl -z-10" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-text-main via-primary/90 to-text-main bg-clip-text text-transparent mb-2">
                    Dashboard
                </h1>
                <p className="text-text-muted">
                    Welcome to C0RVEX Command Center
                </p>
            </div>

            {/* KPI Cards Grid - 2026 Style */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpis.map((kpi) => {
                    const Icon = kpi.icon;
                    return (
                        <Card
                            key={kpi.title}
                            className="relative group hover:scale-105 transition-all duration-300 bg-gradient-to-br from-bg-surface via-bg-surface to-bg border border-primary/10 hover:border-primary/30 shadow-xl hover:shadow-2xl hover:shadow-primary/20 overflow-hidden"
                        >
                            {/* Animated gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            {/* Corner accent */}
                            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full opacity-50" />

                            <div className="relative z-10">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <p className="text-text-muted text-sm mb-2 font-medium uppercase tracking-wider">{kpi.title}</p>
                                        <h3 className="text-3xl lg:text-4xl font-bold mb-1 bg-gradient-to-r from-text-main to-primary bg-clip-text text-transparent">
                                            {kpi.value}
                                        </h3>
                                        <p className="text-text-dark text-xs">{kpi.subtitle}</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 group-hover:shadow-lg group-hover:shadow-primary/40 transition-all duration-300 group-hover:scale-110">
                                        <Icon className="text-primary" size={24} strokeWidth={1.5} />
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 pt-3 border-t border-primary/10">
                                    <div className="flex items-center gap-1">
                                        <span className="text-primary text-sm font-bold">
                                            {kpi.trend}
                                        </span>
                                        <svg className="w-4 h-4 text-primary animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                        </svg>
                                    </div>
                                    <span className="text-text-muted text-xs">vs last month</span>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Recent Activity Section - Enhanced */}
            <Card className="border-primary/10 bg-gradient-to-br from-bg-surface to-bg shadow-xl">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-text-main">
                        Recent Activity
                    </h2>
                    <span className="text-xs text-text-muted bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                        Live
                    </span>
                </div>
                <div className="space-y-3">
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-primary/5 to-transparent border border-primary/10 hover:border-primary/20 transition-all duration-300 hover:scale-[1.02]">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-lg shadow-primary/50"></div>
                        <div className="flex-1">
                            <p className="text-text-main text-sm font-medium">New client onboarded</p>
                            <p className="text-text-muted text-xs">2 hours ago</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-primary/5 to-transparent border border-primary/10 hover:border-primary/20 transition-all duration-300 hover:scale-[1.02]">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-lg shadow-primary/50"></div>
                        <div className="flex-1">
                            <p className="text-text-main text-sm font-medium">Service configuration updated</p>
                            <p className="text-text-muted text-xs">5 hours ago</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-border/20 to-transparent border border-border/30 hover:border-border/50 transition-all duration-300 hover:scale-[1.02]">
                        <div className="w-2 h-2 bg-border rounded-full"></div>
                        <div className="flex-1">
                            <p className="text-text-main text-sm font-medium">Partner added to client</p>
                            <p className="text-text-muted text-xs">1 day ago</p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
