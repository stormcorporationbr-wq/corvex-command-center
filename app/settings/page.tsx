"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import {
    Settings as SettingsIcon,
    User,
    Bell,
    Palette,
    Globe,
    Database,
    Shield,
    Save,
    CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
    const [saved, setSaved] = useState(false);
    const [settings, setSettings] = useState({
        // Account
        organizationName: "GWS Admin",
        email: "admin@gws.com",
        timezone: "America/Sao_Paulo",

        // Notifications
        emailNotifications: true,
        clientUpdates: true,
        partnerAlerts: false,
        systemAlerts: true,

        // Appearance
        compactMode: false,
        showAnimations: true,

        // Data
        autoBackup: true,
        backupFrequency: "daily",
    });

    const handleSave = () => {
        // Simular salvamento
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="space-y-8 pb-24 lg:pb-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-text-main via-primary/90 to-text-main bg-clip-text text-transparent mb-2">
                        Settings
                    </h1>
                    <p className="text-text-muted">
                        Manage your account and application preferences
                    </p>
                </div>
            </div>

            {/* Save Success Message */}
            {saved && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-500/20 to-cyan-500/10 border border-cyan-500/30 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <CheckCircle2 className="text-cyan-400" size={20} />
                    <span className="text-cyan-300 font-medium">Settings saved successfully!</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Account Settings */}
                <Card className="border-primary/10 bg-gradient-to-br from-bg-surface to-bg">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center">
                            <User className="text-primary" size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-text-main">Account</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-text-muted text-sm mb-2">Organization Name</label>
                            <input
                                type="text"
                                value={settings.organizationName}
                                onChange={(e) => setSettings({ ...settings, organizationName: e.target.value })}
                                className="w-full px-4 py-3 bg-bg border border-primary/10 rounded-xl outline-none text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-text-muted text-sm mb-2">Email</label>
                            <input
                                type="email"
                                value={settings.email}
                                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                                className="w-full px-4 py-3 bg-bg border border-primary/10 rounded-xl outline-none text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-text-muted text-sm mb-2">Timezone</label>
                            <select
                                value={settings.timezone}
                                onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                                className="w-full px-4 py-3 bg-bg border border-primary/10 rounded-xl outline-none text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all cursor-pointer"
                            >
                                <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
                                <option value="America/New_York">New York (GMT-5)</option>
                                <option value="Europe/London">London (GMT+0)</option>
                                <option value="Asia/Tokyo">Tokyo (GMT+9)</option>
                            </select>
                        </div>
                    </div>
                </Card>

                {/* Notification Settings */}
                <Card className="border-primary/10 bg-gradient-to-br from-bg-surface to-bg">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center">
                            <Bell className="text-primary" size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-text-main">Notifications</h2>
                    </div>

                    <div className="space-y-4">
                        <ToggleRow
                            label="Email Notifications"
                            description="Receive notifications via email"
                            checked={settings.emailNotifications}
                            onChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                        />

                        <ToggleRow
                            label="Client Updates"
                            description="Notify when clients are updated"
                            checked={settings.clientUpdates}
                            onChange={(checked) => setSettings({ ...settings, clientUpdates: checked })}
                        />

                        <ToggleRow
                            label="Partner Alerts"
                            description="Alerts for partner status changes"
                            checked={settings.partnerAlerts}
                            onChange={(checked) => setSettings({ ...settings, partnerAlerts: checked })}
                        />

                        <ToggleRow
                            label="System Alerts"
                            description="Critical system notifications"
                            checked={settings.systemAlerts}
                            onChange={(checked) => setSettings({ ...settings, systemAlerts: checked })}
                        />
                    </div>
                </Card>

                {/* Appearance */}
                <Card className="border-primary/10 bg-gradient-to-br from-bg-surface to-bg">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center">
                            <Palette className="text-primary" size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-text-main">Appearance</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-text-muted text-sm mb-3">Theme</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button className="p-4 rounded-xl border border-primary bg-primary/10 text-left transition-all">
                                    <div className="w-full h-12 rounded-lg bg-gradient-to-br from-bg to-bg-surface border border-border/30 mb-2" />
                                    <p className="text-sm font-medium text-primary">Dark (Active)</p>
                                </button>
                                <button className="p-4 rounded-xl border border-border/30 hover:border-primary/30 text-left transition-all opacity-50 cursor-not-allowed">
                                    <div className="w-full h-12 rounded-lg bg-white border border-gray-300 mb-2" />
                                    <p className="text-sm font-medium text-text-muted">Light (Soon)</p>
                                </button>
                            </div>
                        </div>

                        <ToggleRow
                            label="Compact Mode"
                            description="Reduce spacing for denser layout"
                            checked={settings.compactMode}
                            onChange={(checked) => setSettings({ ...settings, compactMode: checked })}
                        />

                        <ToggleRow
                            label="Animations"
                            description="Show smooth transitions and effects"
                            checked={settings.showAnimations}
                            onChange={(checked) => setSettings({ ...settings, showAnimations: checked })}
                        />
                    </div>
                </Card>

                {/* Data & Backup */}
                <Card className="border-primary/10 bg-gradient-to-br from-bg-surface to-bg">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center">
                            <Database className="text-primary" size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-text-main">Data & Backup</h2>
                    </div>

                    <div className="space-y-4">
                        <ToggleRow
                            label="Auto Backup"
                            description="Automatically backup your data"
                            checked={settings.autoBackup}
                            onChange={(checked) => setSettings({ ...settings, autoBackup: checked })}
                        />

                        <div>
                            <label className="block text-text-muted text-sm mb-2">Backup Frequency</label>
                            <select
                                value={settings.backupFrequency}
                                onChange={(e) => setSettings({ ...settings, backupFrequency: e.target.value })}
                                disabled={!settings.autoBackup}
                                className="w-full px-4 py-3 bg-bg border border-primary/10 rounded-xl outline-none text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all cursor-pointer disabled:opacity-50"
                            >
                                <option value="hourly">Every Hour</option>
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                            </select>
                        </div>

                        <button className="w-full px-4 py-3 rounded-xl border border-border/30 hover:border-primary/30 hover:bg-primary/5 text-text-main transition-all">
                            Export All Data
                        </button>
                    </div>
                </Card>
            </div>

            {/* System Info */}
            <Card className="border-primary/10 bg-gradient-to-br from-bg-surface to-bg">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center">
                        <Shield className="text-primary" size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-text-main">System Information</h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <InfoCard label="Version" value="1.0.0" />
                    <InfoCard label="Database" value="Supabase" />
                    <InfoCard label="Framework" value="Next.js 14" />
                    <InfoCard label="Region" value="US East" />
                </div>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary/80 to-primary text-bg rounded-xl font-medium shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all duration-300"
                >
                    <Save size={20} />
                    Save Changes
                </button>
            </div>
        </div>
    );
}

// Toggle Row Component
function ToggleRow({
    label,
    description,
    checked,
    onChange
}: {
    label: string;
    description: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}) {
    return (
        <div className="flex items-center justify-between py-2">
            <div className="flex-1">
                <p className="text-sm font-medium text-text-main">{label}</p>
                <p className="text-xs text-text-muted mt-0.5">{description}</p>
            </div>
            <button
                onClick={() => onChange(!checked)}
                className={cn(
                    "relative w-12 h-6 rounded-full transition-all duration-300",
                    checked ? "bg-primary" : "bg-border"
                )}
            >
                <div className={cn(
                    "absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all duration-300 shadow-lg",
                    checked ? "left-6" : "left-0.5"
                )} />
            </button>
        </div>
    );
}

// Info Card Component
function InfoCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="p-3 rounded-lg bg-bg/50 border border-border/30">
            <p className="text-xs text-text-muted mb-1">{label}</p>
            <p className="text-sm font-semibold text-text-main">{value}</p>
        </div>
    );
}
