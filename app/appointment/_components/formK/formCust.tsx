import InputForm, { FormChangeEvent } from "./inputForm"
import { CustomerForm } from "./listServices"

interface FormCustProps {
    formData: CustomerForm,
    onChange: (data:CustomerForm) => void
}

export default function FormCust({formData, onChange}:FormCustProps) {

    const handleChange = (e: FormChangeEvent) => {
        onChange({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    return (
        <div className="bg-white p-[20] rounded-[15px] border-2 border-gray-200 flex flex-col">
            <InputForm
                type="text" 
                id="name" 
                name="name"
                value={formData.name} 
                onChange={handleChange} 
                label="Nama Anda" 
                placeholder="Ahmad"
            />
            <InputForm
                type="text" 
                id="phone" 
                name="phone"
                value={formData.phone} 
                onChange={handleChange} 
                label="Nomor Telepon" 
                placeholder="08XX-XXX-XXX-XXX"
            />
            <InputForm
                type="textarea" 
                id="alamat" 
                name="alamat"
                value={formData.alamat} 
                onChange={handleChange} 
                label="Alamat Rumah" 
                placeholder="Umbulharjo, Yogyakarta"
                rows={3}
            />
        </div>
    )
}