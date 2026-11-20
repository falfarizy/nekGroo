"use client"
import { useState } from "react"
import Card from "./card"
import { SERVICES } from "./formK/listServices"


interface CardsLayoutProps {
    quantities: Record<string, number>;
    canAdd: boolean;
    onQuantityChange: (id: string, delta: number) => void;
    onToggleSelect: (id: string) => void;
}

export default function CardsLayout({quantities, canAdd, onQuantityChange, onToggleSelect}:CardsLayoutProps) {
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
                    canAdd={canAdd}
                    onQuantityChange={onQuantityChange}
                    onToggleSelect={onToggleSelect}
                />
            ))}
        </div>
    )
}