import {
    MAX_SLOT_PER_DAY,
    MIN_BOOKING_DAYS_AHEAD,
    MONTHS_TO_SHOW,
    type DayStatus,
} from "./constants"

export interface MonthRef {
    year: number
    month: number
}

export interface DayState {
    iso: string
    status: DayStatus
    isDisabled: boolean
    isFull: boolean
}

// Format tanggal lokal ke YYYY-MM-DD (bukan UTC, agar tidak geser hari).
export function toLocalISO(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
}

// Normalkan tanggal ke 00:00 waktu lokal supaya perbandingan hanya per hari.
export function startOfDay(date: Date): Date {
    const normalized = new Date(date)
    normalized.setHours(0, 0, 0, 0)
    return normalized
}

export function addDays(date: Date, days: number): Date {
    const result = startOfDay(date)
    result.setDate(result.getDate() + days)
    return result
}

// Tanggal paling awal yang masih boleh dipesan (default: besok / H-1).
export function getEarliestBookableDate(today: Date): Date {
    return addDays(today, MIN_BOOKING_DAYS_AHEAD)
}

// True jika tanggal sudah melewati batas booking (hari ini dan sebelumnya).
export function isBeforeBookingWindow(date: Date, today: Date): boolean {
    return startOfDay(date).getTime() < getEarliestBookableDate(today).getTime()
}

// Ambil daftar bulan yang ditampilkan, dimulai dari bulan `startDate`.
export function getVisibleMonths(startDate: Date, count = MONTHS_TO_SHOW): MonthRef[] {
    const year = startDate.getFullYear()
    const month = startDate.getMonth()

    return Array.from({ length: count }, (_, index) => {
        const date = new Date(year, month + index, 1)
        return { year: date.getFullYear(), month: date.getMonth() }
    })
}

// Sel kalender: kosong di awal bulan + tanggal 1..akhir bulan.
export function buildMonthCells(year: number, month: number): (number | null)[] {
    const firstDayOffset = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const cells: (number | null)[] = [
        ...Array.from({ length: firstDayOffset }, () => null),
        ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
    ]

    while (cells.length % 7 !== 0) cells.push(null)

    return cells
}

export function getMonthLabel({ year, month }: MonthRef): string {
    return new Date(year, month, 1).toLocaleDateString("id-ID", {
        month: "long",
        year: "numeric",
    })
}

export function formatLongDate(iso: string): string {
    return new Date(`${iso}T00:00:00`).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    })
}

// Tentukan status satu sel tanggal berdasarkan tanggal hari ini dan pilihan user.
export function getDayState(params: {
    year: number
    month: number
    day: number
    today: Date
    value: string | null
}): DayState {
    const { year, month, day, today, value } = params

    const date = startOfDay(new Date(year, month, day))
    const iso = toLocalISO(date)
    const isPast = isBeforeBookingWindow(date, today)
    const isFull = getBookedCount(year, month, day) >= MAX_SLOT_PER_DAY
    const isSelected = value === iso

    const status: DayStatus = isSelected
        ? "selected"
        : isFull
          ? "full"
          : isPast
            ? "past"
            : "available"

    return {
        iso,
        status,
        isDisabled: isPast || isFull,
        isFull,
    }
}

// Mock: jumlah booking yang sudah masuk pada suatu tanggal (0..MAX_SLOT_PER_DAY).
// Deterministik per bulan agar tampilan tiap bulan berbeda.
export function getBookedCount(year: number, month: number, day: number): number {
    const seed = (year + month) * 31 + day
    return seed % (MAX_SLOT_PER_DAY + 1)
}

// Sisa slot yang masih bisa dipesan pada tanggal tertentu (ISO YYYY-MM-DD).
export function getAvailableSlots(iso: string): number {
    const date = new Date(`${iso}T00:00:00`)
    if (Number.isNaN(date.getTime())) return 0

    const booked = getBookedCount(date.getFullYear(), date.getMonth(), date.getDate())
    return Math.max(0, MAX_SLOT_PER_DAY - booked)
}
