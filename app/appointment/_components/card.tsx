"use client"
import { useEffect, useState } from "react"
import CheckIcon from "../../components/icons/checkIcon"
import PlusIcon from "@/app/components/icons/plusIcon"
import MinusIcon from "@/app/components/icons/minusIcon"
import { hargaKitten } from "./listServices"


interface CardProps {
    id:string,
    paket:string,
    harga:string,
    layanan:string[],
    jumlah: number,
    onQuantityChange: (id:string, delta: number) => void,
    onToggleSelect: (id:string) => void
}

export default function Card({
    id,
    paket,
    harga,
    layanan,
    jumlah,
    onQuantityChange,
    onToggleSelect
}:CardProps) {

    const isSelected = jumlah > 0

    return (
        <div 
            onClick={() => {
                onToggleSelect(id)
            }} 
            className={`flex flex-col justify-between h-[368] rounded-[18] px-6 py-8 text-black border-2 ${isSelected ? "border-green-800 bg-[#EDF3E8]" : "border-gray-300 bg-white"}`}>
            <h1 className="text-[25px] text-black font-fraunces">{paket}</h1>
            <div className="flex flex-col gap-1">
                <span className="text-[13px] font-dmsans text-gray-500">Adult</span>
                <span className="text-[23px] font-dmsans font-bold">{harga}</span>
                <span className="text-[13px] font-dmsans text-gray-500">
                    Kitten: <span className="font-bold text-green-800">{hargaKitten(harga)}</span>
                </span>
            </div>
            <hr className="border-[1.5] border-gray-200 my-2"/>
            <ul className="list-inside text-[13px] leading-10">
                {layanan.map((items, index) => (
                    <li key={index} className="flex items-center gap-4">
                        <CheckIcon/>{items}</li>
                ))}
            </ul>
            <div className="flex gap-2 justify-end">
                <span>Jumlah</span>
                <button onClick={(e) => {e.stopPropagation(); onQuantityChange(id, -1)}} disabled={!isSelected}>
                    <MinusIcon/>
                </button>
                <span>{jumlah}</span>
                <button onClick={(e) => {e.stopPropagation(); onQuantityChange(id, 1)}} disabled={!isSelected}>
                    <PlusIcon/>
                </button>
            </div>
        </div>
    )
}