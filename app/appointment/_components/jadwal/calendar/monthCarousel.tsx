"use client"

import { useRef, type ReactNode } from "react"
import { CAROUSEL_PAGE_CLASS } from "./constants"

interface CarouselPage {
    key: string
    content: ReactNode
}

interface MonthCarouselProps {
    pages: CarouselPage[]
    prevLabel?: string
    nextLabel?: string
}

interface ArrowButtonProps {
    direction: 1 | -1
    label: string
    onClick: (direction: 1 | -1) => void
}

function ArrowButton({ direction, label, onClick }: ArrowButtonProps) {
    return (
        <button
            type="button"
            onClick={() => onClick(direction)}
            aria-label={label}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-[18px] leading-none text-[#233D31] hover:border-green-800 hover:text-green-800"
        >
            {direction === -1 ? "‹" : "›"}
        </button>
    )
}

// Pembungkus geser horizontal antar bulan (swipe di mobile, tombol di desktop).
export default function MonthCarousel({
    pages,
    prevLabel = "Bulan sebelumnya",
    nextLabel = "Bulan berikutnya",
}: MonthCarouselProps) {
    const scrollRef = useRef<HTMLDivElement>(null)

    const scrollByPage = (direction: 1 | -1) => {
        const el = scrollRef.current
        if (!el) return
        el.scrollBy({ left: direction * el.clientWidth, behavior: "smooth" })
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-2">
                <p className="font-dmsans text-[11px] text-gray-500">
                    Geser untuk melihat bulan lainnya
                </p>
                <div className="flex gap-2">
                    <ArrowButton direction={-1} label={prevLabel} onClick={scrollByPage} />
                    <ArrowButton direction={1} label={nextLabel} onClick={scrollByPage} />
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
                {pages.map((page) => (
                    <div key={page.key} className={CAROUSEL_PAGE_CLASS}>
                        {page.content}
                    </div>
                ))}
            </div>
        </div>
    )
}
