"use client"
import { useState } from "react"

export default function Step({page}:{page:number}) {
    const next = "Berikutnya: Data diri kucing"

    const totalStep = 5

    return (
        <div className="w-full h-[103] bg-white px-6 py-5">
            <div className="flex justify-center">
                <ul className="flex gap-4 w-fit">
                    {Array.from({length: totalStep}).map((_, index) => {
                        const step = index + 1
                        const isActive = step <= page

                        return (
                            <li key={step} className={`w-[51] h-[32] rounded-full ${isActive? "bg-green-800 text-white" : "bg-gray-100 text-gray-700"} content-center text-center`}>{step}</li>
                        )
                    }) }
                </ul>
            </div>
            <div className="flex justify-between w-full mt-3 items-center">
                <p className="text-gray-900 font-bold">Layanan</p>
                <p className="text-gray-400 text-[13px]">{next}</p>
            </div>
        </div>
    )
}