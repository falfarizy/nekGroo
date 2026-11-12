"use client"
import { useEffect, useState } from "react"
import Form from "./_components/formKucing"
import CardsLayout from "./_components/cardLayout"
import Step from "./_components/step"
import { SERVICES, CatForm } from "./_components/listServices"
import FormCust from "./_components/formCust"

export default function Appointment() {
    // Page navigation
    const [page, setPage] = useState<number>(1)
    //Jumlah layanan yang dipilih 
    const [quantity, setQuantity] = useState<Record<string, number>>({}) 
    //jumlah form tergantung jumlah layanan
    const [formList, setFormList] = useState<CatForm[]>([]) 
    //persetujuan syarat sebelum kirim data
    const [isAgreed, setIsAgreed] = useState(false)

    useEffect(() => {
        window.scrollTo({top:0, behavior:"smooth"})
    },[page])

    // handler jumlah layanan (+ -)
    const handleQuantityChange = (id:string, nilaiPerubahan:number) => {
        setQuantity((prev) => {
            const current = prev[id] || 0
            const next = Math.max(0, current + nilaiPerubahan)
            return {...prev, [id]:next}
        })
    }
    
    //jika card dipilih quantity = 1 : 0
    const handleToggleSelect = (id:string) => {
        setQuantity((prev) => {
            const current =  prev[id] || 0
            return {
                ...prev,
                [id]: current>0?0:1
            }
        })
    }

    // tampilkan form sesuai jumlah layanan dipilih
    const handleNextToPageTwo = () => {
        const totalForm = Object.values(quantity).reduce((acc, q) => acc + q, 0)
        if (totalForm === 0) {
            return
        }

        const initialForms: CatForm[] = Array.from({length:totalForm}, () => ({
            name: "",
            ras: "",
            age: "",
            gender: "",
            selectedServiceId: ""
        }))

        setFormList(initialForms)
        setPage(2)
    }

    const handleFormChange = (index:number, updatedData: CatForm) => {
        setFormList((prev) => 
            prev.map((item, idx) => (idx === index?updatedData:item))
        )
    }

    // Filter card terpilih
    const selectedServiceList = SERVICES.filter((item) => (quantity[item.id] || 0) > 0)

    // cek satu form sudah terisi lengkap
    const isFormComplete = (form: CatForm) =>
        form.name.trim() !== "" &&
        form.ras.trim() !== "" &&
        form.age !== "" &&
        form.gender !== "" &&
        form.selectedServiceId !== ""

    // semua form harus terisi dulu sebelum bisa kirim data
    const isAllFormsComplete = formList.length > 0 && formList.every(isFormComplete)

    const handleFinalSubmit = (e:React.FormEvent) => {
        e.preventDefault()
        const incompleteFormIndex = formList.findIndex((f) => !isFormComplete(f))
        if (incompleteFormIndex !== -1) {
            alert(`Harap lengkapi semua data pada Meong ${incompleteFormIndex + 1}!`);
            return;
        }

        if (!isAgreed) {
            alert("Harap centang pernyataan sebelum mengirim data!");
            return;
        }

        console.log("Submit All Forms Data:", formList);
        alert("Data berhasil dikirim!");
        setPage(3)

    }


    return (
        <div>
            <Step 
                page = {page}
            />
            {page===1 &&
            (
                <div className="h-fit px-6 py-8 bg-[#E4E5DA] flex flex-col gap-6">
                    <div className="flex flex-col gap-4 mb-4">
                        <h1 className="font-fraunces text-[#233D31] text-[32px] leading-10">Perawatan yang pas untuk si meong.</h1>
                        <p className="font-dmsans text-[14px] text-[#737A70] leading-6">Pilih paket grooming untuk si meong. Setiap sesi ditangani dengan sabar oleh groomer khusus kucing.</p>
                    </div>
                    <CardsLayout
                        quantities={quantity}
                        onQuantityChange={handleQuantityChange}
                        onToggleSelect={handleToggleSelect}
                    />
                    <button onClick={handleNextToPageTwo} className="bg-green-800 rounded-[20px] h-[50] hover:bg-green-900" >
                        Next Page
                    </button>
                </div>
            )}
            {page==2 &&
            (
                <div className="h-fit px-6 py-8 bg-[#E4E5DA] flex flex-col gap-6">
                    <h1 className="text-black font-fraunces text-[30px] text-center">Tentang Si Meong</h1>
                    <form onSubmit={handleFinalSubmit} className="flex flex-col gap-6">
                        {formList.map((formData, index) => {
                            // Sebuah layanan boleh dipakai beberapa form,
                            // sebanyak jumlah (quantity) yang dipilih di halaman 1.
                            const availableOptionsForThisForm = selectedServiceList.filter((s) => {
                                const usedByOthers = formList.filter(
                                    (f, idx) => idx !== index && f.selectedServiceId === s.id
                                ).length
                                const quota = quantity[s.id] || 0
                                return usedByOthers < quota || s.id === formData.selectedServiceId
                            })
                            

                            return (
                                <Form
                                    key={index}
                                    formIndex={index}
                                    formData={formData}
                                    availableOption={availableOptionsForThisForm}
                                    onChange={handleFormChange}
                                />
                            );
                        })}
                        <label htmlFor="agree" className="text-gray-800 text-[11px] flex items-start gap-2">
                            <input type="checkbox" id="agree" checked={isAgreed} onChange={(e) => setIsAgreed(e.target.checked)} className="mt-0.5" required/>Saya memastikan bahwa kucing sedang tidak dalam kondisi hamil, tidak sedang sakit, dan tidak galak
                        </label>
                        {/* {!isAllFormsComplete && (
                            <p className="text-[12px] text-red-600 text-center">
                                Lengkapi semua data kucing terlebih dahulu sebelum mengirim.
                            </p>
                        )} */}
                        <button
                            type="submit"
                            disabled={!isAllFormsComplete || !isAgreed}
                            className="bg-green-800 hover:bg-green-900 h-[50] rounded-[20px] disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
                        >
                            Kirim Data
                        </button>
                    </form>
                    <button onClick={() => setPage(1)} className="bg-green-800 rounded-[20px] h-[50] hover:bg-green-900">
                        Previous
                    </button>
                </div>
            )}
            {page == 3 &&
            (
                <FormCust/>
            )}
        </div>
    )
}