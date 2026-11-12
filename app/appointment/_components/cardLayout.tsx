"use client"
import { useState } from "react"
import Card from "./card"
import { SERVICES } from "./listServices"


interface CardsLayoutProps {
    quantities: Record<string, number>;
    onQuantityChange: (id: string, delta: number) => void;
    onToggleSelect: (id: string) => void;
}

export default function CardsLayout({quantities, onQuantityChange, onToggleSelect}:CardsLayoutProps) {
    return (
        <div className="flex flex-col gap-6">
            {SERVICES.map((items) => (
                <Card 
                    key={items.id}
                    id={items.id}
                    paket={items.paket}
                    harga={items.harga}
                    layanan={items.layanan}
                    jumlah={quantities[items.id] || 0}
                    onQuantityChange={onQuantityChange}
                    onToggleSelect={onToggleSelect}
                />
            ))}
        </div>
    )
}