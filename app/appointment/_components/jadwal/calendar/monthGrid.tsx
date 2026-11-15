import { DAY_LABELS, MAX_SLOT_PER_DAY } from "./constants"
import DayCell from "./dayCell"
import {
    buildMonthCells,
    formatLongDate,
    getDayState,
    getMonthLabel,
    type MonthRef,
} from "./utils"

interface MonthGridProps {
    monthRef: MonthRef
    today: Date
    value: string | null
    onChange: (date: string) => void
}

// Grid satu bulan: judul bulan + label hari + sel tanggal.
export default function MonthGrid({ monthRef, today, value, onChange }: MonthGridProps) {
    const { year, month } = monthRef
    const cells = buildMonthCells(year, month)

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-2">
                <h2 className="font-fraunces text-[22px] text-[#233D31]">
                    {getMonthLabel(monthRef)}
                </h2>
                <span className="font-dmsans text-[11px] text-gray-500">
                    Maks {MAX_SLOT_PER_DAY}/hari
                </span>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center">
                {DAY_LABELS.map((label) => (
                    <div
                        key={label}
                        className="font-dmsans text-[12px] font-bold text-gray-500 py-1"
                    >
                        {label}
                    </div>
                ))}

                {cells.map((day, index) => {
                    if (day === null) {
                        return <div key={`empty-${index}`} />
                    }

                    const state = getDayState({ year, month, day, today, value })
                    const ariaLabel = `${formatLongDate(state.iso)}${
                        state.isFull ? " - penuh" : ""
                    }`

                    return (
                        <DayCell
                            key={state.iso}
                            day={day}
                            iso={state.iso}
                            status={state.status}
                            isDisabled={state.isDisabled}
                            ariaLabel={ariaLabel}
                            onSelect={onChange}
                        />
                    )
                })}
            </div>
        </div>
    )
}
