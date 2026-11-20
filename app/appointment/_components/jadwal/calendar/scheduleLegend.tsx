interface LegendItem {
    label: string
    markerClass: string
}

const LEGEND_ITEMS: LegendItem[] = [
    { label: "Tersedia", markerClass: "border border-gray-300 bg-white" },
    { label: "Penuh", markerClass: "bg-red-200" },
    { label: "Lewat batas H-1", markerClass: "bg-gray-200" },
    { label: "Dipilih", markerClass: "bg-green-800" },
]

// Keterangan warna sel kalender.
export default function ScheduleLegend() {
    return (
        <div className="flex flex-wrap items-center gap-4 font-dmsans text-[11px] text-gray-600">
            {LEGEND_ITEMS.map((item) => (
                <span key={item.label} className="flex items-center gap-1.5">
                    <span className={`h-2.5 w-2.5 rounded-full ${item.markerClass}`} />
                    {item.label}
                </span>
            ))}
        </div>
    )
}
