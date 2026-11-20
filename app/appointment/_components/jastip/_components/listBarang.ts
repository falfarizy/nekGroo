// Data dan tipe yang dipakai fitur jasa titip (jastip).

export interface Barang {
    id: string
    nama: string
    kategori: string
    stok: number
    harga: number
    gambar: string
}

export const DAFTAR_BARANG: Barang[] = [
    {
        id: "makanan-premium",
        nama: "Makanan Kucing Premium 1 kg",
        kategori: "Makanan",
        stok: 15,
        harga: 95000,
        gambar: "/images/jastip/makanan-premium.svg",
    },
    {
        id: "pasir-kucing",
        nama: "Pasir Kucing 5 Liter",
        kategori: "Pasir",
        stok: 10,
        harga: 65000,
        gambar: "/images/jastip/pasir-kucing.svg",
    },
    {
        id: "kaleng-basah",
        nama: "Makanan Kaleng Basah",
        kategori: "Makanan",
        stok: 24,
        harga: 18000,
        gambar: "/images/jastip/kaleng-basah.svg",
    },
    {
        id: "mainan",
        nama: "Mainan Kucing Bulu",
        kategori: "Mainan",
        stok: 20,
        harga: 35000,
        gambar: "/images/jastip/mainan.svg",
    },
    {
        id: "sisir-bulu",
        nama: "Sisir Bulu Kucing",
        kategori: "Perawatan",
        stok: 12,
        harga: 45000,
        gambar: "/images/jastip/sisir-bulu.svg",
    },
    {
        id: "vitamin",
        nama: "Vitamin Kucing",
        kategori: "Kesehatan",
        stok: 8,
        harga: 55000,
        gambar: "/images/jastip/vitamin.svg",
    },
]

// "Semua" selalu tersedia, sisanya diambil dari data barang.
export const KATEGORI_BARANG: string[] = [
    "Semua",
    ...Array.from(new Set(DAFTAR_BARANG.map((barang) => barang.kategori))),
]

export interface PesananJastip {
    id: string
    nama: string
    jumlah: number
    harga: number
    subtotal: number
}

export interface RingkasanJastip {
    pesanan: PesananJastip[]
    totalBarang: number
    totalHarga: number
}

export function formatRupiah(angka: number): string {
    return `Rp ${Math.max(0, angka).toLocaleString("id-ID")}`
}

// Ubah jumlah pilihan per barang menjadi rincian pesanan + totalnya.
export function buatRingkasan(quantities: Record<string, number>): RingkasanJastip {
    const pesanan: PesananJastip[] = []

    for (const barang of DAFTAR_BARANG) {
        const jumlah = Math.min(
            barang.stok,
            Math.max(0, Math.floor(quantities[barang.id] || 0))
        )

        if (jumlah === 0) continue

        pesanan.push({
            id: barang.id,
            nama: barang.nama,
            jumlah,
            harga: barang.harga,
            subtotal: barang.harga * jumlah,
        })
    }

    return {
        pesanan,
        totalBarang: pesanan.reduce((acc, item) => acc + item.jumlah, 0),
        totalHarga: pesanan.reduce((acc, item) => acc + item.subtotal, 0),
    }
}
