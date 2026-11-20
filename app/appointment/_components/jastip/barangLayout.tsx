"use client"

import FloatingBar from "./_components/floatingBar"
import { buatRingkasan } from "./_components/listBarang"
import KatalogBarang from "./katalogBarang"

interface BarangLayoutProps {
    quantities: Record<string, number>
    onQuantityChange: (id: string, delta: number) => void
    onToggleSelect: (id: string) => void
}

export default function BarangLayout({
    quantities,
    onQuantityChange,
    onToggleSelect,
}: BarangLayoutProps) {
    const ringkasan = buatRingkasan(quantities)

    return (
        <div className="flex flex-col gap-6 px-6 py-8 pb-8">
            <div className="flex flex-col gap-2">
                <h1 className="font-fraunces text-[30px] text-[#233D31]">Jasa Titip</h1>
                <p className="font-dmsans text-[14px] leading-6 text-[#737A70]">
                    Klik barang untuk memilih, lalu atur jumlahnya dengan tombol tambah dan kurang.
                    Stok yang tersedia menjadi batas maksimal pesanan.
                </p>
            </div>

            <KatalogBarang
                quantities={quantities}
                onQuantityChange={onQuantityChange}
                onToggleSelect={onToggleSelect}
            />

            <FloatingBar ringkasan={ringkasan} />
        </div>
    )
}
