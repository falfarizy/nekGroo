import {
    DAY_CELL_BASE_CLASS,
    DAY_STATUS_CLASS,
    type DayStatus,
} from "./constants"

interface DayCellProps {
    day: number
    iso: string
    status: DayStatus
    isDisabled: boolean
    ariaLabel: string
    onSelect: (iso: string) => void
}

// Satu tombol tanggal. Hanya mengurus tampilan, bukan aturan bisnis.
export default function DayCell({
    day,
    iso,
    status,
    isDisabled,
    ariaLabel,
    onSelect,
}: DayCellProps) {
    const isSelected = status === "selected"
    const isFull = status === "full"

    return (
        <button
            type="button"
            disabled={isDisabled}
            onClick={() => onSelect(iso)}
            aria-pressed={isSelected}
            aria-label={ariaLabel}
            className={`${DAY_CELL_BASE_CLASS} ${DAY_STATUS_CLASS[status]}`}
        >
            <span className="text-[14px] font-bold leading-none">{day}</span>
            <span className="mt-1 text-[9px] leading-none">
                {isFull && !isSelected ? "Penuh" : ""}
            </span>
        </button>
    )
}
