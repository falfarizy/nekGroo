import InputForm from "./inputForm"
export default function FormCust() {
    return (
        <div className="bg-white p-[20] rounded-[15px] border-2 border-gray-200 flex flex-col">
            <InputForm
                type="text" 
                id="nama" 
                name="nama"
                value={formData.name} 
                onChange={handleChange} 
                label="Nama Kucing" 
                placeholder="Noky"
            />
            <InputForm/>
            <InputForm/>
        </div>
    )
}