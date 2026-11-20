"use client"

import { useState } from "react"
import { formatLongDate } from "../jadwal/calendar/utils"
import {
    CatForm,
    CustomerForm,
    SERVICES,
    hargaAngka,
    hargaKitten,
} from "../formK/listServices"
import { RingkasanJastip, formatRupiah } from "../jastip/_components/listBarang"
import { capitalizeEachWord } from "../format"
import VoucherInput, { hitungDiskonVoucher, rincianDiskonVoucher } from "./voucher"

interface ConfirmAkhirProps {
    selectedDate: string | null
    customer: CustomerForm
    cats: CatForm[]
    jastip: RingkasanJastip | null
}

function InfoRow({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex justify-between gap-4">
            <span className="shrink-0 font-dmsans text-[12px] text-[#737A70]">{label}</span>
            <span className="text-right font-dmsans text-[13px] wrap-break-words text-[#233D31]">{capitalizeEachWord(value || "-")}</span>
        </div>
    )
}

export default function ConfirmAkhir({
    selectedDate,
    customer,
    cats,
    jastip,
}: ConfirmAkhirProps) {
    const [vouchers, setVouchers] = useState<string[]>([""])

    const catRows = cats.map((cat, index) => {
        const service = SERVICES.find((item) => item.id === cat.selectedServiceId)
        const price = service
            ? hargaAngka(cat.age === "Kitten" ? hargaKitten(service.harga) : service.harga)
            : 0

        return {
            cat,
            index,
            serviceName: service?.paket ?? "Layanan tidak dipilih",
            priceLabel: service ? formatRupiah(price) : "-",
            price,
        }
    })

    const groomingTotal = catRows.reduce((acc, row) => acc + row.price, 0)
    const jastipItems = jastip?.pesanan ?? []
    const jastipTotal = jastip?.totalHarga ?? 0
    const subtotal = groomingTotal + jastipTotal
    const rincianDiskon = rincianDiskonVoucher(vouchers, subtotal)
    const totalDiskon = hitungDiskonVoucher(vouchers, subtotal)
    const totalPembayaran = subtotal - totalDiskon

    // 

    return (
        <div className="flex flex-col px-6 py-8">
            <div className="flex flex-col gap-6 rounded-[18px] bg-white px-6 py-8">
                <div className="flex flex-col gap-2">
                    <h1 className="font-fraunces text-[30px] text-[#233D31]">Konfirmasi Appointment</h1>
                    <p className="font-dmsans text-[14px] leading-6 text-[#737A70]">
                        Periksa kembali seluruh data sebelum melanjutkan ke pembayaran.
                    </p>
                </div>


                {/* Data customer */}
                <div className="flex flex-col gap-3">
                    <h2 className="font-fraunces text-[18px] text-[#233D31]">Data Pemesanan</h2>
                    <InfoRow label="Nama" value={customer.name} />
                    <InfoRow label="Nomor Telepon" value={customer.phone} />
                    <InfoRow label="Alamat" value={customer.alamat} />
                </div>

                <hr className="border-[0.5px] border-[#E4E5DA]" />

                {/* Jadwal */}
                <div className="flex flex-col gap-2">
                    <h2 className="font-fraunces text-[18px] text-[#233D31]">Jadwal Booking</h2>
                    <div className="flex flex-col rounded-[10px] bg-[#EDF3E8] px-4 py-4 text-[#2E6847]">
                        <span className="font-dmsans text-[13px] font-bold">
                            {selectedDate ? formatLongDate(selectedDate) : "Belum dipilih"}
                        </span>
                        <span className="font-dmsans text-[12px]">Si meong siap dijemput</span>
                    </div>
                </div>

                <hr className="border-[0.5px] border-[#E4E5DA]" />

                {/* Data kucing */}
                <div className="flex flex-col gap-3">
                    <h2 className="font-fraunces text-[18px] text-[#233D31]">{`Data Kucing (${catRows.length})`}</h2>
                    {catRows.length === 0 ? (
                        <p className="font-dmsans text-[13px] text-[#737A70]">Belum ada data kucing.</p>
                    ) : (
                        catRows.map(({ cat, index, serviceName, priceLabel }) => (
                            <div key={index} className="rounded-xl border border-[#E4E5DA] px-4 py-3">
                                <p className="font-dmsans text-[13px] font-bold text-[#233D31]">
                                    Meong {index + 1} - {capitalizeEachWord(cat.name || "-")}
                                </p>
                                <div className="mt-2 flex flex-col gap-1.5">
                                    <InfoRow label="Ras" value={cat.ras} />
                                    <InfoRow label="Umur" value={cat.age} />
                                    <InfoRow label="Jenis Kelamin" value={cat.gender} />
                                    <InfoRow label="Layanan" value={serviceName} />
                                    <InfoRow label="Harga" value={priceLabel} />
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <hr className="border-[0.5px] border-[#E4E5DA]" />

                {/* Jasa titip */}
                <div className="flex flex-col gap-3">
                    <h2 className="font-fraunces text-[18px] text-[#233D31]">Jasa Titip</h2>
                    {jastipItems.length === 0 ? (
                        <p className="font-dmsans text-[13px] text-[#737A70]">Tidak ada titipan.</p>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {jastipItems.map((item) => (
                                <div key={item.id} className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="font-dmsans text-[13px] font-bold text-[#233D31]">{capitalizeEachWord(item.nama)}</p>
                                        <p className="font-dmsans text-[12px] text-[#737A70]">
                                            {item.jumlah} x {formatRupiah(item.harga)}
                                        </p>
                                    </div>
                                    <span className="shrink-0 font-dmsans text-[13px] font-bold text-green-800">
                                        {formatRupiah(item.subtotal)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <hr className="border-[0.5px] border-[#E4E5DA]" />

                {/* Voucher Diskon */}
                <VoucherInput values={vouchers} onChange={setVouchers} subtotal={subtotal} />

                <hr className="border-[0.5px] border-[#E4E5DA]" />


                {/* Rincian harga */}
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between gap-3">
                        <span className="font-dmsans text-[12px] text-[#737A70]">
                            Grooming ({catRows.length} kucing)
                        </span>
                        <span className="font-dmsans text-[13px] text-[#233D31]">{formatRupiah(groomingTotal)}</span>
                    </div>
                    <div className="flex justify-between gap-3">
                        <span className="font-dmsans text-[12px] text-[#737A70]">
                            Jasa titip ({jastip?.totalBarang ?? 0} barang)
                        </span>
                        <span className="font-dmsans text-[13px] text-[#233D31]">{formatRupiah(jastipTotal)}</span>
                    </div>
                    <div className="flex justify-between gap-3">
                        <span className="font-dmsans text-[12px] font-bold text-[#233D31]">Subtotal</span>
                        <span className="font-dmsans text-[13px] font-bold text-[#233D31]">{formatRupiah(subtotal)}</span>
                    </div>

                    {totalDiskon > 0 && (
                        <>
                            <div className="flex justify-between gap-3">
                                <span className="font-dmsans text-[12px] font-bold text-green-800">Total potongan harga</span>
                                <span className="font-dmsans text-[13px] font-bold text-green-800">
                                    {formatRupiah(totalDiskon)}
                                </span>
                            </div>
                            <p className="text-right font-dmsans text-[11px] text-[#737A70]">
                                {rincianDiskon
                                    .map((item) => `${item.kode} (${formatRupiah(item.nominal)})`)
                                    .join(", ")}
                            </p>
                        </>
                    )}
                </div>

                <hr className="border-[0.5px] border-[#E4E5DA]" />

                
                {/* Total */}
                <div className="flex items-center justify-between gap-3">
                    <span className="font-dmsans text-[12px] text-[#737A70]">Total Pembayaran</span>
                    <span className="font-dmsans text-[23px] font-bold text-[#233D31]">
                        {formatRupiah(totalPembayaran)}
                    </span>
                </div>

                {/* Button */}
                <button
                    type="button"
                    className="h-[50] rounded-full bg-green-800 font-dmsans text-white hover:bg-green-900"
                >
                    Buat QRIS Sekarang
                </button>
            </div>
        </div>
    )
}
