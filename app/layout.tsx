import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

export const metadata: Metadata = {
    title: "C0RVEX Command Center",
    description: "High-performance administrative PWA for GWS ecosystem",
    manifest: "/manifest.json",
    themeColor: "#0D0D0D",
    appleWebApp: {
        capable: true,
        statusBarStyle: "black-translucent",
        title: "C0RVEX",
    },
};

export const viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={inter.variable}>
            <body className="antialiased">
                <div className="flex min-h-screen">
                    {/* Sidebar - Floating on Desktop, Bottom Nav on Mobile */}
                    <Sidebar />

                    {/* Main Content */}
                    <main className="flex-1 overflow-y-auto scrollbar-thin">
                        <div className="container mx-auto p-4 lg:p-8 lg:pr-12">
                            {children}
                        </div>
                    </main>
                </div>
            </body>
        </html>
    );
}
