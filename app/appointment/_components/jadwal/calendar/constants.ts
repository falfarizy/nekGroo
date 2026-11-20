// Nilai tetap yang dipakai seluruh komponen kalender.

export const DAY_LABELS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"] as const

// Kapasitas maksimal booking per hari.
export const MAX_SLOT_PER_DAY = 6

// Jumlah bulan yang ditampilkan (bulan berjalan + bulan berikutnya).
export const MONTHS_TO_SHOW = 2

// Booking paling lambat H-1: tanggal hari ini (H-0) sudah tidak bisa dipesan.
export const MIN_BOOKING_DAYS_AHEAD = 1

// Status visual sebuah sel tanggal.
export type DayStatus = "selected" | "full" | "past" | "available"

// Satu sumber styling per status, supaya tidak ada className yang tersebar.
export const DAY_STATUS_CLASS: Record<DayStatus, string> = {
    selected: "bg-green-800 text-white border-green-800",
    full: "bg-red-50 text-red-400 border-red-100 cursor-not-allowed",
    past: "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed",
    available:
        "bg-white text-[#233D31] border-gray-200 hover:border-green-800 hover:bg-[#EDF3E8]",
}

// Kelas dasar tombol tanggal.
export const DAY_CELL_BASE_CLASS =
    "flex h-[56] flex-col items-center justify-center rounded-[10px] border font-dmsans transition-colors"

// Kelas satu halaman bulan di dalam carousel.
export const CAROUSEL_PAGE_CLASS = "w-full shrink-0 snap-start"
