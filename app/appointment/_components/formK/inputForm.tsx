"use client"
import { useEffect, useRef } from "react"

export interface OptionItems {
    value: string,
    label: string,
}

// Tipe event yang dipakai semua form (input, select, textarea)
export type FormChangeEvent = React.ChangeEvent<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
>

interface InputFormProps {
    id: string,
    name:string,
    label: string,
    placeholder?: string, 
    type: "text" | "option" | "textarea" | string, 
    options?:string[] | OptionItems[], 
    value:string, 
    rows?: number,
    onChange: (e: FormChangeEvent) => void
}

export default function InputForm({
    id, 
    name,
    label, 
    placeholder, 
    type, 
    options = [], 
    value, 
    rows = 3,
    onChange}: InputFormProps) {

    const textareaRef = useRef<HTMLTextAreaElement>(null)

    // Tinggi textarea mengikuti isi: melebar ke bawah saat teks melebihi batas
    useEffect(() => {
        const el = textareaRef.current
        if (!el) return
        el.style.height = "auto"
        el.style.height = `${el.scrollHeight}px`
    }, [value, type])

    return (
        <div className="text-black flex flex-col font-dmsans mt-4 gap-2">
            <label htmlFor={id} className="text-[13px] font-bold">{label}</label>
            { type == "option" ? 
                (<select 
                    name={name} 
                    id={id} 
                    value={value} 
                    onChange={onChange} 
                    className="border-[1] border-gray-400 rounded-[10px] h-[50] px-4">

                    <option value="" disabled>
                        {placeholder || `-- Pilih ${label} --`}
                    </option>
                                
                    {options.map((items, index) => {
                        if(typeof items === "string") {
                            return (
                                <option key={index} value={items}>{items}</option>
                            )
                        }
                        return (
                            <option key={items.value || index} value={items.value}>{items.label}</option>
                        ) 
                    })}
                </select>) : type == "textarea" ?
                (<textarea 
                    ref={textareaRef}
                    name={name} 
                    id={id} 
                    placeholder={placeholder} 
                    value={value}
                    onChange={onChange}
                    rows={rows}
                    className="border-[1] border-gray-400 rounded-[10px] px-4 py-3 resize-none overflow-hidden leading-6"/>) :
                (<input 
                    type={type} 
                    name={name} 
                    id={id} 
                    placeholder={placeholder} 
                    value={value}
                    onChange={onChange}
                    className="border-[1] border-gray-400 rounded-[10px] h-[50] px-4"/>)
            }
        </div>
    )
    
}