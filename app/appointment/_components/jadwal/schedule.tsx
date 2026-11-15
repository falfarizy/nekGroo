"use client"

import { useSyncExternalStore } from "react"
import MonthCarousel from "./calendar/monthCarousel"
import MonthGrid from "./calendar/monthGrid"
import ScheduleLegend from "./calendar/scheduleLegend"
import { formatLongDate, getVisibleMonths, startOfDay } from "./calendar/utils"

export { MAX_SLOT_PER_DAY } from "./calendar/constants"

export interface ScheduleProps {
    value: string | null
    onChange: (date: string) => void
}

// Kalender hanya dirender di client agar tidak terjadi hydration mismatch
// akibat perbedaan tanggal/timezone server dan browser.
const subscribe = () => () => {}
const getClientSnapshot = () => true
const getServerSnapshot = () => false

function SchedulePlaceholder() {
    return (
        <div className="bg-white rounded-[15px] border-2 border-gray-200 p-[20] text-center font-dmsans text-[13px] text-gray-400">
            Memuat jadwal...
        </div>
    )
}

function SelectedDateInfo({ value }: { value: string | null }) {
    return (
        <div className="min-h-[20] font-dmsans text-[12px] text-[#233D31]">
            {value ? (
                <span>
                    Jadwal dipilih:{" "}
                    <span className="font-bold text-green-800">{formatLongDate(value)}</span>
                </span>
            ) : (
                <span className="text-gray-400">Belum ada tanggal yang dipilih.</span>
            )}
        </div>
    )
}

export default function Schedule({ value, onChange }: ScheduleProps) {
    const mounted = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot)

    if (!mounted) return <SchedulePlaceholder />

    const today = startOfDay(new Date())
    const months = getVisibleMonths(today)

    return (
        <div className="bg-white rounded-[15px] border-2 border-gray-200 p-[20] flex flex-col gap-4 overflow-hidden">
            <p className="font-dmsans text-[11px] text-gray-500">
                Booking paling lambat H-1 — tanggal hari ini tidak dapat dipilih.
            </p>

            <MonthCarousel
                pages={months.map((monthRef) => ({
                    key: `${monthRef.year}-${monthRef.month}`,
                    content: (
                        <MonthGrid
                            monthRef={monthRef}
                            today={today}
                            value={value}
                            onChange={onChange}
                        />
                    ),
                }))}
            />

            <ScheduleLegend />

            <SelectedDateInfo value={value} />
        </div>
    )
}
