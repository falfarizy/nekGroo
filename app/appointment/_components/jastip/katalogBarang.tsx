"use client"

import { useState } from "react"
import Image from "next/image"
import MinusIcon from "@/app/components/icons/minusIcon"
import PlusIcon from "@/app/components/icons/plusIcon"
import {
    DAFTAR_BARANG,
    KATEGORI_BARANG,
    formatRupiah,
} from "./_components/listBarang"

interface KatalogBarangProps {
    quantities: Record<string, number>
    onQuantityChange: (id: string, delta: number) => void
    onToggleSelect: (id: string) => void
}

export default function KatalogBarang({
    quantities,
    onQuantityChange,
    onToggleSelect,
}: KatalogBarangProps) {
    const [kategoriAktif, setKategoriAktif] = useState("Semua")

    const daftarBarang =
        kategoriAktif === "Semua"
            ? DAFTAR_BARANG
            : DAFTAR_BARANG.filter((barang) => barang.kategori === kategoriAktif)

    return (
        <div className="flex flex-col gap-4">
            <div
                role="group"
                aria-label="Filter kategori barang"
                className="flex flex-wrap gap-2"
            >
                {KATEGORI_BARANG.map((kategori) => {
                    const isActive = kategoriAktif === kategori

                    return (
                        <button
                            key={kategori}
                            type="button"
                            onClick={() => setKategoriAktif(kategori)}
                            aria-pressed={isActive}
                            className={`rounded-full border px-4 py-2 font-dmsans text-[12px] transition ${
                                isActive
                                    ? "border-green-800 bg-green-800 text-white"
                                    : "border-gray-200 bg-white text-[#737A70] hover:border-green-800 hover:text-green-800"
                            }`}
                        >
                            {kategori}
                        </button>
                    )
                })}
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {daftarBarang.map((barang) => {
                    const jumlah = quantities[barang.id] || 0
                    const isSelected = jumlah > 0
                    const isHabis = barang.stok === 0

                    return (
                        <div
                            key={barang.id}
                            className={`flex flex-col justify-between gap-3 rounded-[18px] border-2 p-3 sm:p-4 ${
                                isSelected
                                    ? "border-green-800 bg-[#EDF3E8]"
                                    : "border-gray-200 bg-white"
                            }`}
                        >
                            <button
                                type="button"
                                onClick={() => onToggleSelect(barang.id)}
                                disabled={isHabis}
                                aria-pressed={isSelected}
                                className="w-full text-left disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <div className="relative mb-3 aspect-[4/3] w-full overflow-hidden rounded-[12px] bg-[#F4F7F0]">
                                    <Image
                                        src={barang.gambar}
                                        alt={barang.nama}
                                        fill
                                        sizes="(max-width: 640px) 45vw, 220px"
                                        className="object-contain p-2"
                                    />
                                    {isSelected && (
                                        <span className="absolute right-2 top-2 rounded-full bg-green-800 px-2 py-0.5 font-dmsans text-[10px] text-white">
                                            Dipilih
                                        </span>
                                    )}
                                </div>

                                <h3 className="font-fraunces text-[15px] leading-5 text-[#233D31] sm:text-[18px]">
                                    {barang.nama}
                                </h3>
                                <p className="mt-1 font-dmsans text-[10px] text-[#737A70] sm:text-[12px]">
                                    {barang.kategori}
                                    {isHabis && " - Habis"}
                                </p>
                                <p className="mt-2 font-fraunces text-[17px] font-bold text-green-800 sm:text-[20px]">
                                    {formatRupiah(barang.harga)}
                                </p>
                            </button>

                            <div className="flex items-center justify-between gap-2">
                                <span className="font-dmsans text-[10px] text-[#737A70] sm:text-[12px]">
                                    {isSelected
                                        ? `Sisa ${barang.stok - jumlah}`
                                        : `Stok ${barang.stok}`}
                                </span>
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                    <button
                                        type="button"
                                        onClick={() => onQuantityChange(barang.id, -1)}
                                        disabled={jumlah === 0}
                                        aria-label={`Kurangi ${barang.nama}`}
                                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 [&_svg]:h-4 [&_svg]:w-4"
                                    >
                                        <MinusIcon />
                                    </button>
                                    <span className="w-5 text-center font-dmsans text-[13px] font-bold text-[#233D31]">
                                        {jumlah}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => onQuantityChange(barang.id, 1)}
                                        disabled={jumlah >= barang.stok}
                                        aria-label={`Tambah ${barang.nama}`}
                                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 [&_svg]:h-4 [&_svg]:w-4"
                                    >
                                        <PlusIcon />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
