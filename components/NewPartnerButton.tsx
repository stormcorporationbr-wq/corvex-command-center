"use client";

import { useState } from "react";
import NewPartnerModal from "@/components/NewPartnerModal";
import { Plus } from "lucide-react";

interface Client {
    id: string;
    name: string;
}

interface NewPartnerButtonProps {
    clients: Client[];
}

export default function NewPartnerButton({ clients }: NewPartnerButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            {/* Desktop Button */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="hidden lg:flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary/80 to-primary text-bg rounded-xl font-medium shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all duration-300"
            >
                <Plus size={20} strokeWidth={2} />
                New Partner
            </button>

            {/* Mobile FAB */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="lg:hidden fixed bottom-20 right-4 w-14 h-14 bg-gradient-to-r from-primary/80 to-primary text-bg rounded-full shadow-2xl shadow-primary/40 flex items-center justify-center hover:scale-110 transition-all duration-300 z-40"
            >
                <Plus size={24} strokeWidth={2.5} />
            </button>

            {/* Modal */}
            <NewPartnerModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                clients={clients}
            />
        </>
    );
}
