"use client"

import { formatRupiah } from "../jastip/_components/listBarang"

export interface RincianDiskon {
    kode: string
    nominal: number
}

type Voucher = { tipe: "persen" | "nominal"; nilai: number }

// Sementara: dukung beberapa kode voucher sederhana.
const DAFTAR_VOUCHER: Record<string, Voucher> = {
    NEKGROO10: { tipe: "persen", nilai: 10 },
    HEMAT5000: { tipe: "nominal", nilai: 40000 },
}

export type StatusVoucher = "kosong" | "valid" | "tidak-valid" | "duplikat"

function normalisasiKode(raw: string): string {
    return raw.trim().toUpperCase()
}

function cariVoucher(raw: string): { kode: string; voucher: Voucher } | null {
    const kode = normalisasiKode(raw)
    const voucher = DAFTAR_VOUCHER[kode]
    return voucher ? { kode, voucher } : null
}

// Cek satu kode: kosong, tidak dikenal, atau terdaftar di DAFTAR_VOUCHER.
export function cekVoucher(raw: string): StatusVoucher {
    const kode = normalisasiKode(raw)
    if (!kode) return "kosong"
    return cariVoucher(kode) ? "valid" : "tidak-valid"
}

// Cek seluruh kode sekaligus agar kode yang sama tidak dihitung dua kali.
export function statusSemuaVoucher(vouchers: string[]): StatusVoucher[] {
    const seen = new Set<string>()

    return vouchers.map((raw) => {
        const status = cekVoucher(raw)
        if (status !== "valid") return status

        const kode = normalisasiKode(raw)
        if (seen.has(kode)) return "duplikat"

        seen.add(kode)
        return "valid"
    })
}

export function rincianDiskonVoucher(vouchers: string[], subtotal: number): RincianDiskon[] {
    const statuses = statusSemuaVoucher(vouchers)
    const hasil: RincianDiskon[] = []

    vouchers.forEach((raw, index) => {
        if (statuses[index] !== "valid") return

        const ditemukan = cariVoucher(raw)
        if (!ditemukan) return

        const { kode, voucher } = ditemukan
        const nominal =
            voucher.tipe === "persen"
                ? Math.floor((subtotal * voucher.nilai) / 100)
                : voucher.nilai

        hasil.push({ kode, nominal })
    })

    return hasil
}

export function hitungDiskonVoucher(vouchers: string[], subtotal: number): number {
    const total = rincianDiskonVoucher(vouchers, subtotal).reduce(
        (acc, item) => acc + item.nominal,
        0
    )
    return Math.min(total, subtotal)
}

const PESAN_STATUS: Record<StatusVoucher, string> = {
    kosong: "",
    valid: "Kode voucher valid",
    "tidak-valid": "Kode voucher tidak valid",
    duplikat: "Kode voucher sudah dipakai",
}

const WARNA_INPUT: Record<StatusVoucher, string> = {
    kosong: "border-[#E4E5DA] focus:border-green-800",
    valid: "border-green-600 focus:border-green-800",
    "tidak-valid": "border-red-400 focus:border-red-500",
    duplikat: "border-amber-400 focus:border-amber-500",
}

const WARNA_PESAN: Record<StatusVoucher, string> = {
    kosong: "",
    valid: "text-green-700",
    "tidak-valid": "text-red-600",
    duplikat: "text-amber-600",
}

interface VoucherInputProps {
    values: string[]
    onChange: (values: string[]) => void
    subtotal?: number
}

export default function VoucherInput({ values, onChange, subtotal }: VoucherInputProps) {
    const statuses = statusSemuaVoucher(values)

    const update = (index: number, value: string) => {
        const next = [...values]
        next[index] = value
        onChange(next)
    }

    const add = () => onChange([...values, ""])

    const remove = (index: number) => {
        const next = values.filter((_, i) => i !== index)
        onChange(next.length ? next : [""])
    }

    return (
        <div className="flex flex-col gap-3">
            <h2 className="font-fraunces text-[18px] text-[#233D31]">Kode Voucher</h2>
            <div className="flex flex-col gap-2">
                {values.map((value, index) => {
                    const status = statuses[index]
                    const nominal =
                        status === "valid"
                            ? rincianDiskonVoucher([value], subtotal ?? 0)[0]?.nominal ?? 0
                            : 0

                    return (
                        <div key={index} className="flex flex-col gap-1">
                            <div className="flex gap-2">
                                <input
                                    id={`voucher-${index}`}
                                    type="text"
                                    value={value}
                                    onChange={(e) => update(index, e.target.value)}
                                    placeholder="Masukkan kode voucher"
                                    aria-invalid={status === "tidak-valid" || status === "duplikat"}
                                    aria-describedby={
                                        status === "kosong" ? undefined : `voucher-status-${index}`
                                    }
                                    className={`flex-1 rounded-[10px] border px-4 py-2 font-dmsans text-[13px] text-[#233D31] outline-none ${WARNA_INPUT[status]}`}
                                />
                                {values.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="rounded-[10px] border border-[#E4E5DA] px-3 font-dmsans text-[13px] text-[#737A70] hover:bg-[#F5F5F0]"
                                    >
                                        Hapus
                                    </button>
                                )}
                            </div>
                            {status !== "kosong" && (
                                <p
                                    id={`voucher-status-${index}`}
                                    className={`font-dmsans text-[11px] ${WARNA_PESAN[status]}`}
                                >
                                    {PESAN_STATUS[status]}
                                    {status === "valid" && nominal > 0
                                        ? ` - potongan ${formatRupiah(nominal)}`
                                        : ""}
                                </p>
                            )}
                        </div>
                    )
                })}
            </div>
            <button
                type="button"
                onClick={add}
                className="self-start font-dmsans text-[13px] font-bold text-green-800 hover:underline"
            >
                + Tambah voucher
            </button>
        </div>
    )
}
