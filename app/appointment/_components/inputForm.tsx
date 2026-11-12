export interface OptionItems {
    value: string,
    label: string,
}

interface InputFormProps {
    id: string,
    name:string,
    label: string,
    placeholder?: string, 
    type: "text" | "option" | string, 
    options?:string[] | OptionItems[], 
    value:string, 
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}

export default function InputForm({
    id, 
    name,
    label, 
    placeholder, 
    type, 
    options = [], 
    value, 
    onChange}: InputFormProps) {
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
                </select>) : 
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