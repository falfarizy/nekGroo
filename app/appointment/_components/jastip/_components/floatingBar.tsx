"use client"

import { useState } from "react"
import { formatRupiah, type RingkasanJastip } from "./listBarang"

export default function FloatingBar({ ringkasan }: { ringkasan: RingkasanJastip }) {
    const [isOpen, setIsOpen] = useState(false)
    const { pesanan, totalBarang, totalHarga } = ringkasan

    return (
        <div className="pointer-events-none fixed inset-x-0 bottom-[100px] z-50 flex justify-center px-6">
            <div className="pointer-events-auto w-full max-w-md">
                {/* Panel rincian muncul ke atas saat bar diklik */}
                <div
                    id="rincian-titipan"
                    aria-hidden={!isOpen}
                    className={`overflow-hidden rounded-t-[20px] bg-white shadow-2xl transition-all duration-300 ease-out ${
                        isOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
                    }`}
                >
                    <div className="max-h-80 overflow-y-auto px-5 py-4">
                        <div className="mb-3 flex items-center justify-between gap-3">
                            <h2 className="font-fraunces text-[18px] text-[#233D31]">
                                Rincian Titipan
                            </h2>
                            <span className="font-dmsans text-[12px] text-[#737A70]">
                                {totalBarang} barang
                            </span>
                        </div>

                        {pesanan.length === 0 ? (
                            <p className="font-dmsans text-[13px] text-[#737A70]">
                                Belum ada barang yang dipilih.
                            </p>
                        ) : (
                            <ul className="flex flex-col gap-2">
                                {pesanan.map((item) => (
                                    <li
                                        key={item.id}
                                        className="flex items-start justify-between gap-3 border-b border-[#E4E5DA] pb-2 last:border-0 last:pb-0"
                                    >
                                        <div className="min-w-0">
                                            <p className="font-dmsans text-[13px] font-bold text-[#233D31]">
                                                {item.nama}
                                            </p>
                                            <p className="font-dmsans text-[12px] text-[#737A70]">
                                                {item.jumlah} x {formatRupiah(item.harga)}
                                            </p>
                                        </div>
                                        <span className="shrink-0 font-dmsans text-[13px] font-bold text-green-800">
                                            {formatRupiah(item.subtotal)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => setIsOpen((prev) => !prev)}
                    aria-expanded={isOpen}
                    aria-controls="rincian-titipan"
                    className={`flex w-full items-center justify-between gap-3 ${isOpen ? "rounded-b-[20px]" : "rounded-[20px]"} bg-green-800 px-5 py-4 text-white shadow-2xl transition hover:bg-green-900`}
                >
                    <span className="flex items-center gap-3">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.8}
                            className="h-5 w-5 shrink-0"
                            aria-hidden="true"
                        >
                            <path d="M6 8h12l1 12H5L6 8Z" strokeLinejoin="round" />
                            <path d="M9 8V6a3 3 0 0 1 6 0v2" strokeLinecap="round" />
                        </svg>
                        <span className="font-dmsans text-[13px]">Total titipan</span>
                    </span>

                    <span className="flex items-center gap-3">
                        <span className="rounded-full bg-white/20 px-2 py-0.5 font-dmsans text-[11px]">
                            {totalBarang} barang
                        </span>
                        <span className="font-dmsans text-[16px] font-bold">
                            {formatRupiah(totalHarga)}
                        </span>
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            className={`h-4 w-4 shrink-0 transition-transform duration-300 ${
                                isOpen ? "rotate-180" : ""
                            }`}
                            aria-hidden="true"
                        >
                            <path d="m6 15 6-6 6 6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </span>
                </button>
            </div>
        </div>
    )
}
