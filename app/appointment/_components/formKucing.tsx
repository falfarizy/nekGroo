"use client"
import { useState } from "react"
import InputForm, { FormChangeEvent } from "./inputForm"
import { Services, CatForm } from "./listServices"


interface formProps  {
    formIndex: number,
    availableOption: Services[],
    formData: CatForm,
    onChange: (index: number, updateData: CatForm) => void
}


export default function Form({
    formIndex,
    availableOption,
    formData,
    onChange,
}:formProps) {

    // Perubahan input
    const handleChange = (e: FormChangeEvent) => {
        const {name, value} = e.target
        onChange(formIndex, {
            ...formData,
            [name]: value,
        }) 
    }

    // Reset pilihan layanan pada form ini
    const handleClearService = () => {
        onChange(formIndex, {
            ...formData,
            selectedServiceId: "",
        })
    }

    const serviceOption = availableOption.map((item) => ({
        value: item.id,
        label: item.paket
    }))

    return (
        <div className="bg-white p-[20] rounded-[15px] border-2 border-gray-200 flex flex-col">
            <h1 className="text-black font-fraunces text-[25px]">Meong {formIndex+1}</h1>
            <InputForm 
                type="text" 
                id={`nama-${formIndex}`} 
                name="name"
                value={formData.name} 
                onChange={handleChange} 
                label="Nama Kucing" 
                placeholder="Noky"/>
            <InputForm 
                type="text" 
                id={`ras-${formIndex}`} 
                name="ras"
                value={formData.ras} 
                onChange={handleChange} 
                label="Ras Kucing" 
                placeholder="Domestic"/>
            <InputForm 
                type="option" 
                id={`age-${formIndex}`}
                name="age"
                options={["Kitten", "Adult"]} 
                value={formData.age} 
                onChange={handleChange}
                label="Kategori Umur"/>
            <InputForm 
                type="option" 
                id={`gender-${formIndex}`}
                name="gender"
                options={["Jantan", "Betina"]} 
                value={formData.gender} 
                onChange={handleChange}
                label="Jenis Kelamin"/>

            <InputForm 
                type="option" 
                id={`service-${formIndex}`}
                name="selectedServiceId"
                options={serviceOption} 
                onChange={handleChange} 
                value={formData.selectedServiceId}
                label="Layanan"/>
            {formData.selectedServiceId !== "" && (
                <button
                    type="button"
                    onClick={handleClearService}
                    className="self-end mt-2 text-[12px] font-bold text-green-800 hover:underline"
                >
                    Hapus pilihan layanan
                </button>
            )}
        </div>
    )
}